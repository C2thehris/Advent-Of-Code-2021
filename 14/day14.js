function chunkify(string) {
  const map = new Map();
  for (let i = 0; i < string.length - 1; i += 1) {
    const substr = `${string[i]}${string[i + 1]}`;
    if (map.has(substr)) {
      map.set(substr, map.get(substr) + 1);
    } else {
      map.set(substr, 1);
    }
  }

  return map;
}

function countOccurences(str) {
  const map = new Map();
  str.split('').forEach((char) => {
    if (map.has(char)) {
      map.set(char, map.get(char) + 1);
    } else {
      map.set(char, 1);
    }
  });

  return map;
}

function applyRules(chunks, counts, rules) {
  const next = new Map();
  chunks.forEach((count, chunk) => {
    if (rules.has(chunk)) {
      const middle = rules.get(chunk);
      const lhs = `${chunk[0]}${middle}`;
      const rhs = `${middle}${chunk[1]}`;
      if (next.has(lhs)) {
        next.set(lhs, next.get(lhs) + count);
      } else {
        next.set(lhs, count);
      }

      if (counts.has(middle)) {
        counts.set(middle, counts.get(middle) + count);
      } else {
        counts.set(middle, count);
      }

      if (next.has(rhs)) {
        next.set(rhs, next.get(rhs) + count);
      } else {
        next.set(rhs, count);
      }
    }
  });

  return [next, counts];
}

function minMax(counts) {
  let maxCount = 0;
  let minCount = Infinity;

  counts.forEach((value) => {
    maxCount = Math.max(maxCount, value);
    minCount = Math.min(minCount, value);
  });

  return [maxCount, minCount];
}

function part1(template, rules) {
  let prev = chunkify(template);
  let counts = countOccurences(template);
  for (let i = 0; i < 10; i += 1) {
    [prev, counts] = applyRules(prev, counts, rules);
  }

  const [maxCount, minCount] = minMax(counts);

  console.log(`Part 1: ${maxCount - minCount}`);
}

function part2(template, rules) {
  let prev = chunkify(template);
  let counts = countOccurences(template);
  for (let i = 0; i < 40; i += 1) {
    [prev, counts] = applyRules(prev, counts, rules);
  }

  const [maxCount, minCount] = minMax(counts);

  console.log(`Part 2: ${maxCount - minCount}`);
}

const fs = require('fs');

if (process.argv.length < 3) {
  console.error('Invalid Usage.\nUsage: node template.js [input file]');
  process.exit(1);
}

fs.readFile(process.argv[2], 'ascii', (err, data) => {
  if (err) throw err;
  const lines = data.split('\n');
  const template = lines[0];
  const rules = new Map();

  for (let i = 2; i < lines.length - 1; i += 1) {
    const params = lines[i].split(' -> ');
    rules.set(params[0], params[1]);
  }

  part1(template, rules);
  part2(template, rules);
});
