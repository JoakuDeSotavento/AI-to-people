let video;
let poseNet; 
let poses = []; 
let mysound;

function preload() {
		soundFormats('mp3'); 
		mysound = loadSound('https://openprocessing-usercontent.s3.amazonaws.com/files/user263752/visual1173311/h6634d9c2643695298405a4011b644354/Escena_dos.mp3');
}

/*〈( ^.^)ノ*/
//const RECT_SIZE = 1;
const RECT_SIZE = 1.5;
//const RECT_SIZE = 2;


function setup() {
  createCanvas(700, 500);
  
  video = createCapture(VIDEO);
  video.size(width, height);
	video.hide();
	
  poseNet = ml5.poseNet(video);
  poseNet.on('pose', function(results) {poses = results;});
	
	mysound.play();
	
	rectMode(CENTER);
	noStroke();
}

function draw() {
	
	/*〈( ^.^)ノ*/
	// BLUR
	//tint(255, 20);
	tint(255, 7);
	image(video, 0, 0, width, height);
	
	/*〈( ^.^)ノ*/
	// COLOR
	//tint(50, 70, 80);
	tint(70, 80, 50);
	//tint(80, 50, 70);
  
	
	/*( ಠ益ಠ)*/
	for (let i = 0; i < poses.length; i++) {
		
		if (poses[i].pose.rightEye.confidence > 0.5) {
			fill(random(0, 250), random(0, 250), random(0, 250));
			rect(poses[i].pose.rightEye.x, poses[i].pose.rightEye.y, RECT_SIZE * random(10,50), RECT_SIZE * random(10,50));
			/*〈( ^.^)ノ*/
			//fill(random(0, 250), random(0, 250), random(0, 250));
			rect(poses[i].pose.leftEye.x, poses[i].pose.leftEye.y, RECT_SIZE * random(10,50), RECT_SIZE * random(10,50));
		}
		
		if (poses[i].pose.leftWrist.confidence > 0.5) {
			fill(random(0, 250), random(0, 250), random(0, 250));
			rect(poses[i].pose.rightWrist.x, poses[i].pose.rightWrist.y, RECT_SIZE * random(10,50), RECT_SIZE * random(10,50));
			/*〈( ^.^)ノ*/
			//fill(random(0, 250), random(0, 250), random(0, 250));
			rect(poses[i].pose.leftWrist.x, poses[i].pose.leftWrist.y, RECT_SIZE * random(10,50), RECT_SIZE * random(10,50));
		}
	}
}