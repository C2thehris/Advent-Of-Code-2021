/* eslint-disable no-console */
const board1 = [];
const board2 = [];

function getNeighbors(i, j, data) {
  if (i < 0 || i >= board1.length || j < 0 || j >= board1[0].length) return Infinity;

  return data[i][j];
}

function explore(i, j, data) {
  if (i < 0 || i >= board1.length || j < 0 || j >= board1[0].length) return 0;

  const neighbors = [];
  const left = [i - 1, j];
  const right = [i + 1, j];
  const down = [i, j - 1];
  const up = [i, j + 1];

  neighbors.push([getNeighbors(...left, data), left]);
  neighbors.push([getNeighbors(...right, data), right]);
  neighbors.push([getNeighbors(...down, data), down]);
  neighbors.push([getNeighbors(...up, data), up]);
  const current = getNeighbors(i, j, data);

  let lowest = true;
  for (let x = 0; x < 4; x += 1) {
    if (neighbors[x][0] !== Infinity) {
      const point = neighbors[x][1];
      if (neighbors[x][0] === current) {
        board1[i][j] = 0;
        lowest = false;
        board1[point[0]][point[1]] = 0;
      } else if (neighbors[x][0] < current) {
        board1[i][j] = 0;
        lowest = false;
      } else {
        board1[point[0]][point[1]] = 0;
      }
    }
  }

  if (lowest) {
    board1[i][j] = 1;
  }

  return board1[i][j];
}

function explore2(i, j, data, color) {
  if (i < 0 || j < 0 || i >= board2.length || j >= board2[0].length) return 0;
  if (data[i][j] === 9 || board2[i][j] !== -1) return 0;

  board2[i][j] = color;
  const left = explore2(i - 1, j, data, color);
  const right = explore2(i + 1, j, data, color);
  const up = explore2(i, j + 1, data, color);
  const down = explore2(i, j - 1, data, color);

  return left + right + up + down + 1;
}

function part1(lines) {
  let ans = 0;
  let index = 0;

  lines.forEach((element) => {
    board1.push([]);
    element.forEach(() => {
      board1[index].push(-1);
    });
    index += 1;
  });

  index = 0;
  board1.forEach(() => {
    board2.push([]);
    Object.assign(board2[index], board1[index]);
    index += 1;
  });

  for (let i = 0; i < board1.length; i += 1) {
    for (let j = 0; j < board1[i].length; j += 1) {
      if (board1[i][j] === -1) {
        const soln = explore(i, j, lines);
        if (soln) {
          ans += lines[i][j] + 1;
        }
      }
    }
  }

  console.log(`Part 1: ${ans}`);
}

function part2(lines) {
  let color = 0;

  const largest = [0, 0, 0];

  for (let i = 0; i < board2.length; i += 1) {
    for (let j = 0; j < board2[i].length; j += 1) {
      if (board2[i][j] === -1) {
        const size = explore2(i, j, lines, color);
        color += 1;
        if (size > largest[0]) {
          largest[0] = size;
          largest.sort((a, b) => a - b);
        }
      }
    }
  }

  console.log(`Part 2: ${largest[0] * largest[1] * largest[2]}`);
}

const fs = require('fs');

if (process.argv.length < 3) {
  console.error('Invalid Usage.\nUsage: node template.js [input file]');
  process.exit(1);
}

fs.readFile(process.argv[2], 'ascii', (err, data) => {
  if (err) throw err;

  const lines = data.split('\n').slice(0, -1);

  for (let i = 0; i < lines.length; i += 1) {
    lines[i] = lines[i].split('');
    for (let j = 0; j < lines[i].length; j += 1) {
      lines[i][j] = parseInt(lines[i][j], 10);
    }
  }

  part1(Object.assign([], lines));
  part2(Object.assign([], lines));
});
