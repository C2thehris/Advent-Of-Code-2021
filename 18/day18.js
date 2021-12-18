/* eslint-disable no-restricted-globals */
function percolateLeft(pair, num) {
  let current = pair.parent;
  let prev = pair;
  while (current) {
    if (prev !== current.left) {
      prev = current;
      current = current.left;
      if (isNaN(current)) {
        while (isNaN(current.right)) {
          current = current.right;
        }
        current.right += num;
        return;
      }
      prev.left += num;
    }
    if (!isNaN(current.left)) {
      current.left += num;
      return;
    }
    prev = current;
    current = current.parent;
  }
}

function percolateRight(pair, num) {
  let current = pair.parent;
  let prev = pair;
  while (current) {
    if (prev !== current.right) {
      prev = current;
      current = current.right;
      if (isNaN(current)) {
        while (isNaN(current.left)) {
          current = current.left;
        }
        current.left += num;
        return;
      }
      prev.right += num;
      return;
    }
    if (!isNaN(current.right)) {
      current.right += num;
      return;
    }
    prev = current;
    current = current.parent;
  }
}

function split(pair, parent, depth) {
  if (!isNaN(pair)) {
    let success = false;
    if (pair >= 10) {
      success = true;
      const newPair = {};
      newPair.left = Math.floor(pair / 2);
      newPair.right = Math.ceil(pair / 2);
      newPair.parent = parent;
      if (pair === parent.left) {
        parent.left = newPair;
      } else {
        parent.right = newPair;
      }
    }
    return success;
  }

  let success = split(pair.left, pair, depth + 1);
  if (!success) {
    success = split(pair.right, pair, depth + 1);
  }
  return success;
}

function explode(pair, depth) {
  if (depth >= 4) {
    if (isNaN(pair)) {
      percolateLeft(pair, pair.left);
      percolateRight(pair, pair.right);
      if (pair === pair.parent.left) {
        pair.parent.left = 0;
      } else {
        pair.parent.right = 0;
      }
    }
    return true;
  }

  let success = false;
  if (isNaN(pair.left)) {
    success = explode(pair.left, depth + 1);
  }
  if (isNaN(pair.right) && !success) {
    success = explode(pair.right, depth + 1);
  }
  return success;
}

function addition(lhs, rhs) {
  const sum = {};

  sum.left = lhs;
  lhs.parent = sum;
  sum.right = rhs;
  rhs.parent = sum;

  let cont = true;

  while (cont) {
    cont = explode(sum, 0);
    if (!cont) {
      cont = split(sum, 0);
    }
  }

  return sum;
}

function getValue(pair) {
  let magnitude = 0;

  if (isNaN(pair.left)) {
    magnitude += 3 * getValue(pair.left);
  } else {
    magnitude += 3 * pair.left;
  }

  if (isNaN(pair.right)) {
    magnitude += 2 * getValue(pair.right);
  } else {
    magnitude += 2 * pair.right;
  }

  return magnitude;
}

function part1(pairs) {
  let sum;
  pairs.forEach((pair) => {
    if (sum === undefined) {
      sum = pair;
    } else {
      sum = addition(sum, pair);
    }
  });

  const ans = getValue(sum);

  console.log(`Part 1: ${ans}`);
}

function convertToPair(line) {
  if (!isNaN(line)) {
    return parseInt(line, 10);
  }

  const stripped = line.substring(1, line.length - 1);
  let count = 0;
  let i = 0;
  do {
    if (stripped[i] === '[') {
      count += 1;
    }
    if (stripped[i] === ']') {
      count -= 1;
    }
    i += 1;
  } while (count > 0);

  const pair = {};
  const left = stripped.substring(0, i);
  const right = stripped.substring(i + 1, line.length);
  pair.left = convertToPair(left);
  pair.left.parent = pair;
  pair.right = convertToPair(right);
  pair.right.parent = pair;

  return pair;
}

function part2(lines) {
  let max = 0;
  for (let i = 0; i < lines.length; i += 1) {
    for (let j = 0; j < lines.length; j += 1) {
      if (i !== j) {
        let pairs = [];
        lines.forEach((line) => {
          const pair = convertToPair(line);
          pairs = [...pairs, pair];
        });
        max = Math.max(getValue(addition(pairs[i], pairs[j])), max);
      }
    }
  }

  console.log(`Part 2: ${max}`);
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

  let pairs = [];
  lines.forEach((line) => {
    const pair = convertToPair(line);
    pairs = [...pairs, pair];
  });

  part1(pairs);
  part2(lines);
});
