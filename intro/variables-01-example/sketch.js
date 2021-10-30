// Introducimos los comentarios
/*
estos son de vital importancia para aprender, recordar y mantener el honor

recordamos para que sirve todo lo que hemos estado programando, usualmente se olvida despues de unas semanas

aprendemos al ir entendiendo un codigo y poner un comentario en las partes que nos parecen importante

reconocemos el trabajo de otros programadores al citar el autor original del codigo

Muchos de los ejemplos que veremos vienen de codigos de otras personas, así que el nuestro podría formar parte tambien del
codigo de otras personas y nos gustara que nos nnombren.
*/

//ejemplo tomado del libro Getting Started with p5.js de Lauren McCarthy, Casey Reas y Ben Fry

//let d = 80;
let y = 300;

const d = 80;

let x1 = 75;
//let x2 = 175;
//let x3 = 275;


let y1, y2, y3;
y1 = 80;
y2 = 80;
y3 = 80;

let c;

function setup() {
    createCanvas(800, 600);
    print("Comenzamos");
    c = color('rgb(0,0,255)');
}

function draw() {
    background(125, 10);
    
    fill(125, 200, 10);
    ellipse(x1, y1, d, d); // Left
    
    fill(10, 200, 09);
    ellipse(175, 80, d, d); // Middle
    
    fill(10, 10, 255);
    ellipse(275, y, d, d); // Right
    
    
    console.log("y seguimos");
    
    fill(c);
    x1++;
    y1 = y1 + 0.1;
    
    textSize(40);
    textFont("");
    text(PI, x1+50, y1+50);
    
}