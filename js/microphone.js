module.exports = function() {
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

  return function() {
    if (!analyser) {
      return null;
    }
    var fft = new Float32Array(analyser.frequencyBinCount);
    analyser.getFloatFrequencyData(fft);
    return getAverageVolume(fft);
  };
};

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
