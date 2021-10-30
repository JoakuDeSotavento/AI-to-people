// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */

//Sketch de experieimnttación sonora, a partir de la reactividad


let video;
let poseNet;
let poses = [];

// Elementos sonoros

let polySynth;

let osc, playing, freq, amp;

// variables de interacción

let distancia;
let manoDer;
let manoDIzq;

let contUni;

let button, button2;

function setup() {
  	let cnv = createCanvas(640, 480);
	cnv.position(0, 0, 'fixed');
  	video = createCapture(VIDEO);
  	video.size(width, height);

  	// Create a new poseNet method with a single detection
  	poseNet = ml5.poseNet(video, modelReady);
  	// This sets up an event that fills the global variable "poses"
  	// with an array every time new poses are detected
  	poseNet.on("pose", function(results) {
    poses = results;
  	});
  // Hide the video element, and just show the canvas
  	video.hide();
	
	// elementos de sonido
	
	//cnv.mousePressed(playOscillator);
  	osc = new p5.Oscillator('sine');
	
	//cnv.mousePressed(playSynth);
	polySynth= new p5.PolySynth();	
	playing = false;
	//
	distancia = 0;
	manoDer = createVector(0,0);
	manoDIzq = createVector(0,0);

	contUni = 0;
	
	//playOscillator();
	
	button = createButton('Make noise');
	//button.position(15, height-30);
	button.position(0, 0);
  	button.mousePressed(playOscillator);
	/*
	button = createButton('Make noise');
  button.position(0, 0);
  button.mousePressed(playOscillator);
	*/
}

function modelReady() {
  select("#status").html("Model Loaded");
}

function draw() {
	image(video, 0, 0, width, height);
	//ellipse(0, 0, 100, 100);
	//button.position(0, 0);
	// We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  drawSkeleton();
	
	if(poses.length >0){
			if (contUni >= 125){ 
				conUni = 0;
			}
		contUni++;
		let frecuencia = dameDatos();
		freq = constrain(map(frecuencia, 0, 700, 100, 440), 100, 500);
  	amp = constrain(map(frecuencia, 700, 0, 0, 1), 0, 1);
		osc.freq(freq, 0.1);
    osc.amp(amp, 0.1);
		fill(0, 0, 125);
		text("frecuencia: " + freq + " amp: " + amp, 50, 50);
		//playSynth(frecuencia);
	}
}
// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
	  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i += 1) {
    // For each pose detected, loop through all the keypoints
    const pose = poses[i].pose;
		//manoDer = createVector (poses[0].pouse.keypoints[6].position.x, poses[0].keypoints[6].position.y);
		//manoIzq = createVector (poses[0].keypoints[7].position.x, poses[0].keypoints[7].position.y);
		for (let j = 0; j < pose.keypoints.length; j += 1) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      const keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.4) {
        fill(255, 0, 0);
        noStroke();
				textSize(12);
				text(j, keypoint.position.x, keypoint.position.y);
        //ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
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
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}

function dameDatos(){
textSize(18);
text("manoDer " + poses[0].pose.keypoints[6].position.x,50, 100);
text("manoIzq " + poses[0].pose.keypoints[14].position.x,50, 130);
distancia = dist(poses[0].pose.keypoints[10].position.x, poses[0].pose.keypoints[10].position.y, 
								 poses[0].pose.keypoints[9].position.x, poses[0].pose.keypoints[9].position.y);
text("Dist de las manos " + distancia, 50, 160);
	return distancia;
}
// función de sonido
function playOscillator() {
	if(playing!=true){
	  osc.start();
  	playing = true;
		console.log("Tocando");
	}else if(playing=true){
  		osc.stop(0.25);
  		//osc.amp(0, 0, 0.5);
			playing = false;
			console.log("Silencio");
		}
}

function playSynth(freq){
	_freq = freq;
	userStartAudio();
	let dur = 1.5;
	let time = 0;
	let vel = 0.1;
	
	polySynth.play(_freq, vel, 0, dur);
	polySynth.play(_freq, vel, time += 1/3, dur);
	polySynth.play("G3", vel, time += 1/3, dur);
	
	// acciones del teclado
	
	function keyTyped() {
  if (key === "a") {
    osc.setType("sine")
  } else if (key === "b") {
    osc.setType("triangle")
  }else if (key === "c") {
    osc.setType("sawtooth")
  }else if (key === "d") {
    osc.setType("square")
  }
}

}