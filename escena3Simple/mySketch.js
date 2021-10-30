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


////////////////////////////// Particulas
var allParticles = [];
var maxLevel = 1;

var data = [];

const WIDTH = 1280;
const HEIGHT = 960;

let mySound;

// Moves to a random direction and comes to a stop.
// Spawns other particles within its lifetime.
function Particle(x, y, level) {
  this.level = level;
  this.life = 0;
  
  this.pos = new p5.Vector(x, y);
  this.vel = p5.Vector.random2D();
  this.vel.mult(map(this.level, 0, maxLevel, 5, 4));
  
  this.move = function() {
    this.life++;
    
    // Add friction.
    this.vel.mult(0.9);
    
    this.pos.add(this.vel);
    
    // Spawn a new particle if conditions are met.
    if (this.life % 10 == 0) {
      if (this.level > 0) {
        this.level -= 1;
        var newParticle = new Particle(this.pos.x, this.pos.y, this.level-1);
        allParticles.push(newParticle);
      }
    }
  }
}


function setup() {
  createCanvas(WIDTH,HEIGHT); 
  //////////Cambio de espacio de color 
  colorMode(HSB, 255);
  
  textAlign(CENTER);
  
  background(0);
	
	//////////Posenet
	video = createCapture(VIDEO);
  video.size(WIDTH, HEIGHT);
  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on("pose", function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
	
	mySound.play();
} 


function draw() {
  // Create fade effect.
	translate(width,0);
  scale(-1, 1);
	image(video, 0, 0, WIDTH, HEIGHT);
	filter(GRAY);
	
  noStroke();
  fill(0, 30);
  //rect(0, 0, WIDTH, HEIGHT);

  
  // Move and spawn particles.
  // Remove any that is below the velocity threshold.
  for (var i = allParticles.length-1; i > -1; i--) {
    allParticles[i].move();
    
    if (allParticles[i].vel.mag() < 0.01) {
      allParticles.splice(i, 1);
    }
  }
  
  if (allParticles.length > 0) {
    // Run script to get points to create triangles with.
    data = Delaunay.triangulate(allParticles.map(function(pt) {
      return [pt.pos.x, pt.pos.y];
    }));
  	
    strokeWeight(0.8);
    
    // Display triangles individually.
    for (var i = 0; i < data.length; i += 3) {
      // Collect particles that make this triangle.
      var p1 = allParticles[data[i]];
      var p2 = allParticles[data[i+1]];
      var p3 = allParticles[data[i+2]];
      
      // Don't draw triangle if its area is too big.
      var distThresh = 100;
      
      if (dist(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y) > distThresh) {
        continue;
      }
      
      if (dist(p2.pos.x, p2.pos.y, p3.pos.x, p3.pos.y) > distThresh) {
        continue;
      }
      
      if (dist(p1.pos.x, p1.pos.y, p3.pos.x, p3.pos.y) > distThresh) {
        continue;
      }
      
      // Base its hue by the particle's life.
			noFill();
			// CAMBIA COLOR AQUI
			if (poses.length>0) {
				if (poses[0].pose.rightShoulder.x > poses[0].pose.leftShoulder.x) {
				// Al reves
					stroke(165+p1.life*1, 250, 260);
				} else {
				// De frente
					stroke(150, 15+p1.life*20, 270);
				}

				
				let volume = map(poses[0].pose.rightWrist.y, 0.0, height,-1.0, 1.0);
				mySound.setVolume(volume);
			
			//PARAR MÚSICA
				if (poses[0].pose.rightShoulder.x > poses[0].pose.leftShoulder.x) {
					mySound.setVolume(0);
					}
					else {
						mySound.setVolume(volume);
					}
			
    	  triangle(p1.pos.x, p1.pos.y, 
               p2.pos.x, p2.pos.y, 
               p3.pos.x, p3.pos.y);
			}
   	 }
 	 }
  
	
	
  noStroke();
  fill(255,0,0);
  text("", width/2, height-50);
		  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i += 1) {
    // For each pose detected, loop through all the keypoints
    const pose = poses[i].pose;
   
				allParticles.push(new Particle(pose.leftWrist.x, pose.leftWrist.y, maxLevel));
				allParticles.push(new Particle(pose.rightWrist.x, pose.rightWrist.y, maxLevel));
				allParticles.push(new Particle(pose.leftAnkle.x, pose.leftAnkle.y, maxLevel));
				allParticles.push(new Particle(pose.rightAnkle.x, pose.rightAnkle.y, maxLevel));
  }
}

function preload() {
  soundFormats('mp3', 'ogg', 'wav');
  mySound = loadSound('AUDIOESCENA3.mp3');
}

function modelReady() {
  select('#status').html('Model Loaded');
}

function mousePressed(){
  console.log(JSON.stringify(poses));	
}