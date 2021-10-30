var video;
var poseNet;
var poses = [];
var mySound;
var mySound2;

// Configuraciones de las partículas que se pueden cambiar

/*〈( ^.^)ノ*/
var COLORS = [ '#03CEA4', '#982649', '#FEC601', '#5C7AFF', '#FF99C8'];
//var COLORS = [ '#31CFAD', '#ADDF8C', '#FF6500', '#FF0063', '#520042', '#DAF7A6' ];
//var COLORS = [ '#69D2E7', '#A7DBD8', '#E0E4CC', '#F38630', '#FA6900', '#FF4E50', '#F9D423' ];
//var COLORS = [ '#581845', '#900C3F', '#C70039', '#C70039', '#FFC300', '#DAF7A6' ];
var size2 = 80;
//var size2 = 160;
const LIFESPAN = 10;
//const LIFESPAN = 20;


function preload() {
	soundFormats('mp3', 'ogg', 'wav');
	mySound = loadSound('magia.mp3');
	mySound2 = loadSound('scene2.mp3');
}


function setup() {
	// Aquí podemos poner el tamaño del canvas en función del tamaño de ventana
	// porque el resto del código está parametrizado, en otros sketches como
	// el JAIL no porque las coordenadas están escritas a mano
	createCanvas(windowWidth * 3 / 4, windowHeight); 
	video = createCapture(VIDEO);
	video.size(windowWidth * 3 / 4, windowHeight);
	video.hide();

	// Posenet
	poseNet = ml5.poseNet(video);
	poseNet.on("pose", function(results) {poses = results;});

	colorMode(HSB, 255);
	textAlign(CENTER);
	background(0);
	noStroke();
} 


function draw() {
	// Create fade effect
	translate(width,0);
	scale(-1, 1);
	image(video, 0, 0, width, height);

	fill(255,0,0);
	moved();
	drawGlitters();
}


////////////////////////////// Particulas
var allParticles = [];
var maxLevel = 1;
var useFill = false;

var data = [];

// ----------------------------------------
// Configuration
// ----------------------------------------

var MAX_PARTICLES = 600 + LIFESPAN * 10;

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
var sizeScalar = 0.97;

var playing = false;
// ----------------------------------------
// Particle Functions
// ----------------------------------------


/*( ಠ益ಠ)  ( ಠ益ಠ)  ( ಠ益ಠ)  ( ಠ益ಠ)*/

function Glitter(x, y, size) {
	this.life = 0;
	this.alive = true;
	this.size = size || 0.5;
	this.wander = 0.15;
	this.theta = random(TWO_PI);
	this.drag = 0.92;
	this.color = '#fff';
	this.location = createVector(x || 0.0, y || 0.0);
	this.velocity = createVector(0.0, 0.0);
}


Glitter.prototype.move = function() {
	this.life++;
	this.location.add(this.velocity);
	this.velocity.mult(this.drag);
	this.theta += random(theta1, theta2) * this.wander;
	this.velocity.x += sin(this.theta) * 0.1;
	this.velocity.y += cos(this.theta) * 0.1;
	this.size *= sizeScalar;
	if (this.life % LIFESPAN == 0){
		this.alive = false;
	}
}


Glitter.prototype.show = function() {
	if (this.alive == true) {
		fill(this.color);
		ellipse(this.location.x,this.location.y, this.size, this.size);
	}
}


function spawn(x,y) {
	var glitter, theta, force;
	if (glitters.length >= MAX_PARTICLES) {
		glitters.shift();
	}
	glitter = new Glitter(x, y, random(size1,size2));
	glitter.wander = random(wander1, wander2);
	glitter.color = random(COLORS);
	glitter.drag = random(drag1, drag2);
	theta = random(TWO_PI);
	force = random(force1, force2);
	glitter.velocity.x = sin(theta) * force;
	glitter.velocity.y = cos(theta) * force;
	glitters.push(glitter);
}


function update() {
	var i, glitter;
	for (i = glitters.length - 1; i >= 0; i--) {
		glitter = glitters[i];
		if (glitter.alive) {
			glitter.move();
		} else {
			glitters.splice(i, 1);
		}
	}
}


function moved() {
	if (playing == false) {
		JSON.stringify(poses);
		mySound.play();
		mySound2.play();
		mySound2.setVolume(0.35);
		playing = true;
	}
	var glitter, max, i;
	max = random(1, 4);
	for (i = 0; i < max; i++) {
		for (let x = 0; x < poses.length; x += 1) {
			// For each pose detected, loop through all the keypoints
			const pose = poses[x].pose;
			const rightWrist = pose.rightWrist;
			const leftWrist = pose.leftWrist;
			spawn(rightWrist.x, rightWrist.y);
			spawn(leftWrist.x, leftWrist.y);
			let panning = map(rightWrist.x, 0.0, width, -1.0, 1.0);
			mySound.pan(panning);
			let volume = map(leftWrist.y, 0.0, height, -1.0, 1.0);
			mySound.setVolume(volume*  1.3);
		}
	}
}


function drawGlitters() {
	update();
	for (var i = glitters.length - 1; i >= 0; i--) {
		glitters[i].show();
	}
}
