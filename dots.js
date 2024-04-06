var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var raf;

var min_vx = -1;
var max_vx = 1;

var min_vy = -1;
var max_vy = 1;

var min_rad = 1;
var max_rad = 5;

var color = 'blue';


dots = []

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

function drawDots() {
  ctx.clearRect(0,0, canvas.width, canvas.height);
  dots.forEach(dot => drawDot(dot));
  raf = window.requestAnimationFrame(drawDots);
}

function drawDot(dot) {
  dot.draw();
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
  return Math.floor((canvas.height*canvas.width)/(max_rad*max_rad*Math.PI)*.005);
}
fix_blur();
createDots();
drawDots();
raf = window.requestAnimationFrame(drawDots);
