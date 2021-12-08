function dist1(map, index) {
  var tot = 0
  map.forEach((val, key) => {
    var diff = Math.abs(key - index)
    tot += diff * val;
  })

  return tot
}

function dist2(map, index) {
  var tot = 0
  map.forEach((val, key) => {
    var diff = Math.abs(key - index)
    tot += ((diff * (diff + 1)) / 2) * val;
  })

  return tot
}

function part1(fish) {
  var ans = 0
  var map = new Map()

  var max = Math.max(...fish)

  fish.forEach(element => {
    if (map.has(element)) {
      map.set(element, map.get(element) + 1);
    } else {
      map.set(element, 1);
    }
  })

  var prev = Infinity
  var current = 0
  for (var i = 0; i < max; ++i) {
    current = dist1(map, i)
    if (current > prev) {
      break
    }
    prev = current
  }
  current = prev

  console.log(`Part 1: ${current}`)
}

function part2(fish) {
  var ans = 0
  var map = new Map()

  var max = Math.max(...fish)

  fish.forEach(element => {
    if (map.has(element)) {
      map.set(element, map.get(element) + 1);
    } else {
      map.set(element, 1);
    }
  })

  var prev = Infinity
  var current = 0
  for (var i = 0; i < max; ++i) {
    current = dist2(map, i)
    if (current > prev) {
      break
    }
    prev = current
  }
  current = prev

  console.log(`Part 2: ${current}`)
}

var fs = require('fs')

if (process.argv.length < 3) {
  console.error("Invalid Usage.\nUsage: node template.js [input file]")
  process.exit(1)
}

fs.readFile(process.argv[2], 'ascii', (err, data) => {
  if (err)
    throw err

  data = data.split(',')
  var crabs = []
  data.forEach(element => {
    crabs.push(parseInt(element))
  });

  part1(Object.assign([], crabs))
  part2(Object.assign([], crabs))
});
