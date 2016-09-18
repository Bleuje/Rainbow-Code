function Triangle(pos_seed) {
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);
  this.triangleOffset = random(10);
  this.h = this.triangleOffset;
  this.h2 = 0;
  
  this.initial_position = function(pos_seed) {
    this.pos1 = createVector(width*noise(1000*pos_seed + 0.1*random()), height*noise(2000*pos_seed + 0.1*random()));
    this.pos2 = createVector(width*noise(1000*pos_seed + 0.1*random()), height*noise(2000*pos_seed + 0.1*random()));
    this.pos3 = createVector(width*noise(1000*pos_seed + 0.1*random()), height*noise(2000*pos_seed + 0.1*random()));
  }
  
  this.initial_position(pos_seed);
  
  this.offp = random(10000);

  this.prevPos = this.pos.copy();

  this.update = function() {
    this.vel.add(this.acc);
    this.vel.mult(speedSlider.value());
    this.pos.add(this.vel);
    this.acc.mult(0);
    
    this.start_red = brightSlider.value()*noise(12345+ redoSlider.value());
    this.start_green = brightSlider.value()*noise(1234+ greenoSlider.value())
    this.start_blue = brightSlider.value()*noise(123+ blueoSlider.value());
    this.amp_red = noise(3333+ 3*redoSlider.value())*contrastSlider.value();
    this.amp_green = noise(2222+ 4*greenoSlider.value())*contrastSlider.value();
    this.amp_blue = noise(1111+ 5*blueoSlider.value())*contrastSlider.value();
  }

  this.follow = function(vectors) {
    var x = floor(this.pos.x / scl);
    var y = floor(this.pos.y / scl);
    var index = x + y * cols;
    var force = vectors[index];
    this.applyForce(force);
  }

  this.applyForce = function(force) {
    var xx = (this.pos.x - width/2)/width;
    var yy = (this.pos.y - height/2)/height;
    this.acc.add(force);
    this.acc.add(createVector((2*random()-1)*forceNoiseSlider.value(),(2*random()-1)*forceNoiseSlider.value()));
    
    if (mouseIsPressed && mouseX>=0 && mouseY>=0 && mouseX<width && mouseY<height) {
        var attraction = createVector(mouseX - this.pos.x,mouseY - this.pos.y);
        attraction.normalize();
        attraction.mult(mouseSlider.value()*forceMagSlider.value());
        this.acc.add(attraction);
    }
    
  }
    
  this.show = function() {
    
    var param = (sin(0.01*redSlider.value()*this.h + redoSlider.value())+1)/2;
    var param2 = (sin(0.01*greenSlider.value()*this.h + greenoSlider.value())+1)/2;
    var param3 = (sin(0.01*blueSlider.value()*this.h + blueoSlider.value())+1)/2;
    stroke(this.start_red + this.amp_red*param, this.start_green + this.amp_green*param2, this.start_blue + this.amp_blue*param3);
    this.h2 = this.h2 + colorGradientSlider.value();
    this.h = this.triangleOffset*triangleColorOffsetSlider.value() + this.h2;
    var sw = noise(20000 + 0.01*frameCount + this.offp);
    strokeWeight(penSizeSlider.value()*sw*sw*sw);
    line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
    this.updatePrev();
  }

  this.updatePrev = function() {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }

  this.edges = function() {
    
    if (bounceSlider.value()) {
      if (this.pos.x > width) {
        this.vel.x *= -2;
        this.updatePrev();
      }
      if (this.pos.x < 0) {
        this.vel.x *= -2;
        this.updatePrev();
      }
      if (this.pos.y > height) {
        this.vel.y *= -2;
        this.updatePrev();
      }
      if (this.pos.y < 0) {
        this.vel.y *= -2;
        this.updatePrev();
      }
    } else {
      if (this.pos.x > width) {
        this.pos.x = 0;
        this.updatePrev();
      }
      if (this.pos.x < 0) {
        this.pos.x = width;
        this.updatePrev();
      }
      if (this.pos.y > height) {
        this.pos.y = 0;
        this.updatePrev();
      }
      if (this.pos.y < 0) {
        this.pos.y = height;
        this.updatePrev();
      }
    }

  }

}
