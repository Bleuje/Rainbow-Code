function Particle() {
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);
  this.h = random(10);
  this.pos = createVector(width*noise(0.5*this.h), height*noise(10000+0.5*this.h));
  
  this.offp = random(10000);

  this.prevPos = this.pos.copy();

  this.update = function() {
    this.vel.add(this.acc);
    this.vel.mult(speedSlider.value());
    //this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  this.follow = function(vectors) {
    var x = floor(this.pos.x / scl);
    var y = floor(this.pos.y / scl);
    var index = x + y * cols;
    var force = vectors[index];
    this.applyForce(force);
  }

  this.applyForce = function(force) {
    var circleforce1 = 0;
    var circleforce2 = 0;
    var xx = (this.pos.x - width/2)/width;
    var yy = (this.pos.y - height/2)/height;
    this.acc.add(force);
    this.acc.add(createVector(-circleforce1*yy,circleforce1*xx));
    this.acc.add(createVector(circleforce2*xx,circleforce2*yy));
    this.acc.add(createVector(random(forceNoiseSlider.value()),random(forceNoiseSlider.value())));
  }
  
    var off1 = 50*noise(10000);
    var off2 = 50*noise(20000);
    var off3 = 50*noise(30000);
    var start_red = 155*noise(12345);
    var start_green = 155*noise(1234)
    var start_blue = 155*noise(123);
    var amp_red = noise(3333)*100;
    var amp_green = noise(2222)*100;
    var amp_blue = noise(1111)*100;
    

  this.show = function() {
    
    var param = (sin(0.05*this.h + off1)+1)/2;
    var param2 = (sin(0.02*this.h + off2)+1)/2;
    var param3 = (sin(0.03*this.h + off3)+1)/2;
    stroke(start_red + amp_red*param, start_green + amp_green*param3, start_blue + amp_blue*noise(3*param3));
    this.h = this.h + colorGradientSlider.value();
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
