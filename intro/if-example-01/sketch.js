// Ejemplos tomados del libro Getting Started with p5js

// comenta uno a uno los siguientes bloques de texto.

// evita descomentar mas de uno a la vez


//ejemplo 1 de if


function setup() {
    createCanvas(240, 120);
    strokeWeight(30);
}
function draw() {
    background(204);
    stroke(102);
    line(40, 0, 70, height);
    if (mouseIsPressed == true) {
        stroke(0);
    }
    line(0, 70, width, 50);
}


//ejemplo 2 if-else
/*
function setup() {
    createCanvas(240, 120);
    strokeWeight(30);
}

function draw() {
    background(204);
    stroke(102);
    line(40, 0, 70, height);
    if (mouseIsPressed) {
        stroke(0);
    } else {
        stroke(255);
    }
    line(0, 70, width, 50);
}

*/

// ejemplo 3 if anidado

/*
function setup() {
    createCanvas(120, 120);
    strokeWeight(30);
}

function draw() {
    background(204);
    stroke(102);
    line(40, 0, 70, height);
    if (mouseIsPressed) {
        if (mouseButton == LEFT) {
            stroke(255);
        } else {
            stroke(0);
        }
        line(0, 70, width, 50);
    }
}

*/