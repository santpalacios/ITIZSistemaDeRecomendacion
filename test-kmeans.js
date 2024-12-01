const { kmeans } = require('ml-kmeans');

const data = [
  [1, 2],
  [1, 4],
  [1, 0],
  [10, 2],
  [10, 4],
  [10, 0]
];

const clusters = kmeans(data, 2);

console.log('Clusters:', clusters);