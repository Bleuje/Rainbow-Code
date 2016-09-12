var inc = 0.01;
var scl = 20;
var cols, rows;

var NB_PARTICLES = 700;

var zoff = 0;

var fr;

var particles = [];

var flowfield;

var WID = 800;
var HEI = 400;

var speedSlide,incSlider,forceNoiseSlider,forceMagSlider,brightSlider;

var playing = true;

function mousePressed() {
  //noLoop();
}

function reset() {
    location.reload();
}

function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function windowResized() {
  centerCanvas();
}

function pause_play() {
    if (playing) {
        playing = false;
        noLoop();
    } else {
      playing = true;
      loop();
    }
}

function setup() {
  var cnv = createCanvas(WID, HEI);
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
  colorMode(RGB, 255);
  cols = floor(width / scl);
  rows = floor(height / scl);

  flowfield = new Array(cols * rows);

  for (var i = 0; i < NB_PARTICLES; i++) {
    particles[i] = new Particle();
  }
  background(255);
  
  button = createButton('Reset with new color gradient');
  button.mousePressed(reset);
  button2 = createButton('Pause/Play');
  button2.mousePressed(pause_play);
  
  createP('Speed : ');
  speedSlider = createSlider(0, 0.98, 0.7,0.02);
  createP('Space offset : ');
  incSlider = createSlider(0, 0.3, inc,0.001);
  createP('Force noise : ');
  forceNoiseSlider = createSlider(0, 10, 2.0, 0.1);
  createP('Force field magnitude : ');
  forceMagSlider = createSlider(0, 10, 2.0, 0.1);
  createP('Force field change rate : ');
  fieldChangeRateSlider = createSlider(0, 0.002, 0.00008, 0.00001);
  createP('Color gradient speed : ');
  colorGradientSlider = createSlider(0, 10, 1.0, 0.1);
  createP('Max pen size : ');
  penSizeSlider = createSlider(5, 150, 40.0, 1);
  createP('Color contrast : ');
  contrastSlider = createSlider(10, 275, 125, 1);
  createP('Color brightness : ');
  brightSlider = createSlider(10, 275, 155, 1);
  createP('Particle color offset : ');
  particleColorOffsetSlider = createSlider(0.1, 10, 1, 0.1);
  fr = createP('');
  
}

function draw() {
  var yoff = 0;
  for (var y = 0; y < rows; y++) {
    var xoff = 0;
    for (var x = 0; x < cols; x++) {
      var index = x + y * cols;
      var angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
      var v = p5.Vector.fromAngle(angle);
      v.setMag(forceMagSlider.value());
      flowfield[index] = v;
      xoff += incSlider.value();
    }
    yoff += incSlider.value();

    zoff += fieldChangeRateSlider.value();
    
  }

  for (var i = 0; i < particles.length; i++) {
    particles[i].follow(flowfield);
    particles[i].update();
    particles[i].edges();
    particles[i].show();
  }
  
  frameRate(27);

  fr.html("FPS : " + floor(frameRate()));
}
