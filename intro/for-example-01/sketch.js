// Ejemplos tomados del libro Getting Started with p5js

//comenta uno a uno los siguientes bloques de texto.

//evita descomentar mas de uno a la vez


//ejemplo 1 de for

/*

function setup() {
    createCanvas(800, 600);
    strokeWeight(2);
}
function draw() {
    background(204);
    for (var i = 20; i < 800; i ++ ) {
        line(i, 100, i + 60, 80);
    }
}

*/

//ejemplo 2 for
/*
function setup() {
    createCanvas(800, 600);
    strokeWeight(2);
}
function draw() {
    background(204);
    for (var i = 20; i < 600; i += 20) {
        /////x1, y1, x2, y2
        line(i, 0, i + i/2, 80);
    }
}
*/

// ejemplo 3 if anidado
/*

function setup() {
    createCanvas(800, 600);
    strokeWeight(2);
}

function draw() {
    background(204);
    for (var i = 20; i < 400; i += 20) {
        line(i, 0, i + i/2, 80);
        line(i + i/2, 80, i*1.2, 120);
    }
}

*/
// ejemplo 4 punch! de for 

var num = 200;
var x = [];
var y = [];

function setup() {
    createCanvas(800, 600);
    noStroke();
    for (var i = 0; i < num; i++) {
        x[i] = 0;
        y[i] = 0;
    }
}

function draw() {
    background(0);
// Copy array values from back to front
    for (var i = num-1; i > 0; i--) {
        x[i] = x[i-1];
        y[i] = y[i-1];
    }
    x[0] = mouseX; // Set the first element
    y[0] = mouseY; // Set the first element
    for (var i = 0; i < num; i++) {
        fill(i * 4);
        ellipse(x[i], y[i], 40, 40);
    }
}