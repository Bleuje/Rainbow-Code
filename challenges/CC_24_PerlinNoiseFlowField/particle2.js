function Particle(pos_seed) {
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);
  this.particuleOffset = random(10);
  this.h = this.particuleOffset;
  this.h2 = 0;
  
  this.initial_position = function(pos_seed) {
    this.pos = createVector(width*noise(1000*pos_seed + 0.5*random()), height*noise(2000*pos_seed + 0.5*random()));
    this.prevPos = this.pos.copy();
  }
  
  this.initial_position(pos_seed);
  
  this.offp = random(10000);
  
  this.start_red = 155*noise(12345);
  this.start_green = 155*noise(1234)
  this.start_blue = 155*noise(123);
  this.amp_red = noise(3333)*125;
  this.amp_green = noise(2222)*125;
  this.amp_blue = noise(1111)*125;
  
    //this.posSphere = createVector(width/2*sin(PI*this.pos.y/height)*cos(2*PI*this.pos.x/width) + width/2,height/2*cos(PI*this.pos.y/height) + height/2);
  

  this.prevPos = this.pos.copy();
  //this.prevPosSphere = this.posSphere.copy();

  this.update = function() {
    this.vel.add(this.acc);
    this.vel.mult(speedSlider.value());
    //this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
    
    this.start_red = brightSlider.value()*noise(12345);
    this.start_green = brightSlider.value()*noise(1234)
    this.start_blue = brightSlider.value()*noise(123);
    this.amp_red = noise(3333)*contrastSlider.value();
    this.amp_green = noise(2222)*contrastSlider.value();
    this.amp_blue = noise(1111)*contrastSlider.value();
    
    //this.posSphere = createVector(width/2*sin(PI*this.pos.y/height)*cos(2*PI*this.pos.x/width) + width/2,height/2*cos(PI*this.pos.y/height) + height/2);
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
  
    var off1 = 50*noise(10000);
    var off2 = 50*noise(20000);
    var off3 = 50*noise(30000);
    
    
  this.show = function() {
    
    var param = (sin(0.05*this.h + off1)+1)/2;
    var param2 = (sin(0.02*this.h + off2)+1)/2;
    var param3 = (sin(0.03*this.h + off3)+1)/2;
    stroke(this.start_red + this.amp_red*param, this.start_green + this.amp_green*param3, this.start_blue + this.amp_blue*noise(3*param3));
    this.h2 = this.h2 + colorGradientSlider.value();
    this.h = this.particuleOffset*particleColorOffsetSlider.value() + this.h2;
    var sw = noise(20000 + 0.01*frameCount + this.offp);
    strokeWeight(penSizeSlider.value()*sw*sw*sw);
    line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
    //line(this.posSphere.x, this.posSphere.y, this.prevPosSphere.x, this.prevPosSphere.y);
    this.updatePrev();
  }

  this.updatePrev = function() {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
    //this.prevPosSphere.x = this.posSphere.x;
    //this.prevPosSphere.y = this.posSphere.y;
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
