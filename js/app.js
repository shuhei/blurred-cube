var mat = require('gl-mat4');

var createProgram = require('./shader');
var originalVertices = require('./vertices');

module.exports = {
  init: init,
  draw: draw
};

var ROTATION_TIME = 5000;
var EYE = [0, 0, -10];
var VIEW_TRANSLATE = [0, 0, -7];

var vertices = new Float32Array(originalVertices);

var program;
var buffer;

var mvp = mat.create();

function init(gl) {
  // Create shaders and program.
  var vertSrc = getScript('shader-vert');
  var fragSrc = getScript('shader-frag');
  var attributeNames = ['position'];
  var uniformNames = ['mvp'];
  program = createProgram(gl, vertSrc, fragSrc, uniformNames, attributeNames);

  // Create buffer.
  buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(program.attributes.position);
  gl.vertexAttribPointer(program.attributes.position, 3, gl.FLOAT, false, 0, 0);

  gl.enable(gl.DEPTH_TEST);

  console.log(gl.drawingBufferWidth, gl.drawingBufferHeight);
}

function draw(gl, t, volume) {
  var w = gl.drawingBufferWidth;
  var h = gl.drawingBufferHeight;
  gl.viewport(0, 0, w, h);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(program.program);

  var theta = (t % ROTATION_TIME) / ROTATION_TIME * Math.PI * 2;
  mat.identity(mvp);

  // Perspective
  mat.perspective(mvp, Math.PI / 4, w / h, 0.1, 100);

  // Model View
  mat.translate(mvp, mvp, VIEW_TRANSLATE);
  mat.rotateX(mvp, mvp, theta);
  mat.rotateY(mvp, mvp, theta);

  gl.uniformMatrix4fv(program.uniforms.mvp, false, mvp);

  // Draw cube lines 5 times.
  for (var i = 0; i < 5; i++) {
    randomVertices(volume * 0.03);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.drawArrays(gl.LINES, 0, vertices.length / 3);
  }
}

function getScript(id) {
  var script = document.getElementById(id);
  return script.innerText;
}

function randomVertices(amplitude) {
  for (var i = 0; i < vertices.length; i++) {
    vertices[i] = originalVertices[i] + amplitude * (Math.random() - 0.5);
  }
}
