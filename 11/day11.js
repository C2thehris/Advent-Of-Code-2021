class Point {
  constructor(i, j) {
    this.x = i;
    this.y = j;
  }
}

function getNeighbors(point) {
  const neighbors = [];
  if (point.x > 0) {
    neighbors.push(new Point(point.x - 1, point.y));
    if (point.y > 0) {
      neighbors.push(new Point(point.x - 1, point.y - 1));
    }
    if (point.y < 9) {
      neighbors.push(new Point(point.x - 1, point.y + 1));
    }
  }
  if (point.x < 9) {
    neighbors.push(new Point(point.x + 1, point.y));
    if (point.y > 0) {
      neighbors.push(new Point(point.x + 1, point.y - 1));
    }
    if (point.y < 9) {
      neighbors.push(new Point(point.x + 1, point.y + 1));
    }
  }

  if (point.y > 0) {
    neighbors.push(new Point(point.x, point.y - 1));
  }
  if (point.y < 9) {
    neighbors.push(new Point(point.x, point.y + 1));
  }

  return neighbors;
}

function flash(primed, stack) {
  const next = [];
  let count = 0;
  primed.forEach((row) => {
    const line = [];
    row.forEach((num) => {
      if (num <= 9) {
        line.push(num);
      } else {
        line.push(0);
      }
    });
    next.push(line);
  });

  while (stack.length > 0) {
    const point = stack.pop();
    const neighbors = getNeighbors(point);
    neighbors.forEach((neighbor) => {
      if (next[neighbor.x][neighbor.y] !== 0) {
        next[neighbor.x][neighbor.y] += 1;
      }
      if (next[neighbor.x][neighbor.y] > 9) {
        next[neighbor.x][neighbor.y] = 0;
        stack.push(neighbor);
      }
    });
    count += 1;
  }

  const neighbors = getNeighbors(stack);
  neighbors.forEach((neighbor) => {
    next[neighbor.x][neighbor.y] += 1;
    if (next[neighbor.x][neighbor.y] > 9) {
      stack.push(neighbor);
    }
  });

  return [next, count];
}

function step(current) {
  const levelup = [];
  current.forEach((row) => {
    const line = [];
    row.forEach((num) => line.push(num + 1));
    levelup.push(line);
  });

  const stack = [];

  for (let i = 0; i < levelup.length; i += 1) {
    for (let j = 0; j < levelup[0].length; j += 1) {
      if (levelup[i][j] > 9) {
        stack.push(new Point(i, j));
      }
    }
  }

  return flash(levelup, stack);
}

function part1(nums) {
  let ans = 0;
  let current = nums;

  for (let i = 0; i < 100; i += 1) {
    const ret = step(current);
    // eslint-disable-next-line prefer-destructuring
    current = ret[0];
    ans += ret[1];
  }

  console.log(`Part 1: ${ans}`);
}

function part2(nums) {
  let ans = 0;
  let current = nums;

  let end = false;
  while (!end) {
    ans += 1;
    const ret = step(current);
    // eslint-disable-next-line prefer-destructuring
    current = ret[0];
    end = true;
    for (let i = 0; i < 10 && end; i += 1) {
      for (let j = 0; j < 10 && end; j += 1) {
        if (current[i][j] !== 0) {
          end = false;
        }
      }
    }
  }

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
  const nums = [];
  lines.forEach((line) => {
    const arr = [];
    for (let i = 0; i < line.length; i += 1) {
      arr.push(parseInt(line[i], 10));
    }
    nums.push(arr);
  });

  part1([...nums]);
  part2([...nums]);
});
