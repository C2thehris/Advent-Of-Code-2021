/* eslint-disable no-console */
let marks = [];
let stack = [];

function isOpen(char) {
  return (char === '(' || char === '{' || char === '[' || char === '<');
}

function isChunk(open, close) {
  if (open === '(') return close === ')';
  if (open === '{') return close === '}';
  if (open === '[') return close === ']';
  if (open === '<') return close === '>';
  return false;
}

function findClosing(i, j, line) {
  marks[i] = 'x';
  stack.push(line[i]);
  if (isChunk(line[i], line[j])) {
    marks[j] = 'x';
    stack.pop();
    return j + 1;
  }

  let valid = j;
  while (valid < line.length) {
    if (!isOpen(line[valid])) return -1;

    valid = findClosing(valid, valid + 1, line, marks);
    if (valid === -1) return -1;
    if (valid >= line.length) { return Infinity; }

    const next = isChunk(line[i], line[valid]);
    if (next) {
      marks[valid] = 'x';
      stack.pop();
      return valid + 1;
    }
  }

  return Infinity;
}

function val(char) {
  if (char === ')') return 3;
  if (char === ']') return 57;
  if (char === '}') return 1197;
  if (char === '>') return 25137;

  const error = {
    unkownEndChar: true,
  };
  throw error;
}

function score(line) {
  for (let i = 0; i < marks.length; i += 1) {
    if (marks[i] !== 'x') {
      return val(line[i]);
    }
  }

  const error = {
    lastCharValid: true,
  };
  throw error;
}

function part1(lines) {
  let ans = 0;
  const input = [...lines];

  input.forEach((line) => {
    [...line].forEach(() => {
      marks.push(' ');
    });
    for (let i = 0; i < line.length; i += 1) {
      if (marks[i] !== 'x') {
        const end = findClosing(i, i + 1, line, marks);
        if (end === -1) {
          ans += score(line);
          break;
        }
      }
    }

    stack = [];
    marks = [];
  });

  console.log(`Part 1: ${ans}`);
}

function smallScore(char) {
  if (char === '(') return 1;
  if (char === '[') return 2;
  if (char === '{') return 3;
  if (char === '<') return 4;

  const error = {
    unkownChar: true,
  };
  throw error;
}

function completeLine() {
  let stackVal = 0;
  while (stack.length > 0) {
    stackVal *= 5;
    stackVal += smallScore(stack.pop());
  }

  return stackVal;
}

function part2(lines) {
  let ans = [];
  const input = [...lines];

  input.forEach((line) => {
    [...line].forEach(() => {
      marks.push(' ');
    });
    let corrupted = false;
    for (let i = 0; i < line.length; i += 1) {
      if (marks[i] !== 'x') {
        const end = findClosing(i, i + 1, line, marks);
        if (end === -1) {
          corrupted = true;
          break;
        }
      }
    }
    if (!corrupted) {
      ans.push(completeLine());
    }

    stack = [];
    marks = [];
  });

  ans = ans.sort((a, b) => a - b);

  console.log(`Part 2: ${ans[Math.floor(ans.length / 2)]}`);
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
  part1(lines);
  part2(lines);
});
