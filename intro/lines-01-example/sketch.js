let myLines = [];

let totalLines = 150;

function setup() {
  createCanvas(window.screen.width, window.screen.height);  
  for (let i = 0; i < totalLines; i++) {
    myLines[i] = new Line(); 
  } 
}

function draw() {
  background(255);
  
    for (let i = 0; i < totalLines; i+=10) {
  	myLines[i].display();
  }
    
    //myLines[40].display();
}

class Line{
	 
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.diameter = random(50, 150);
    this.color = random(255);
    this.weight = random(5, 15);
  }

  display() {
  	stroke(this.color);
    strokeWeight(this.weight);
    line(this.x, this.y, this.x+this.diameter, this.y);
  }
}