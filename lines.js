var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var raf;

var min_vx = -.5;
var max_vx = .5;

var min_vy = -.5;
var max_vy = .5;

var min_rad = 1;
var max_rad = 3;

var color = '#646f87'//'rgba(255, 255, 255)';
var c1 = 100;
var c2 = 111;
var c3 = 135;
var bgColor = 'black'

var max_distance = 150;

var dot_multi = .005;

dots = []
lines = []

function fix_blur() {
  var dpi = window.devicePixelRatio;
  var style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
  var style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
  canvas.setAttribute('height', style_height * dpi);
  canvas.setAttribute('width', style_width * dpi);
}

function createDots() {
  var numDots = getNumDots();
  for(var i = 0; i < numDots; i++) {
    var x = rand(0, canvas.width, false);
    var y = rand(0, canvas.height, false);

    var vx = rand(min_vx, max_vx, true);
    var vy = rand(min_vy, max_vy, true);

    var rad = rand(min_rad, max_rad, false);
    var dot = {
      x: x,
      y: y,
      vx: vx,
      vy: vy,
      radius: rad,
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
      }
    };
    dots.push(dot);
  }
}

function createLines() {
  lines = [];

  for(var i = 0; i < dots.length-1; i++) {

    var x1 = dots[i].x;
    var y1 = dots[i].y;

    for(var z = i+1; z < dots.length; z++) {
      var x2 = dots[z].x;
      var y2 = dots[z].y;
      var distance = dist(x1, y1, x2, y2);
      if(distance < max_distance) {
        opacity = 1-(distance/max_distance);
        var line = {
          x1: x1,
          x2: x2,
          y1: y1,
          y2: y2,
          opacity: opacity,
          draw() {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba('+c1+','+c2+','+c3+','+this.opacity+')';
            ctx.moveTo(this.x1, this.y1);
            ctx.lineTo(this.x2, this.y2);
            ctx.stroke();
          }
        };
        lines.push(line);
      }
    }
  }
}

function drawDots() {
  ctx.clearRect(0,0, canvas.width, canvas.height);
  //ctx.fillStyle = bgColor;
  //ctx.fillRect(0, 0, canvas.width, canvas.height);
  dots.forEach(dot => drawDot(dot));
  createLines();
  lines.forEach(line => drawLine(line));
  raf = window.requestAnimationFrame(drawDots);
}

function drawLine(line) {
  line.draw();
}

function drawDot(dot) {
  //dot.draw();
  dot.x += dot.vx;
  dot.y += dot.vy;

  if (dot.y + dot.vy > canvas.height ||
      dot.y + dot.vy < 0) {
    dot.vy = -dot.vy;
  }
  if (dot.x + dot.vx > canvas.width ||
      dot.x + dot.vx < 0) {
    dot.vx = -dot.vx;
  }
}

function rand(min, max, decimal) {
	var div = 1;
  if(decimal) {
  	min = min*100;
    max = max*100;
    div = 100;
  }
  return Math.floor(Math.random() * (max - min) + min) / div;
}

function getNumDots() {
  //return Math.floor((canvas.height*canvas.width)/(Math.pow(max_rad, 2)*Math.PI)*dot_multi);
  return 200;
}

function dist(x1, y1, x2, y2) {
  var x = Math.abs(Math.pow(x1-x2, 2));
  var y = Math.abs(Math.pow(y1-y2, 2));
  var distance = Math.sqrt(x+y);
  return distance;
}

fix_blur();
createDots();
drawDots();
raf = window.requestAnimationFrame(drawDots);
