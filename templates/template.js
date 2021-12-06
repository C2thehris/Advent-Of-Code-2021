function part1(lines) {
  ans = 0

  console.log(ans)
}

function part2(lines) {
  ans = 0

  console.log(ans)
}

var fs = require('fs')

if (process.argv.length < 3) {
  console.error("Invalid Usage.\nUsage: node template.js [input file]")
  process.exit(1)
}

fs.readFile(process.argv[2], 'ascii', (err, data) => {
  if (err)
    throw err
  part1(data)
  part2(data)
});