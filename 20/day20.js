function getPixels(image, begin, end, row, empty) {
  if (row < 0 || row >= image.length) {
    return `${empty}${empty}${empty}`;
  }

  let pixels = '';
  for (let i = begin; i <= end; i += 1) {
    if (i < 0 || i >= image[row].length) {
      pixels = `${pixels}${empty}`;
    } else {
      pixels = `${pixels}${image[row][i]}`;
    }
  }

  return pixels;
}

function applyAlgorithm(image, algorithm, blank) {
  let next = [];
  let copy = [];
  for (let i = 0; i < image.length; i += 1) {
    next = [...next, `${blank}${image[i]}${blank}`];
    copy = [...copy, `${blank}${image[i]}${blank}`];
  }
  let empty = '';
  let dark = '';
  for (let i = 0; i < next[0].length; i += 1) {
    empty = `${blank}${empty}`;
    dark = `${algorithm[0]}${dark}`;
  }
  next = [dark, ...next, dark];
  copy = [empty, ...copy, empty];

  for (let i = 0; i < next.length; i += 1) {
    let current = '';
    for (let j = 0; j < next[0].length; j += 1) {
      const top = getPixels(copy, j - 1, j + 1, i - 1, blank);
      const middle = getPixels(copy, j - 1, j + 1, i, blank);
      const bottom = getPixels(copy, j - 1, j + 1, i + 1, blank);
      const complete = `${top}${middle}${bottom}`;
      const binary = complete.replaceAll('#', '1').replaceAll('.', '0');
      const num = parseInt(binary, 2);
      current = `${current}${algorithm[num]}`;
    }
    next[i] = current;
  }
  return next;
}

function countPixels(image) {
  let count = 0;
  image.forEach((row) => {
    row.split('').forEach((char) => {
      if (char === '#') {
        count += 1;
      }
    });
  });
  return count;
}

function part1(image, algorithm) {
  let next = applyAlgorithm(image, algorithm, '.');
  next = applyAlgorithm(next, algorithm, algorithm[0]);

  const ans = countPixels(next);

  console.log(`Part 1: ${ans}`);
}

function part2(image, algorithm) {
  let next = applyAlgorithm(image, algorithm, '.');
  for (let i = 0; i < 49; i += 1) {
    let blank = algorithm[0];
    if (algorithm[0] === '#') {
      if (i % 2 === 1) {
        blank = algorithm[511];
      }
    }
    next = applyAlgorithm(next, algorithm, blank);
  }

  const ans = countPixels(next);

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
  let algorithm = '';
  let input = [];

  lines.forEach((line) => {
    if (algorithm === '') {
      algorithm = line;
    } else {
      if (line === '') return;
      input = [...input, line];
    }
  });

  part1(input, algorithm);
  part2(input, algorithm);
});
