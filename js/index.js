var app = require('./app');
var fit = require('./fit');
var microphone = require('./microphone');

var canvas = document.createElement('canvas');
document.body.appendChild(canvas);
fit(canvas);

var getVolume = microphone();

var gl = canvas.getContext('webgl');
app.init(gl);
draw();

function draw() {
  var volume = getVolume() || 0;
  app.draw(gl, Date.now(), volume);
  requestAnimationFrame(draw);
}
