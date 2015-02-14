module.exports = function(canvas) {
  window.addEventListener('resize', resize);
  resize();

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
};
