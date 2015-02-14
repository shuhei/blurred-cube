var createProgram = require('./shader');

module.exports = {
  init: init,
  draw: draw
};

var program;
var buffer;

var uniqueVertices = [
  -1, -1, -1,
  -1, -1, 1,
  -1, 1, -1,
  -1, 1, 1,
  1, -1, -1,
  1, -1, 1,
  1, 1, -1,
  1, 1, 1
];

var elements = [
  0, 1,
  1, 3,
  3, 2,
  2, 0,

  4, 5,
  5, 7,
  7, 6,
  6, 4,

  0, 4,
  1, 5,
  2, 6,
  3, 7
];

var originalVertices = elements.reduce(function(acc, index) {
  acc.push(uniqueVertices[index * 3]);
  acc.push(uniqueVertices[index * 3 + 1]);
  acc.push(uniqueVertices[index * 3 + 2]);
  return acc;
}, []);

var vertices = new Float32Array(originalVertices);

function init(gl) {
  // Create shaders and program.
  var vertSrc = getScript('shader-vert');
  var fragSrc = getScript('shader-frag');
  var attributeNames = ['position'];
  var uniformNames = ['transform'];
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

  var ROTATION_TIME = 5000;
  var theta = (t % ROTATION_TIME) / ROTATION_TIME * Math.PI * 2;
  var transform = multiply(multiply(rotateX(theta), rotateY(theta)), scale(0.3));
  gl.uniformMatrix3fv(program.uniforms.transform, false, transform);

  for (var i = 0; i < 5; i++) {
    randomVertices(volume * 0.03);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.drawArrays(gl.LINES, 0, elements.length);
  }
}

function getScript(id) {
  var script = document.getElementById(id);
  return script.innerText;
}

function rotateX(radian) {
  var cos = Math.cos(radian);
  var sin = Math.sin(radian);
  return [
    1, 0, 0,
    0, cos, -sin,
    0, sin, cos
  ];
}

function rotateY(radian) {
  var cos = Math.cos(radian);
  var sin = Math.sin(radian);
  return [
    cos, 0, sin,
    0, 1, 0,
    -sin, 0, cos
  ];
}

function multiply(mat1, mat2) {
  var size = 3;
  var result = new Array(size * size);
  for (var i = 0; i < size * size; i++) {
    result[i] = nth(i);
  }
  return result;

  function nth(n) {
    var x = n % size;
    var y = (n - x) / size;
    var sum = 0;
    for (var i = 0; i < size; i++) {
      sum += mat1[i + y * size] * mat2[x + i * size];
    }
    return sum;
  }
}

function scale(num) {
  return [
    num, 0, 0,
    0, num, 0,
    0, 0, num
  ];
}

function randomVertices(amplitude) {
  for (var i = 0; i < vertices.length; i++) {
    vertices[i] = originalVertices[i] + amplitude * (Math.random() - 0.5);
  }
}
