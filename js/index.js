require('../css/index.css');

var canvas = document.createElement('canvas');
var app = require('./app');

document.body.appendChild(canvas);

var analyser;

navigator.webkitGetUserMedia({ audio: true }, function(stream) {
  console.log('Got user media');
  var context = new AudioContext();
  analyser = context.createAnalyser();
  var microphone = context.createMediaStreamSource(stream);
  microphone.connect(analyser);
}, function(e) {
  console.error('Failed to get user media', e);
});

var gl = canvas.getContext('webgl');
app.init(gl);
draw();

var volume = 0;

function draw() {
  if (analyser) {
    var fft = new Float32Array(analyser.frequencyBinCount);
    analyser.getFloatFrequencyData(fft);
    volume = getAverageVolume(fft);
  }

  app.draw(gl, Date.now(), volume);
  requestAnimationFrame(draw);
}

function getAverageVolume(fft) {
  var volume = 140 + average(fft);
  if (volume < 0) {
    return 0;
  }
  return volume;
}

function average(array) {
  var total = 0;
  for (var i = 0; i < array.length; i++) {
    total += array[i];
  }
  return total / array.length;
}
