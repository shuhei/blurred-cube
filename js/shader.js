module.exports = createProgram;

function createProgram(gl, vertSrc, fragSrc, uniformNames, attributeNames) {
  var vert = compileShader(gl, gl.VERTEX_SHADER, vertSrc);
  var frag = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc);

  var program = gl.createProgram();
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);

  var attributes = {};
  attributeNames.forEach(function(name, location) {
    gl.bindAttribLocation(program, location, name);
    console.log('attribute location', name, location);
    attributes[name] = location;
  });

  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error('Error linking program: ' + gl.getProgramInfoLog(program));
  }

  var uniforms = {};
  uniformNames.forEach(function(name) {
    var location = gl.getUniformLocation(program, name);
    console.log('uniform location', name, location);
    uniforms[name] = location;
  });

  return {
    program: program,
    uniforms: uniforms,
    attributes: attributes
  };
}

function compileShader(gl, type, src) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error('Error compiling shader: ' + gl.getShaderInfoLog(shader));
  }
  return shader;
}
