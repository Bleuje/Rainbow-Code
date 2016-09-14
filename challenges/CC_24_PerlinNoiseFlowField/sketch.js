var inc = 0.01;
var scl = 20;
var cols, rows;

var NB_PARTICLES = 500;

var zoff = 0;

var fr;

var particles = [];


var rectangles = [];

var flowfield;

var WID = 800;
var HEI = 400;

var speedSlide,incSlider,forceNoiseSlider,forceMagSlider,brightSlider;

var defsel = 'line';

var playing = true;

var mode = 0;

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
  
  if (mode === 1) {
    for (var i = 0; i < NB_PARTICLES; i++) {
      rectangles[i] = new Rectangle(pseed);
    }
  } else {
    for (var i = 0; i < NB_PARTICLES; i++) {
      particles[i] = new Particle(pseed);
    }
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
  button7 = createButton('Rectangle mode On/Off (M)');
  button7.mousePressed(change_mode);
  
  
  pp1 = createP('Speed : ');
  pp1.position(20,80);
  speedSlider = createSlider(0, 0.98, 0.7,0.02);
  speedSlider.position(20,100);
  pp2 = createP('Space offset : ');
  pp2.position(20,120);
  incSlider = createSlider(0, sqrt(0.3), sqrt(inc),0.00001);
  incSlider.position(20,140);
  pp3 = createP('Force noise : ');
  pp3.position(20,160);
  forceNoiseSlider = createSlider(0, 10, 2.0, 0.1);
  forceNoiseSlider.position(20,180);
  pp4 = createP('Force field magnitude : ');
  pp4.position(20,200);
  forceMagSlider = createSlider(0, 10, 2.0, 0.1);
  forceMagSlider.position(20,220);
  pp5 = createP('Force field change rate : ');
  pp5.position(20,240);
  fieldChangeRateSlider = createSlider(0, sqrt(0.002), sqrt(0.00008), 0.0000001);
  fieldChangeRateSlider.position(20,260);
  pp6 = createP('Color gradient speed : ');
  pp6.position(1050,480);
  colorGradientSlider = createSlider(0, sqrt(50), 1.0, 0.01);
  colorGradientSlider.position(1050,500);
  pp7a = createP('Max pen size : ');
  pp7a.position(1050,80);
  penSizeSlider = createSlider(sqrt(5), sqrt(150), sqrt(40.0), 0.1);
  penSizeSlider.position(1050,100);
  pp7b = createP('Color alpha : ');
  pp7b.position(1050,120);
  alphaSlider = createSlider(1, 255, 255, 1);
  alphaSlider.position(1050,140);
  pp8 = createP('Color contrast, color brightness : ');
  pp8.position(1050,160);
  contrastSlider = createSlider(10, 275, 125, 1);
  contrastSlider.position(1050,180);
  brightSlider = createSlider(10, 275, 155, 1);
  brightSlider.position(1050+150,180);
  pp10 = createP('Particle color offset : ');
  pp10.position(1050,200);
  particleColorOffsetSlider = createSlider(0.1, 10, 1, 0.1);
  particleColorOffsetSlider.position(1050,220);
  
  pp11 = createP('X and Y bias : ');
  pp11.position(20,280);
  xbiasSlider = createSlider(-10, 10, 0, 0.1);
  xbiasSlider.position(20,300);
  ybiasSlider = createSlider(-10, 10, 0, 0.1);
  ybiasSlider.position(20,320);
  pp12 = createP('Swirl bias : ');
  pp12.position(20,340);
  sbiasSlider = createSlider(-5, 5, 0, 0.1);
  sbiasSlider.position(20,360);
  pp12 = createP('Swirl bias xy position, radius : ');
  pp12.position(20,380);
  sbiasXSlider = createSlider(0, width, width/2, 1);
  sbiasXSlider.position(20,400);
  sbiasYSlider = createSlider(0, height, height/2, 1);
  sbiasYSlider.position(20,420);
  sbiasRSlider = createSlider(-5.0, 5.0, -0.3, 0.01);
  sbiasRSlider.position(20,440);
  
  buttonbias = createButton('Remove bias');
  buttonbias.position(20,470);
  buttonbias.mousePressed(remove_bias);
  
  fr = createP('');
  fr.position(200,500);
  
  
  nbp = createP('Current number of particles : ' + NB_PARTICLES);
  nbp.position(340,520);
  nbp2 = createP('Number of particles in the next set : ');
  nbp2.position(340,540);
  particleNumberSlider = createSlider(1, sqrt(sqrt(3000)), sqrt(sqrt(500)), 0.01);
  particleNumberSlider.position(340,560);
  
  p1 = createP('Border bounce : ');
  p1.position(560,520);
  bounceSlider = createSlider(0, 1, 0, 1);
  bounceSlider.position(560,540);
  p2 = createP('Mouse attraction/repulsion and swirl factors : ');
  p2.position(720,520);
  mouseSlider = createSlider(-5, 5, -1.4, 0.01);
  mouseSlider.position(720,540);
  mouseSwirlSlider = createSlider(-4, 4, 0, 0.01);
  mouseSwirlSlider.position(720,560);
  p3 = createP('Color offsets : ');
  p3.position(1050,240);
  redoSlider = createSlider(0, 10, 10*noise(10000), 0.01);
  redoSlider.position(1050,260);
  greenoSlider = createSlider(0, 10, 10*noise(20000), 0.01);
  greenoSlider.position(1050,280);
  blueoSlider = createSlider(0, 10, 10*noise(30000), 0.01);
  blueoSlider.position(1050,300);
  p4 = createP('Color oscillation periods : ');
  p4bis = createP('(Align them or set them to 0 to get simpler color gradients)');
  p4.position(1050,320);
  p4bis.position(1050,340);
  redSlider = createSlider(0, 20, 3, 1);
  redSlider.position(1050,360);
  greenSlider = createSlider(0, 20, 3, 1);
  greenSlider.position(1050,380);
  blueSlider = createSlider(0, 20, 3, 1);
  blueSlider.position(1050,400);
  p5_ = createP('Background fade : ');
  p5_.position(1050,420);
  fade1Slider = createSlider(0, 1, 0, 0.01);
  fade1Slider.position(1050,440);
  fade2Slider = createSlider(0, 255, 255, 1);
  fade2Slider.position(1050,460);
  
  p6 = createP('Max frame Rate : ' + 40);
  p6.position(200,520);
  framerateSlider = createSlider(1, 60, 40, 1);
  framerateSlider.position(200,540);
  
  p7 = createP('<strong>Settings of rectangle mode : </strong>');
  p7.position(20,580);
  p8 = createP('Rectangle stroke : ');
  p8.position(20,600);
  boxSlider = createSlider(0, 255, 50, 1);
  boxSlider.position(20,620);
  box2Slider = createSlider(0, 255, 0, 1);
  box2Slider.position(20,640);
  p9 = createP('Freeze ratio : ');
  p9.position(200,600);
  freezeSlider = createSlider(0, 100, 50, 1);
  freezeSlider.position(200,620);
  
  psel = createP('<strong>Pen style :</strong>')
  psel.position(20,490);
  sel = createSelect();
  sel.position(20, 510);
  sel.option('line');
  sel.option('circle');
  sel.option('square');
  sel.option('empty circle');
  sel.option('empty square');
  sel.changed(mySelectEvent);
  
  stylestroke = createP('Stroke weight : ');
  stylestroke.position(20,530);
  penstrokeSlider = createSlider(1, 10, 1, 1);
  penstrokeSlider.position(20,550);
}

function mySelectEvent() {
  defsel = sel.value();
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
  for(var i = NB_PARTICLES-1;i>=0;i--){
    rectangles.pop();
  }
  NB_PARTICLES = int(particleNumberSlider.value()*particleNumberSlider.value()*particleNumberSlider.value()*particleNumberSlider.value());
  var pseed = random();
  if (mode === 0) {
    for(var i = 0;i<NB_PARTICLES;i++){
      particles[i] = new Particle(pseed);
    }
  } else {
    for(var i = 0;i<NB_PARTICLES;i++){
      rectangles[i] = new Rectangle(pseed);
    }
  }
}

function remove_bias() {
  xbiasSlider.remove();
  xbiasSlider = createSlider(-10, 10, 0, 0.1);
  xbiasSlider.position(20,300);
  ybiasSlider.remove();
  ybiasSlider = createSlider(-10, 10, 0, 0.1);
  ybiasSlider.position(20,320);
  sbiasSlider.remove();
  sbiasSlider = createSlider(-5, 5, 0, 0.1);
  sbiasSlider.position(20,360);
  sbiasXSlider.remove();
  sbiasXSlider = createSlider(0, width, width/2, 1);
  sbiasXSlider.position(20,400);
  sbiasYSlider.remove();
  sbiasYSlider = createSlider(0, height, height/2, 1);
  sbiasYSlider.position(20,420);
  sbiasRSlider.remove();
  sbiasRSlider = createSlider(-5.0, 5.0, -0.3, 0.01);
  sbiasRSlider.position(20,440);
}

function reset() {
    location.reload();
    seedRandom();
    seedNoise();
}

function change_mode() {
    mode = (mode + 1) % 2;
    new_particles();
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
  } else if (key === 'm') {
    change_mode();
  }
}

function canvas_save() {
  saveCanvas('myCanvas', 'png');
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
      xoff += incSlider.value()*incSlider.value();
    }
    yoff += incSlider.value()*incSlider.value();

    zoff += fieldChangeRateSlider.value()*fieldChangeRateSlider.value();
    
  }

  if (mode === 0) {
    for (var i = 0; i < particles.length; i++) {
      particles[i].follow(flowfield);
      particles[i].update();
      particles[i].edges();
      particles[i].show();
    }
  } else {
    for (var i = 0; i < rectangles.length; i++) {
      rectangles[i].follow(flowfield);
      rectangles[i].update();
      rectangles[i].edges();
      rectangles[i].show();
    }
  }
  
  frameRate(framerateSlider.value());

  fr.html("FPS : " + floor(frameRate()));
  p6.html('Max frame Rate : ' + framerateSlider.value());
  
  nbp.html('Current number of particles : ' + NB_PARTICLES);
  nbp2.html('Number of particles in the next set : ' + int(particleNumberSlider.value()*particleNumberSlider.value()*particleNumberSlider.value()*particleNumberSlider.value()));
}
