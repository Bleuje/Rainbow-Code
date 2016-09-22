var inc = 0.01;
var scl = 20;
var cols, rows;

var NB_PARTICLES = 250;

var zoff = 0;

var fr;

var particles = [];
var rectangles = [];

var GRAD = [];

var flowfield;

var WID = 800;
var HEI = 400;

var speedSlide,incSlider,forceNoiseSlider,forceMagSlider,brightSlider;

var defsel = 'line';
var bounce = false;
var color_noise = false;
var field_mode = 0;

var playing = true;

var mode = 0;

var capture;

var color_mode = 'Normal';

function setup() {
  var cnv = createCanvas(WID, HEI);
  cnv.style("border:1px solid #000000;");
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
  button.position(20,50);
  button2 = createButton('Pause/Play (P)');
  button2.mousePressed(pause_play);
  button2.position(90,50);
  button3 = createButton('Save canvas (S)');
  button3.mousePressed(canvas_save);
  button3.position(200,50);
  button4 = createButton('Clear canvas (C)');
  button4.mousePressed(clear_canvas);
  button4.position(310,50);
  button5 = createButton('Change color gradient (G)');
  button5.mousePressed(change_color);
  button5.position(420,50);
  button6 = createButton('New set of particles (N)');
  button6.mousePressed(new_particles);
  button6.position(600,50);
  button7 = createButton('Rectangle mode On/Off (M)');
  button7.mousePressed(change_mode);
  button7.position(800,50);
  
  
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
  pp6 = createP('Color gradient frequency : ');
  pp6.position(1050,480);
  colorGradientSlider = createSlider(0, sqrt(50), 1.0, 0.01);
  colorGradientSlider.position(1050,500);
  pp6bis = createP('Blend mode : ');
  pp6bis.position(1050,520);
  sel2 = createSelect();
  sel2.position(1050, 540);
  sel2.option('BLEND (default)');
  sel2.option('ADD');
  sel2.option('DARKEST');
  sel2.option('LIGHTEST');
  sel2.option('DIFFERENCE');
  sel2.option('EXCLUSION');
  sel2.option('MULTIPLY');
  sel2.option('SCREEN');
  sel2.option('OVERLAY');
  sel2.option('DODGE');
  sel2.option('BURN');
  sel2.changed(mySelectEvent2);
  
  pp6bis = createP('Filter : ');
  pp6bis.position(1175,520);
  sel4 = createSelect();
  sel4.position(1175, 540);
  sel4.option('NONE');
  sel4.option('GRAY');
  sel4.option('BLUR');
  sel4.option('DILATE');
  sel4.option('ERODE');
  sel4.changed(mySelectEvent4);
  
  pp7a = createP('Pen size : ');
  pp7a.position(1050,80);
  penSizeSlider = createSlider(sqrt(5), sqrt(300), sqrt(40.0), 0.1);
  penSizeSlider.position(1050,100);
  pp7c = createP('Pen size noise : ');
  pp7c.position(1200,80);
  penNoiseSlider = createSlider(0, 1, 1, 0.01);
  penNoiseSlider.position(1200,100)
  pp7b = createP('Color alpha : ');
  pp7b.position(1050,120);
  alphaSlider = createSlider(0, 1, 1, 0.001);
  alphaSlider.position(1050,140);
  bounceCbox = createCheckbox('Color noise',false);
  bounceCbox.position(1200,120);
  bounceCbox.changed(myCheckedEvent2);
  pp8 = createP('Color contrast : ');
  pp8.position(1050,160);
  contrastSlider = createSlider(10, 300, 130, 1);
  contrastSlider.position(1050,180);
  pp8bis = createP('Color brightness : ');
  pp8bis.position(1200,160);
  brightSlider = createSlider(10, 275, 150, 1);
  brightSlider.position(1050+150,180);
  pp10 = createP('Particle color offset : ');
  pp10.position(1050,200);
  particleColorOffsetSlider = createSlider(0.1, 25, 1, 0.01);
  particleColorOffsetSlider.position(1050,220);
  pp10bis = createP('Synchronized color noise : ');
  pp10bis.position(1200,200);
  colornoiseSlider = createSlider(0, 100, 0, 0.01);
  colornoiseSlider.position(1200,220);
  pp10t = createP('Noise \"frequency\" : ');
  pp10t.position(1200,360);
  noisefreqSlider = createSlider(0, 1, 0.2, 0.01);
  noisefreqSlider.position(1200,380);
  
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
  nbp.position(400,520);
  nbp2 = createP('Number of particles in the next set : ');
  nbp2.position(400,540);
  particleNumberSlider = createSlider(1, sqrt(sqrt(3000)), sqrt(sqrt(250)), 0.01);
  particleNumberSlider.position(400,560);
  
  bounceCbox = createCheckbox('Border bounce',false);
  bounceCbox.position(20,540);
  bounceCbox.changed(myCheckedEvent);
  /*
  psel3 = createP('<strong>Color mode :</strong>')
  psel3.position(710,520);
  sel3 = createSelect();
  sel3.position(710, 540);
  sel3.option('Normal');
  sel3.option('Capture');
  sel3.changed(mySelectEvent3);*/
  
  p2 = createP('Mouse-click attraction/repulsion :');
  p2.position(610,520);
  mouseSlider = createSlider(-5, 5, -1.4, 0.01);
  mouseSlider.position(610,540);
  p2 = createP('Mouse-click swirl :');
  p2.position(610,560);
  mouseSwirlSlider = createSlider(-4, 4, 0, 0.01);
  mouseSwirlSlider.position(610,580);
  p3 = createP('Color offsets : ');
  p3.position(1050,240);
  redoSlider = createSlider(0, 5, 5*noise(10000), 0.01);
  redoSlider.position(1050,260);
  greenoSlider = createSlider(0, 5, 5*noise(20000), 0.01);
  greenoSlider.position(1050,280);
  blueoSlider = createSlider(0, 5, 5*noise(30000), 0.01);
  blueoSlider.position(1050,300);
  p3bis = createP('Specialized noise intensity : ');
  p3bis.position(1200,240);
  rednSlider = createSlider(0, 100, 0, 0.01);
  rednSlider.position(1200,260);
  greennSlider = createSlider(0, 100, 0, 0.01);
  greennSlider.position(1200,280);
  bluenSlider = createSlider(0, 100, 0, 0.01);
  bluenSlider.position(1200,300);
  p4 = createP('Color oscillation frequencies : ');
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
  
  p6 = createP('Max frame rate : ' + 40);
  p6.position(200,520);
  framerateSlider = createSlider(1, 60, 40, 1);
  framerateSlider.position(200,540);
  
  p7 = createP('<strong>Settings of rectangle mode : </strong>');
  p7.position(20,575);
  p8 = createP('Rectangle stroke : ');
  p8.position(20,595);
  boxSlider = createSlider(0, 255, 50, 1);
  boxSlider.position(20,615);
  box2Slider = createSlider(0, 255, 0, 1);
  box2Slider.position(20,635);
  p9 = createP('Freeze ratio : ');
  p9.position(200,595);
  freezeSlider = createSlider(0, 100, 50, 1);
  freezeSlider.position(200,615);
  
  psel = createP('<strong>Pen style :</strong>')
  psel.position(1050,40);
  sel = createSelect();
  sel.position(1050, 60);
  sel.option('line');
  sel.option('circle');
  sel.option('square');
  sel.option('empty circle');
  sel.option('empty square');
  sel.changed(mySelectEvent);
  
  psel5 = createP('<strong>Field type :</strong>')
  psel5.position(20,500);
  sel5 = createSelect();
  sel5.position(20,520);
  sel5.option('Basic');
  sel5.option('Moving torus in 3D');
  sel5.changed(mySelectEvent5);
  
  stylestroke = createP('Stroke weight : ');
  stylestroke.position(1175,40);
  stylestroke.hide();
  penstrokeSlider = createSlider(1, 10, 1, 1);
  penstrokeSlider.position(1175,60);
  penstrokeSlider.hide();
  
  
  filterframeSlider = createSlider(1, 100, 30, 1);
  filterframeSlider.position(1175,580);
  filterframeSlider.hide();
  
  filterframe = createP('Filter every ' + filterframeSlider.value() + ' frames : ');
  filterframe.position(1175,560);
  filterframe.hide();
  
    colornoiseSlider.hide();
    noisefreqSlider.hide();
    rednSlider.hide();
    greennSlider.hide();
    bluenSlider.hide();
    p3bis.hide();
    pp10t.hide();
    pp10bis.hide();
  
  
}

function mySelectEvent() {
  defsel = sel.value();
  if (defsel === 'empty square' || defsel === 'empty circle') {
    penstrokeSlider.show();
    stylestroke.show();
  } else {
    penstrokeSlider.hide();
    stylestroke.hide();
  }
}

function mySelectEvent2() {
  var choice = sel2.value();
  if (choice === 'BLEND (default)') {
    blendMode(BLEND);
  } else if (choice === 'ADD') {
    blendMode(ADD);
  } else if (choice === 'DARKEST') {
    blendMode(DARKEST);
  } else if (choice === 'LIGHTEST') {
    blendMode(LIGHTEST);
  } else if (choice === 'DIFFERENCE') {
    blendMode(DIFFERENCE);
  } else if (choice === 'EXCLUSION') {
    blendMode(EXCLUSION);
  } else if (choice === 'MULTIPLY') {
    blendMode(MULTIPLY);
  } else if (choice === 'SCREEN') {
    blendMode(SCREEN);
  } else if (choice === 'OVERLAY') {
    blendMode(OVERLAY);
  } else if (choice === 'DODGE') {
    blendMode(DODGE);
  } else if (choice === 'BURN') {
    blendMode(BURN);
  }
}

var dilate_unused = true;

function mySelectEvent4() {
  var choice = sel4.value();
  if (choice === 'NONE') {
    filterframe.hide();
    filterframeSlider.hide();
  } else if (choice === 'GRAY') {
    filter(GRAY);
    filterframe.hide();
    filterframeSlider.hide();
  } else if (choice === 'DILATE') {
    filterframe.show();
    filterframeSlider.show();
    if(frameCount%filterframeSlider.value() === 0)  {filter(DILATE);}
  } else if (choice === 'BLUR') {
    filterframe.show();
    filterframeSlider.show();
    if(frameCount%filterframeSlider.value() === 0) filter(BLUR,1);
  } else if (choice === 'ERODE') {
    filterframe.show();
    filterframeSlider.show();
    if(frameCount%filterframeSlider.value() === 0) filter(ERODE);
  }
}

function mySelectEvent5() {
  var choice = sel5.value();
  if (choice === 'Moving torus in 3D') {
    field_mode = 1;
  } else if (choice === 'Basic') {
    field_mode = 0;
  }
}

var capture;
/*
function mySelectEvent3() {
  var choice = sel3.value();
  if (choice === 'Normal') {
    color_mode = 'Normal';
    capture.remove();
  } else if (choice === 'Capture') {
    color_mode = 'Capture';
    capture = createCapture(VIDEO);
    capture.size(320, 240);
    image(capture, 0, 0, 320, 240);
    loadPixels();
    GRAD = new ColorG(1);
  }
}
*/
function clear_canvas() {
  blendMode(BLEND);
  background(fade2Slider.value());
  blendMode(curMode);
}

function change_color() {
  noiseSeed(12345*random());
  redoSlider.remove();
  redoSlider = createSlider(0, 5, 5*noise(10000), 0.01);
  redoSlider.position(1050,260);
  greenoSlider.remove();
  greenoSlider = createSlider(0, 5, 5*noise(20000), 0.01);
  greenoSlider.position(1050,280);
  blueoSlider.remove();
  blueoSlider = createSlider(0, 10, 5*noise(30000), 0.01);
  blueoSlider.position(1050,300);
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

function myCheckedEvent() {
  if (this.checked()) {
    bounce = true;
    console.log("Checking!");
  } else {
    bounce = false;
    console.log("Unchecking!");
  }
}

function myCheckedEvent2() {
  if (this.checked()) {
    color_noise = true;
    colornoiseSlider.show();
    noisefreqSlider.show();
    rednSlider.show();
    greennSlider.show();
    bluenSlider.show();
    p3bis.show();
    pp10t.show();
    pp10bis.show();
    console.log("Checking!");
  } else {
    color_noise = false;
    colornoiseSlider.hide();
    noisefreqSlider.hide();
    rednSlider.hide();
    greennSlider.hide();
    bluenSlider.hide();
    p3bis.hide();
    pp10t.hide();
    pp10bis.hide();
    console.log("Unchecking!");
  }
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

var z_xoff = 0;
var z_yoff = 0;
var z_zoff = 0;


function draw() {
  /*
  if(color_mode === 'Capture'){
    image(capture, 0, 0, 320, 240);
    loadPixels();
    GRAD = new ColorG(1);
  }*/
  
  blendMode(BLEND);
  
  var aux = fade1Slider.value();
  background(fade2Slider.value(),255*aux*aux*aux);
  
  mySelectEvent2();
  
  if (field_mode === 0) {
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
  } else {  
    for (var y = 0; y < rows; y++) {
      for (var x = 0; x < cols; x++) {
        var index = x + y * cols;
        
        var t = x/cols;
        var t2 = y/rows;
        var radius_x = 0.6*incSlider.value()*cols/(2*PI);
        var radius_y = 0.5*incSlider.value()*rows/(2*PI);
        var r = radius_x + radius_y*cos(2*PI*t2);
        var xx = r*cos(2*PI*t);
        var yy = r*sin(2*PI*t);
        var zz = radius_y*sin(2*PI*t2);
  
        var angle = noise(xx + z_xoff, yy + z_yoff, zz + z_zoff) * TWO_PI * 4;
        var v = p5.Vector.fromAngle(angle);
        v.setMag(forceMagSlider.value());
        flowfield[index] = v;
      }
      //zoff += fieldChangeRateSlider.value()*fieldChangeRateSlider.value();
      z_xoff += 2*random()*fieldChangeRateSlider.value()*fieldChangeRateSlider.value();
      z_yoff += 2*random()*fieldChangeRateSlider.value()*fieldChangeRateSlider.value();
      z_zoff += 2*random()*fieldChangeRateSlider.value()*fieldChangeRateSlider.value();
    }
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
  
  mySelectEvent4();
  
  frameRate(framerateSlider.value());

  fr.html("FPS : " + floor(frameRate()));
  p6.html('Max frame rate : ' + framerateSlider.value());
  
  nbp.html('Current number of particles : ' + NB_PARTICLES);
  nbp2.html('Number of particles in the next set : ' + int(particleNumberSlider.value()*particleNumberSlider.value()*particleNumberSlider.value()*particleNumberSlider.value()));

  filterframe.html('Filter every ' + filterframeSlider.value() + ' frames : ');
}
