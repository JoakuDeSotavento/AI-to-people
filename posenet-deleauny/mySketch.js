/* 
In this Sketch I mixed the ml5 Posenet library with this awesome code y took frome Open Processing
*/


////////////////////////// Posenet
var video;
var poseNet;
var poses = [];


////////////////////////////// Particulas
var allParticles = [];
var maxLevel = 1;
var useFill = false;

var data = [];

var bChange;
var fondo;


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
 fondo = createCanvas(windowWidth, windowHeight); 
 fondo.position(0, 0);
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

    bChange = createButton('Change');
	  //button.position(15, height-30);
	  bChange.position(0, 0);
    bChange.mousePressed(change);

} 


function draw() {
  // Create fade effect.
	translate(width,0);
  scale(-1, 1);
	image(video, 0, 0, width, height);
	
  noStroke();
  fill(0, 30);
  rect(0, 0, width, height);

  
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
  	
    strokeWeight(0.1);
    
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
      if (useFill) {
        noStroke();
        fill(165+p1.life*1, 250, 360);
      } else {
        noFill();
        stroke(165+p1.life*1, 250, 360);
      }
      
      triangle(p1.pos.x, p1.pos.y, 
               p2.pos.x, p2.pos.y, 
               p3.pos.x, p3.pos.y);
    }
  }
  
  noStroke();
  fill(255,0,0);
  text("", width/2, height-50);
		  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  //drawSkeleton();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i += 1) {
    // For each pose detected, loop through all the keypoints
    const pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j += 1) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      const keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.4) {
        fill(150, 360, 360, 25);
        noStroke();
				allParticles.push(new Particle(keypoint.position.x, keypoint.position.y, maxLevel));
        ellipse(keypoint.position.x, keypoint.position.y, 30, 30);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i += 1) {
    const skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j += 1) {
      const partA = skeleton[j][0];
      const partB = skeleton[j][1];
      stroke(360, 360, 360);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}


function mouseDragged() {
  allParticles.push(new Particle(mouseX, mouseY, maxLevel));
}


function change(){
  useFill = ! useFill;
}

function modelReady() {
  select('#status').html('Model Loaded');
}

function mousePressed(){
  console.log(JSON.stringify(poses))
}