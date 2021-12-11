function part1(lines) {
  let ans = 0;

  console.log(`Part 1: ${ans}`);
}

function part2(lines) {
  let ans = 0;

  console.log(`Part 2: ${ans}`);
}

const fs = require('fs');

if (process.argv.length < 3) {
  console.error('Invalid Usage.\nUsage: node template.js [input file]');
  process.exit(1);
}

fs.readFile(process.argv[2], 'ascii', (err, data) => {
  if (err) throw err;
  part1([...data]);
  part2([...data]);
});
