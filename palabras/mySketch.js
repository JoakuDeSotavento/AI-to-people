//Cosas de PoseNet
let video;
let poseNet;
let poses = [];

// Cosas de letras
var x, y;
var left, right;
const T = 43;
var stepSize = 5.0;

/*〈( ^.^)ノ*/
const texto = ["que", "me", "ABRIGUES", "con CALOR", "que el resto", "ya lo hago", "YO", "que", "NUNCA", "esté", "SOLA", "ED SEROLOD", "AV AL ASOC"];
const FONT_SIZE = 100;
//var angleDistortion = 0.0;
var angleDistortion = 0.1;
//var angleDistortion = 0.2;

var counter = 0;


function setup() {	
  createCanvas(windowWidth * 3 / 4, windowHeight);

	video = createCapture(VIDEO);
	video.size(width, height);
	video.hide();
	
	// Create a new poseNet method with a single detection
	poseNet = ml5.poseNet(video);
	poseNet.on('pose', function(results) {poses = results;});
	
	/*〈( ^.^)ノ*/
  fill(255, 0, 125);
	//fill(125, 255, 0);
	//fill(0, 125, 255);
	
	textAlign(LEFT);
}


/*( ಠ益ಠ)*/
function draw() {

	if (poses.length > 0) {
		
		image(video, 0, 0, width, height);
		
		left = poses[0].pose.leftWrist;
		right = poses[0].pose.rightWrist;
		x = poses[0].pose.nose.x;
		y = poses[0].pose.nose.y;
			
  	d = dist(left.x, left.y, right.x, right.y);
    textFont('Arial Black');
    textSize(100);
		
		newLetter = texto[parseInt(counter / T)];
		
		stepSize = textWidth(newLetter);

    if (d > stepSize) {
    	let angle = atan2(0, 0); 

      push();
      translate(x, y);
      rotate(angle + random(angleDistortion));
      text(newLetter, 0,0);
      pop();

      counter++;
			if (counter > T * texto.length) {
				counter = 0;
			}

      x = x + cos(angle) * stepSize;
      y = y + sin(angle) * stepSize; 
    }
  }
}