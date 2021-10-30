// Ahora vamos a agregar musica, porque la música nos ayuda a aglutinar
// toda la pieza


// cosas de sonido
let mySound;

let fondo, button, bStop;

function preload() {
	soundFormats('mp3', 'ogg', 'wav');
	mySound = loadSound('11_Flora _ Fauna.mp3');
}

// cosas del synth
let monoSynth;
let n; //pitch
let reverb;
let p; // duracion
let tempo = 15;


//Cosas de PoseNet
let video;
let poseNet;
let poses = [];


//
var grosorP = 1;

// cantidad de partículas
var particlesQuantity = 4000;

var positionX = new Array(particlesQuantity);
var positionY = new Array(particlesQuantity);
var velocityX = new Array(particlesQuantity).fill(0);
var velocityY = new Array(particlesQuantity).fill(0);

function setup() {
	
	//Cosas de PoseNet
	video = createCapture(VIDEO);
	fondo = createCanvas(video.width * 1.4, video.height * 1.4);
	fondo.position(0, 0);
	//video.size(video.width*2, video.height*2);
	createCanvas(1280, 960);
	// Create a new poseNet method with a single detection
	poseNet = ml5.poseNet(video, modelReady);
	// This sets up an event that fills the global variable "poses"
	// with an array every time new poses are detected
	poseNet.on('pose', function(results) {
		poses = results;
	});
	// Hide the video element, and just show the canvas
	video.hide();

	// color de las particulas
	stroke(random(125, 255), random(125, 255), 0);

	for (var particle = 1; particle < particlesQuantity; particle++) {
		positionX[particle] = random(0, width);
		positionY[particle] = random(0, height);
	}
	//bug
	positionX[0] = 0;
	positionY[0] = 0;

	// Cosas del Synth
	monoSynth = new p5.MonoSynth();
	reverb = new p5.Reverb()
	reverb.process(monoSynth, 3, 2);

	button = createButton('Make noise');
	//button.position(15, height-30);
	button.position(0, 0);
  	button.mousePressed(makeNoise);
	
	bStop = createButton('STOP');
	  //button.position(15, height-30);
	bStop.position(button.width, 0);
	bStop.mousePressed(stop);

}

function draw() {
		// color del fondo y cantidad de barrido
	background(0, 60);
	translate((video.width * 1.4), 0);
	scale(-1, 1);
	//background(0);
	image(video, 0, 0, video.width * 1.4, video.height * 1.4);

	// cosas de posenet

	// For one pose only (use a for loop for multiple poses!)
	if (poses.length > 0) {
		const pose = poses[0].pose;


		// Create a pink ellipse for the nose
		fill(213, 125, 0, 150);

		const rightWrist = pose.rightWrist;
		const nose = pose.nose;
		
		const leftWrist = pose.leftWrist;
		console.log("mano izquierda: "+ leftWrist.x);
		
				
		// cosas del Synth
		let notas = map(rightWrist.x, 100 , 800, 1, 127);
		n = midiToFreq(notas);
		let release = map(leftWrist.x, 100 , 800, 0.1, 2.0);
		p = release;

		ellipse(rightWrist.x, rightWrist.y, 80);
		// aquí es donde juego
		velocityX[0] = velocityX[0] * 0.5 + (rightWrist.x - positionX[0]) * 0.1;
		velocityY[0] = velocityY[0] * 0.5 + (rightWrist.y - positionY[0]) * 0.1;

		positionX[0] += velocityX[0];
		positionY[0] += velocityY[0];

		for (var particle = 1; particle < particlesQuantity; particle++) {
			// esta variable es muy interesante, esta es importante tenerla en cuenta
			var whatever = 1024 / (sq(positionX[0] - positionX[particle]) + sq(positionY[0] - positionY[particle]));

			//estas son las partes de la acción
			velocityX[particle] = velocityX[particle] * 0.95 + (velocityX[0] - velocityX[particle]) * whatever;
			velocityY[particle] = velocityY[particle] * 0.95 + (velocityY[0] - velocityY[particle]) * whatever;

			positionX[particle] += velocityX[particle];
			positionY[particle] += velocityY[particle];

			// limites de las particulas es importante poder ponerlo o quitarlo
			if ((positionX[particle] < 0 && velocityX[particle] < 0) || (positionX[particle] > width && velocityX[particle] > 0)) {
				velocityX[particle] = -velocityX[particle];
			}

			if ((positionY[particle] < 0 && velocityY[particle] < 0) || (positionY[particle] > height && velocityY[particle] > 0)) {
				velocityY[particle] = -velocityY[particle];
			}

			point(positionX[particle], positionY[particle]);
		}
		
	}

	// cosas de audio
	let panning = map(mouseX, 0.0, width, -1.0, 1.0);
	mySound.pan(panning);
	let volume = map(mouseY, 0.0, height, -1.0, 1.0);
	mySound.setVolume(volume);
	
	 makeMusic();
}

// con esta funcion se reinicia el interactivo
// aqui tambien podemos agregar más cosas
function mousePressed() {
	grosorP++;
	stroke(0, random(125, 255), random(125, 255));
	//strokeWeight(random(1, 2));
	strokeWeight(grosorP);
	for (var particle = 1; particle < particlesQuantity; particle++) {
		positionX[particle] = random(0, width);
		positionY[particle] = random(0, height);
	}


	// cosas de posenet
	//console.log(JSON.stringify(poses))
}

function makeNoise(){

	if (!mySound.isPlaying()) {
		mySound.play();
	}
}

function stop(){
	if (mySound.isPlaying()) {
		mySound.stop();
	}
}

function makeMusic(){
	
	if(frameCount % tempo == 0){console.log("yeah!!!!!!!!!!");
	// cosas del synth
	monoSynth.play(n, 0.5, 0, p);}

}


function modelReady() {
	select('#status').html('Model Loaded');
	monoSynth.play(n, 0.5, 0, p);
}