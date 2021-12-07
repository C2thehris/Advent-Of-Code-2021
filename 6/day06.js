function part1(fish) {
  ans = 0
  for (var i = 0; i < 80; ++i) {
    var born = 0
    fish.forEach((element, index) => {
      if (element > 0)
        --fish[index];
      else if (element == 0) {
        fish[index] = 6
        fish.push(8)
      }
    })
  }

  console.log(`Part 1: ${fish.length}`)
}

function part2(fish) {
  const map = new Map()
  var ans = 0

  for (var i = 0; i < 9; ++i) {
    map.set(i, 0);
  }

  fish.forEach(element => {
    map.set(element, map.get(element) + 1)
  })

  for (var i = 0; i < 256; ++i) {
    var temp = 0;
    var current = map.get(8);
    for (var j = 8; j >= 1; --j) {
      temp = map.get(j - 1);
      map.set(j - 1, current);
      current = temp
    }
    map.set(8, temp);
    map.set(6, map.get(6) + temp);
  }

  map.forEach(value => {
    ans += value
  })

  console.log(`Part 2: ${ans}`)
}

var fs = require('fs')

if (process.argv.length < 3) {
  console.error("Invalid Usage.\nUsage: node day06.js [input file]")
  process.exit(1)
}

fs.readFile(process.argv[2], 'ascii', (err, data) => {
  if (err)
    throw err

  const vals = data.split(',')
  const fish = [];
  vals.forEach(element => {
    fish.push(parseInt(element))
  });

  part1(Object.assign([], fish))
  part2(Object.assign([], fish))
});