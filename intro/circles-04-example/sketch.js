let ellipseWidth = 0;
let ellipseColor = 0;
let deltaWidth = 1;
let mic;
let canvas;
let wait = 0;

function setup() {
  canvas = createCanvas(window.screen.width, window.screen.height);
  colorMode(HSB, 255);
  background(255);
  userStartAudio();
  mic = new p5.AudioIn();
  mic.start();
}

function draw() {

  if (mouseIsPressed) {
    ellipseWidth += deltaWidth;
    ellipseColor += 1;
    if (ellipseWidth > 255) deltaWidth = -1;
    if (ellipseWidth < 1) deltaWidth = 1;
    if (ellipseColor > 255) ellipseColor = 1;
  }

  if (keyIsPressed) {

    if (keyCode === DELETE) { // borrar
      background(255);
    }
    if (keyCode === SHIFT) { // aumentar
      if (ellipseWidth < 255) ellipseWidth++; 
    }
    if (keyCode === CONTROL) { // disminuir
      if (ellipseWidth > 1) ellipseWidth--; 
    }
    if (keyCode === UP_ARROW) { // color
      if (ellipseColor < 255) ellipseColor++; 
      else ellipseColor = 1;
    }
    if (key === 'g') { // guardar
      if (wait++ === 1) saveCanvas(canvas, 'canvas', 'png');
      else if (wait > 3) wait = 0;
    }
    // BACKSPACE, DELETE, ENTER, RETURN, TAB, 
    // ESCAPE, SHIFT, CONTROL, OPTION, ALT,
    // UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW.
  }

  let vol = mic.getLevel();

  fill(ellipseColor, 127 + random(-26, 26), 127 + random(-26, 26));
  ellipse(mouseX + random(-1, 1)*vol*100, mouseY + random(-1, 1)*vol*100, ellipseWidth, ellipseWidth);
}