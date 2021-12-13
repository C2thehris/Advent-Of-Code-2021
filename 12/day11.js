class Cave {
  constructor(str) {
    this.name = str;
    this.neighborsList = [];
    this.isEnd = str === 'start';

    if (str === str.toUpperCase()) {
      this.big = true;
    } else {
      this.visited = false;
      this.big = false;
    }
  }

  setVisited() { this.visited = true; }

  unsetVisited() { this.visited = false; }

  addNeighbor(node) {
    this.neighborsList = [...this.neighborsList, node];
  }

  get neighbors() {
    return this.neighborsList;
  }
}

function exploreCave(cave, map, twice) {
  if (cave.name === 'end') {
    return 1;
  }

  let paths = 0;
  cave.neighbors.forEach((neighbor) => {
    if (neighbor.big) {
      paths += exploreCave(neighbor, map, twice);
    } else if (!neighbor.visited) {
      neighbor.setVisited();
      paths += exploreCave(neighbor, map, twice);
      neighbor.unsetVisited();
    } else if (twice && !neighbor.isEnd) {
      paths += exploreCave(neighbor, map, false);
    }
  });

  return paths;
}

function part1(caves) {
  caves.get('start').setVisited();
  const ans = exploreCave(caves.get('start'), caves, false);

  console.log(`Part 1: ${ans}`);
}

function part2(caves) {
  caves.get('start').setVisited();
  const ans = exploreCave(caves.get('start'), caves, true);

  console.log(`Part 2: ${ans}`);
}

const fs = require('fs');

if (process.argv.length < 3) {
  console.error('Invalid Usage.\nUsage: node template.js [input file]');
  process.exit(1);
}

fs.readFile(process.argv[2], 'ascii', (err, data) => {
  if (err) throw err;

  const lines = data.split('\n');
  lines.pop();
  const caves = new Map();

  lines.forEach((line) => {
    const terms = line.split('-');
    if (!caves.has(terms[0])) {
      caves.set(terms[0], new Cave(terms[0]));
    }
    if (!caves.has(terms[1])) {
      caves.set(terms[1], new Cave(terms[1]));
    }
    caves.get(terms[0]).addNeighbor(caves.get(terms[1]));
    caves.get(terms[1]).addNeighbor(caves.get(terms[0]));
  });

  part1(caves);
  part2(caves);
});
