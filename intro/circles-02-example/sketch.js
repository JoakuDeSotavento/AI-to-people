let number = 0;
let delta = 1;

function setup() {
  createCanvas(window.screen.width, window.screen.height);
  background(125);
}

function draw() {

  if (mouseIsPressed) {
    number += delta;
    if (number > 254) { delta = -1; }
    if (number < 1) { delta = 1; }
  }

  fill(number);
  ellipse(100, 100, number, number);
}