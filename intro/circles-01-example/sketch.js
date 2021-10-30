
function setup() {
  createCanvas(800, 600);
  background(250);
}

function draw() {
background(250);
  if (mouseIsPressed) {
    fill(255);
  } else {
    fill(85);
  }
  ellipse(mouseX, mouseY, 125, 125);
}