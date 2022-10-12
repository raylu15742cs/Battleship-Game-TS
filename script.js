"use strict";
const gamecontainer = document.getElementById('gameboard');
let shipstorage = [
    { title: 'Carrier', length: 5, count: 0, max: 59, sunk: false },
    { title: 'Battleship', length: 4, count: 0, max: 69, sunk: false },
    { title: 'Zruiser', length: 3, count: 0, max: 79, sunk: false },
    { title: 'Destroyer', length: 2, count: 0, max: 89, sunk: false },
    { title: 'Submarine', length: 1, count: 0, max: 99, sunk: false },
];
let computershipstorage = [
    { title: 'ECarrier', length: 5, count: 0, max: 59, sunk: false },
    { title: 'FBattleship', length: 4, count: 0, max: 69, sunk: false },
    { title: 'GZruiser', length: 3, count: 0, max: 79, sunk: false },
    { title: 'HDestroyer', length: 2, count: 0, max: 89, sunk: false },
    { title: 'ISubmarine', length: 1, count: 0, max: 99, sunk: false },
];
// create player and computer gameboard
function buildgameboard(height, player) {
    let gameboard = document.createElement('div');
    let innerboard = document.createElement('div');
    let title = document.createElement("div");
    title.classList.add("title");
    title.innerText = player;
    gameboard.appendChild(title);
    innerboard.setAttribute("id", player);
    for (let i = 0; i < height; i++) {
        let boxrow = document.createElement('div');
        innerboard.appendChild(boxrow);
        for (let j = 0; j < height; j++) {
            let box = buildbox(player, j, i);
            boxrow.appendChild(box);
        }
        gameboard.appendChild(innerboard);
    }
    if (gamecontainer != null) {
        gamecontainer.appendChild(gameboard);
    }
}
function buildbox(player, i, j) {
    let box = document.createElement('div');
    box.setAttribute('id', `${player}${i}${j}`);
    box.classList.add('box');
    box.addEventListener('mouseenter', function () {
        box.classList.add('blackhover');
    });
    box.addEventListener('mouseenter', function () {
        box.classList.remove('blackhover');
    });
    box.addEventListener('click', hit, { once: true });
    if (player == "Human") {
        box.addEventListener('click', ships);
    }
    if (player == "Computer") {
        box.addEventListener("click", hitback, { once: true });
    }
    return box;
}
buildgameboard(10, "Human");
buildgameboard(10, 'Computer');
// create player ships
let shipcount = 0;
let shiptaken = [];
function ships(e) {
    let currentspot = e.path[0].id;
    if (shipcount < 5 && shipstorage[shipcount].max > currentspot.slice(-2)) {
        let location = parseInt(currentspot.slice(-2));
        let failcount = true;
        // loop though count for each spot and make sure its not taken
        for (let i = 0; i < shipstorage[shipcount].length; i++) {
            if (shiptaken.includes(location)) {
                failcount = false;
            }
            else {
                shiptaken.push(location);
                location += 10;
            }
        }
        // check the loop and then run it
        if (failcount) {
            let exactlocation = currentspot.slice(-2);
            for (let i = 0; i < shipstorage[shipcount].length; i++) {
                let ship = document.getElementById(`Human${exactlocation}`);
                if (ship != null) {
                    ship.removeEventListener("click", hit);
                    let shipinner = document.createElement('div');
                    shipinner.setAttribute('id', `${shipstorage[shipcount].title[0]}${i}`);
                    shipinner.classList.add('playership');
                    shipinner.classList.add("playershipcolor");
                    shipinner.addEventListener('click', hit, { once: true });
                    ship.appendChild(shipinner);
                    exactlocation = parseInt(exactlocation) + 10;
                }
            }
            shipcount++;
        }
    }
}
//ships();
// create computer ships
//need to create computerships and make sure it works on click 
let computerspottaken = [];
let failcount = 0;
function computerships() {
    for (let i = 0; i < computershipstorage.length; i++) {
        let currentrandom = random();
        if (computershipstorage[i].max > currentrandom) {
            computershiptest(currentrandom, i);
            if (failcount == 0) {
                for (let j = 0; j < computershipstorage[i].length; j++) {
                    if (currentrandom < 10) {
                        let target = document.getElementById(`Computer0${currentrandom}`);
                        if (target != null) {
                            target.removeEventListener('click', hit);
                            let compshipinner = document.createElement("div");
                            compshipinner.setAttribute("id", `${computershipstorage[i].title[0]}${j}`);
                            compshipinner.addEventListener('click', comphit, { once: true });
                            compshipinner.classList.add('playership');
                            target.appendChild(compshipinner);
                            currentrandom += 10;
                        }
                    }
                    else {
                        let target = document.getElementById(`Computer${currentrandom}`);
                        if (target != null) {
                            target.removeEventListener('click', hit);
                            let compshipinner = document.createElement('div');
                            compshipinner.setAttribute('id', `${computershipstorage[i].title[0]}${j}`);
                            compshipinner.addEventListener('click', comphit, { once: true });
                            compshipinner.classList.add('playership');
                            target.appendChild(compshipinner);
                            currentrandom += 10;
                        }
                    }
                }
            }
            else {
                failcount = 0;
                console.log("oops");
                i--;
            }
        }
        else {
            i--;
        }
    }
}
// computer hit 
function comphit(e) {
    let box = document.getElementById(e.path[0].id);
    if (box != null) {
        box.classList.remove('playershipcolor');
        box.classList.add('playerhit');
        box.innerHTML = 'X';
        isCSunk(e);
    }
}
function isCSunk(e) {
    let locator = e.path[0].id[0];
    for (let i = 0; i < computershipstorage.length; i++) {
        if (locator == computershipstorage[i].title[0]) {
            computershipstorage[i].count++;
        }
    }
    for (let i = 0; i < computershipstorage.length; i++) {
        if (computershipstorage[i].count == computershipstorage[i].length) {
            computershipstorage[i].sunk = true;
            for (let j = 0; j < computershipstorage[i].length; j++) {
                let shipsname = computershipstorage[i].title;
                let target = document.getElementById(`${shipsname[0]}${j}`);
                if (target != null) {
                    target.classList.add('sunk');
                    target.classList.remove('playhit');
                }
            }
        }
    }
}
// test if ship can be there 
function computershiptest(currentrandom, position) {
    let current = currentrandom;
    for (let i = 0; i < computershipstorage[position].length; i++) {
        if (computerspottaken.includes(current)) {
            failcount++;
            i += 10;
        }
        else {
            computerspottaken.push(current);
            current += 10;
        }
    }
}
computerships();
// tracks hits
function hit(e) {
    if (shipcount == 5) {
        let box = document.getElementById(e.path[0].id);
        if (box != null) {
            if (e.path.length == 10) {
                box.classList.remove('playershipcolor');
                box.classList.add('playerhit');
                box.innerHTML = 'X';
                isSunk(e);
            }
            else {
                box.classList.add('hits');
            }
        }
    }
}
// tracks sunks
function isSunk(e) {
    let shipname = e.path[0].id.slice(0, -1);
    for (let i = 0; i < shipstorage.length; i++) {
        if (shipname == shipstorage[i].title[0]) {
            shipstorage[i].count++;
        }
    }
    for (let i = 0; i < shipstorage.length; i++) {
        if (shipstorage[i].count == shipstorage[i].length) {
            shipstorage[i].sunk = true;
            for (let j = 0; j < shipstorage[i].length; j++) {
                let shipsname = shipstorage[i].title;
                let target = document.getElementById(`${shipsname[0]}${j}`);
                if (target != null) {
                    target.classList.add('sunk');
                    target.classList.remove('playhit');
                }
            }
        }
    }
    gameover();
}
//random 
function random() {
    let randomnumber = Math.floor(Math.random() * 100);
    return randomnumber;
}
// hitback
let taken = [];
function hitback() {
    if (shipcount == 5) {
        let currentrandom = random();
        if (taken.includes(currentrandom)) {
            hitback();
        }
        else {
            taken.push(currentrandom);
            if (currentrandom < 10) {
                let target = document.getElementById(`Human0${currentrandom}`);
                if (target != null) {
                    if (target.innerHTML != null) {
                        let shiptarget = document.getElementById(`${target.innerHTML.substring(9, 11)}`);
                        if (shiptarget != null) {
                            shiptarget.click();
                        }
                        //console.log(target.innerHTML.substring(9,11));
                    }
                    else {
                        target.click();
                    }
                }
            }
            else {
                let target = document.getElementById(`Human${currentrandom}`);
                if (target != null) {
                    if (target.innerHTML != null) {
                        let shiptarget = document.getElementById(`${target.innerHTML.substring(9, 11)}`);
                        if (shiptarget != null) {
                            shiptarget.click();
                        }
                    }
                    target.click();
                }
            }
        }
    }
}
// gameover
function gameover() {
    let shipsunkcount = 0;
    let computershipsunkcount = 0;
    for (let i = 0; i < shipstorage.length; i++) {
        if (shipstorage[i].sunk) {
            shipsunkcount++;
        }
        if (shipsunkcount == 5) {
            alert("You Lose");
        }
    }
    for (let i = 0; i < computershipstorage.length; i++) {
        if (computershipstorage[i].sunk) {
            computershipsunkcount++;
        }
        if (computershipsunkcount == 5) {
            alert('You Win');
        }
    }
}
