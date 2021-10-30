
/*
Frozen brush

Makes use of a delaunay algorithm to create crystal-like shapes.
I did NOT develop delaunay.js, and not sure who the author really is to give proper credit.


Controls:
	- Drag the mouse.
    - Press any key to toggle between fill and stroke.

Inspired by:

  Jason Labbe

*/
////////////////////////// Posenet
var video;
var poseNet;
var poses = [];
////////////////////////
let mySound
let mySound2

function preload() {
  soundFormats('mp3', 'ogg', 'wav');
  mySound = loadSound('magia.mp3');
	mySound2 = loadSound('scene2.mp3');
}

////////////////////////////// Particulas
var allParticles = [];
var maxLevel = 1;
var useFill = false;

var data = [];

////////////////////////////// Glitters
// ----------------------------------------
// Configuration
// ----------------------------------------

// GLOBALS
var MAX_PARTICLES = 780;
var COLORS = [ '#03CEA4', '#982649', '#FEC601', '#5C7AFF', '#FF99C8'];
//var COLORS = [ '#31CFAD', '#ADDF8C', '#FF6500', '#FF0063', '#520042', '#DAF7A6' ];
//var COLORS = [ '#69D2E7', '#A7DBD8', '#E0E4CC', '#F38630', '#FA6900', '#FF4E50', '#F9D423' ];
//var COLORS = [ '#581845', '#900C3F', '#C70039', '#C70039', '#FFC300', '#DAF7A6' ];
//var COLORS = [ 'rgba(49,207,173,.7)', 'rgba(173,223,140,.7)', 'rgba(255,101,0,.7)', 'rgba(255,0,99,.7)', 'rgba(82,0,66,.7)' ];

//ARRAYS
var glitters = [];

//VARIABLES
var wander1 = 0.5;
var wander2 = 2.0;
var drag1 = 0.9;
var drag2 = 0.99;
var force1 = 2;
var force2 = 8;
var theta1 = -0.5;
var theta2 = 0.5;
var size1 = 5;
var size2 = 80;
var sizeScalar = 0.97;

var playing = false;
// ----------------------------------------
// Particle Functions
// ----------------------------------------

function Glitter(x,y,size) {
		this.life = 0;
    this.alive = true;
    this.size = size || 0.5;
    this.wander = 0.15;
    this.theta = random( TWO_PI );
    this.drag = 0.92;
    this.color = '#fff';
  	this.location = createVector(x || 0.0, y || 0.0);
	this.velocity = createVector(0.0, 0.0);
}
Glitter.prototype.move = function() {
		this.life++;
    this.location.add(this.velocity);
  	this.velocity.mult(this.drag);
    this.theta += random( theta1, theta2 ) * this.wander;
    this.velocity.x += sin( this.theta ) * 0.1;
    this.velocity.y += cos( this.theta ) * 0.1;
    this.size *= sizeScalar;
		if (this.life % 10 == 0){
    	this.alive = false;
		}
}
Glitter.prototype.show = function() {
  //arc( this.location.x, this.location.y, this.size, 0, TWO_PI );
	if (this.alive == true){
  	fill( this.color );
  	noStroke();
  	ellipse(this.location.x,this.location.y, this.size, this.size);
	}
}

function spawn(x,y) {
    var glitter, theta, force;
    if ( glitters.length >= MAX_PARTICLES ) {
        glitters.shift();
    }
    glitter = new Glitter(x, y, random(size1,size2));
    glitter.wander = random( wander1, wander2 );
    glitter.color = random( COLORS );
    glitter.drag = random( drag1, drag2 );
    theta = random( TWO_PI );
    force = random( force1, force2 );
  	glitter.velocity.x = sin( theta ) * force;
    glitter.velocity.y = cos( theta ) * force;
    glitters.push( glitter );
}
function update() {
    var i, glitter;
    for ( i = glitters.length - 1; i >= 0; i-- ) {
        glitter = glitters[i];
        if ( glitter.alive) {
          glitter.move();
        } else {
          glitters.splice( i, 1 );
        }
    }
}
function moved() {
		if (playing == false){
			JSON.stringify(poses);
			mySound.play();
			mySound2.play();
			mySound2.setVolume(0.35);
			playing = true;
		}
    var glitter, max, i;
    max = random( 1, 4 );
    for ( i = 0; i < max; i++ ) {
			for (let x = 0; x < poses.length; x += 1) {
    		// For each pose detected, loop through all the keypoints
				const pose = poses[x].pose;
				const rightWrist = pose.rightWrist;
				const leftWrist = pose.leftWrist;
				spawn( rightWrist.x, rightWrist.y );
				spawn( leftWrist.x, leftWrist.y );
				let panning = map(rightWrist.x, 0.0, width,-1.0, 1.0);
        mySound.pan(panning);
       	let volume = map(leftWrist.y, 0.0, height,-1.0, 1.0);
      	mySound.setVolume(volume*1.3);
			}
    }
}



function setup() {
  createCanvas(windowWidth, windowHeight); 
  //////////Cambio de espacio de color 
  colorMode(HSB, 255);
  
  textAlign(CENTER);
  
  background(0);
	
	//////////Posenet
	video = createCapture(VIDEO);
  video.size(windowWidth, windowHeight);
  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on("pose", function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
} 


function draw() {
  // Create fade effect.
	translate(width,0);
  scale(-1, 1);
	image(video, 0, 0, width, height);
	
  noStroke();
  fill(255,0,0);
  text("", width/2, height-50);
	moved();
  drawGlitters();
	
}

// A function to draw the skeletons
function drawGlitters() {
  // Loop through all the skeletons detected
    update();
		//	ESTAS DOS LINEAS DE CODIGO DAN ERRORES EN FIREFOX
    //drawingContext.globalCompositeOperation = 'normal';
 		//drawingContext.globalCompositeOperation = 'lighter';
		for (var i = glitters.length - 1; i >= 0; i--) {
    	glitters[i].show();
    }
}

function modelReady() {
  select('#status').html('Model Loaded');
}
