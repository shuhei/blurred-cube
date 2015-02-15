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

// Destruct elements into vertices.
module.exports = elements.reduce(function(acc, index) {
  acc.push(uniqueVertices[index * 3]);
  acc.push(uniqueVertices[index * 3 + 1]);
  acc.push(uniqueVertices[index * 3 + 2]);
  return acc;
}, []);
