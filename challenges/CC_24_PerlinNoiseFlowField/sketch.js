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

function setup() {
  var cnv = createCanvas(WID, HEI);
  //var x = (windowWidth - width) / 2;
  //var y = (windowHeight - height) / 2;
  cnv.position(200, 100);
  colorMode(RGB, 255);
  cols = floor(width / scl);
  rows = floor(height / scl);

  flowfield = new Array(cols * rows);
  
  var pseed = random();

  for (var i = 0; i < NB_PARTICLES; i++) {
    particles[i] = new Particle(pseed);
  }
  background(255);
  
  button = createButton('Reset (R)');
  button.mousePressed(reset);
  button2 = createButton('Pause/Play (P)');
  button2.mousePressed(pause_play);
  button3 = createButton('Save canvas (S)');
  button3.mousePressed(canvas_save);
  button4 = createButton('Clear canvas (C)');
  button4.mousePressed(clear_canvas);
  button5 = createButton('Change color gradient (G)');
  button5.mousePressed(change_color);
  button6 = createButton('New set of particles (N)');
  button6.mousePressed(new_particles);
  
  
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
  nbp = createP('Current number of particles : ' + NB_PARTICLES);
  nbp.position(1050,100);
  nbp2 = createP('Number of particles in the next set : ');
  nbp2.position(1050,120);
  particleNumberSlider = createSlider(1, 2500, 700, 1);
  particleNumberSlider.position(1050,140);
  fr = createP('');
  
  p1 = createP('Border bounce : ');
  p1.position(1050,160);
  bounceSlider = createSlider(0, 1, 0, 1);
  bounceSlider.position(1050,180);
  p2 = createP('Mouse attraction/repulsion factor : ');
  p2.position(1050,200);
  mouseSlider = createSlider(-4, 4, -1.4, 0.01);
  mouseSlider.position(1050,220);
  p3 = createP('Color offsets : ');
  p3.position(1050,240);
  redoSlider = createSlider(0, 10, 10*noise(10000), 0.01);
  redoSlider.position(1050,260);
  greenoSlider = createSlider(0, 10, 10*noise(20000), 0.01);
  greenoSlider.position(1050,280);
  blueoSlider = createSlider(0, 10, 10*noise(30000), 0.01);
  blueoSlider.position(1050,300);
  p4 = createP('Color oscillation periods (align them for simpler color gradients) : ');
  p4.position(1050,320);
  redSlider = createSlider(0, 20, 5, 1);
  redSlider.position(1050,340);
  greenSlider = createSlider(0, 20, 2, 1);
  greenSlider.position(1050,360);
  blueSlider = createSlider(0, 20, 3, 1);
  blueSlider.position(1050,380);
  p5_ = createP('Background fade : ');
  p5_.position(1050,400);
  fade1Slider = createSlider(0, 1, 0, 0.01);
  fade1Slider.position(1050,420);
  fade2Slider = createSlider(0, 255, 255, 1);
  fade2Slider.position(1050,440);
}

function mousePressed() {
  //noLoop();
}

function clear_canvas() {
  background(255);
}

function change_color() {
  noiseSeed(12345*random());
}

function new_particles() {
  for(var i = NB_PARTICLES-1;i>=0;i--){
    particles.pop();
  }
  NB_PARTICLES = particleNumberSlider.value();
  var pseed = random();
  for(var i = 0;i<NB_PARTICLES;i++){
    particles[i] = new Particle(pseed);
  }
}

function reset() {
    location.reload();
    seedRandom();
    seedNoise();
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

  button = createButton('Reset (R)');
  button.mousePressed(reset);
  button2 = createButton('Pause/Play (P)');
  button2.mousePressed(pause_play);
  button3 = createButton('Save canvas (S)');
  button3.mousePressed(canvas_save);
  button4 = createButton('Clear canvas (C)');
  button4.mousePressed(clear_canvas);
  button5 = createButton('Change color gradient (G)');
  button5.mousePressed(change_color);
  button6 = createButton('New set of particles (N)');
  button6.mousePressed(new_particles);

function keyTyped() {
  if (key === 'p') {
    pause_play();
  } else if (key === 'r') {
    reset();
  } else if (key === 'c') {
    clear_canvas();
  } else if (key === 's') {
    canvas_save();
  } else if (key === 'g') {
    change_color();
  } else if (key === 'n') {
    new_particles();
  }
}

function canvas_save() {
  saveCanvas('myCanvas', 'jpg');
}

function draw() {
  var aux = fade1Slider.value();
  background(fade2Slider.value(),255*aux*aux*aux);
  
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
  
  frameRate(40);

  fr.html("FPS : " + floor(frameRate()));
  
  nbp.html('Current number of particles : ' + NB_PARTICLES);
  nbp2.html('Number of particles in the next set : ' + particleNumberSlider.value());
}
