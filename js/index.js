require('../css/index.css');

var canvas = document.createElement('canvas');
var app = require('./app');

document.body.appendChild(canvas);

var gl = canvas.getContext('webgl');
app.init(gl);
draw();

function draw() {
  app.draw(gl, Date.now());
  requestAnimationFrame(draw);
}
