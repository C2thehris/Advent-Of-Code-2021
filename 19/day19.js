let orientations = [];

function Orientation(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
}

class Scanner {
  constructor(num) {
    this.num = num;
    this.absPos = {
      x: Infinity,
      y: Infinity,
      z: Infinity,
    };
    this.beacons = [];
  }

  reorientAll(orientation) {
    this.beacons.forEach((beacon) => {
      this.oldx = beacon.x;
      this.oldy = beacon.y;
      this.oldz = beacon.z;

      beacon.x = this[`old${orientation.x.at(-1)}`] * (orientation.x[0] === '-' ? -1 : 1);
      beacon.y = this[`old${orientation.y.at(-1)}`] * (orientation.y[0] === '-' ? -1 : 1);
      beacon.z = this[`old${orientation.z.at(-1)}`] * (orientation.z[0] === '-' ? -1 : 1);

      this.oldx = undefined;
      this.oldy = undefined;
      this.oldz = undefined;
    });
  }

  addBeacon(relCoords) {
    const coords = relCoords.split(',');
    const beacon = {
      x: parseInt(coords[0], 10),
      y: parseInt(coords[1], 10),
      z: parseInt(coords[2], 10),
    };
    this.beacons = [...this.beacons, beacon];
    this.unique += 1;
  }

  setAbsPos(absPos, diff) {
    this.absPos.x = diff.x + absPos.x;
    this.absPos.y = diff.y + absPos.y;
    this.absPos.z = diff.z + absPos.z;
  }

  get unqiueBeacons() {
    return this.unique;
  }
}

function calculateRotations() {
  orientations = [...orientations, new Orientation('x', 'y', 'z'), new Orientation('-x', 'y', 'z')];
  orientations = [...orientations, new Orientation('x', 'y', '-z'), new Orientation('-x', 'y', '-z')];
  orientations = [...orientations, new Orientation('x', '-y', 'z'), new Orientation('-x', '-y', 'z')];
  orientations = [...orientations, new Orientation('x', '-y', '-z'), new Orientation('-x', '-y', '-z')];
  orientations = [...orientations, new Orientation('x', 'z', 'y'), new Orientation('-x', 'z', 'y')];
  orientations = [...orientations, new Orientation('x', 'z', '-y'), new Orientation('-x', 'z', '-y')];
  orientations = [...orientations, new Orientation('x', '-z', 'y'), new Orientation('-x', '-z', 'y')];
  orientations = [...orientations, new Orientation('x', '-z', '-y'), new Orientation('-x', '-z', '-y')];

  orientations = [...orientations, new Orientation('y', 'x', 'z'), new Orientation('-y', 'x', 'z')];
  orientations = [...orientations, new Orientation('y', 'x', '-z'), new Orientation('-y', 'x', '-z')];
  orientations = [...orientations, new Orientation('y', '-x', 'z'), new Orientation('-y', '-x', 'z')];
  orientations = [...orientations, new Orientation('y', '-x', '-z'), new Orientation('-y', '-x', '-z')];
  orientations = [...orientations, new Orientation('y', 'z', 'x'), new Orientation('-y', 'z', 'x')];
  orientations = [...orientations, new Orientation('y', 'z', '-x'), new Orientation('-y', 'z', '-x')];
  orientations = [...orientations, new Orientation('y', '-z', 'x'), new Orientation('-y', '-z', 'x')];
  orientations = [...orientations, new Orientation('y', '-z', '-x'), new Orientation('-y', '-z', '-x')];

  orientations = [...orientations, new Orientation('z', 'y', 'x'), new Orientation('-z', 'y', 'x')];
  orientations = [...orientations, new Orientation('z', 'y', '-x'), new Orientation('-z', 'y', '-x')];
  orientations = [...orientations, new Orientation('z', '-y', 'x'), new Orientation('-z', '-y', 'x')];
  orientations = [...orientations, new Orientation('z', '-y', '-x'), new Orientation('-z', '-y', '-x')];
  orientations = [...orientations, new Orientation('z', 'x', 'y'), new Orientation('-z', 'x', 'y')];
  orientations = [...orientations, new Orientation('z', 'x', '-y'), new Orientation('-z', 'x', '-y')];
  orientations = [...orientations, new Orientation('z', '-x', 'y'), new Orientation('-z', '-x', 'y')];
  orientations = [...orientations, new Orientation('z', '-x', '-y'), new Orientation('-z', '-x', '-y')];

  return orientations;
}

function orientBeacon(beacon, orientation) {
  const reoriented = {
    x: 0,
    y: 0,
    z: 0,
  };

  reoriented.x = beacon[`${orientation.x.at(-1)}`] * (orientation.x[0] === '-' ? -1 : 1);
  reoriented.y = beacon[`${orientation.y.at(-1)}`] * (orientation.y[0] === '-' ? -1 : 1);
  reoriented.z = beacon[`${orientation.z.at(-1)}`] * (orientation.z[0] === '-' ? -1 : 1);
  return reoriented;
}

function countOverlapping(possiblePos, left, right, orientation) {
  let match = [];

  right.beacons.forEach(() => {
    match = [...match, false];
  });

  for (let i = 0; i < left.beacons.length; i += 1) {
    for (let j = 0; j < right.beacons.length; j += 1) {
      const rightX = right.beacons[j][orientation.x.at(-1)] * (orientation.x[0] === '-' ? -1 : 1);
      const rightY = right.beacons[j][orientation.y.at(-1)] * (orientation.y[0] === '-' ? -1 : 1);
      const rightZ = right.beacons[j][orientation.z.at(-1)] * (orientation.z[0] === '-' ? -1 : 1);
      const diffX = left.beacons[i].x - rightX;
      const diffY = left.beacons[i].y - rightY;
      const diffZ = left.beacons[i].z - rightZ;

      const xMatch = possiblePos.x === diffX;
      const yMatch = possiblePos.y === diffY;
      const zMatch = possiblePos.z === diffZ;

      if (xMatch && yMatch && zMatch) {
        match[j] = true;
        break;
      }
    }
  }

  let count = 0;
  match.forEach((node) => {
    if (node) {
      count += 1;
    }
  });

  return count;
}

function calculateAbsPos(lhs, rhs) {
  if (rhs.absPos.x !== Infinity || lhs.absPos.x === Infinity) return { x: Infinity, y: Infinity, z: Infinity, };

  let max = 0;
  for (let i = 0; i < lhs.beacons.length; i += 1) {
    for (let j = 0; j < rhs.beacons.length; j += 1) {
      for (let k = 0; k < orientations.length; k += 1) {
        const rotation = orientations[k];
        const orientLeft = orientBeacon(rhs.beacons[j], rotation);

        const dx = lhs.beacons[i].x - orientLeft.x;
        const dy = lhs.beacons[i].y - orientLeft.y;
        const dz = lhs.beacons[i].z - orientLeft.z;
        const relPos = {
          x: dx,
          y: dy,
          z: dz,
        };
        const overlap = countOverlapping(relPos, lhs, rhs, rotation);
        max = Math.max(overlap, max);

        if (overlap >= 12) {
          rhs.reorientAll(rotation);
          return relPos;
        }
      }
    }
  }

  return { x: Infinity, y: Infinity, z: Infinity };
}

function part1(scanners) {
  let cont = true;
  while (cont) {
    cont = false;
    for (let i = 0; i < scanners.length; i += 1) {
      for (let j = 0; j < scanners.length; j += 1) {
        if (i !== j) {
          const absj = calculateAbsPos(scanners[i], scanners[j]);
          if (absj.x !== Infinity) {
            scanners[j].setAbsPos(absj, scanners[i].absPos);
            cont = true;
          }
        }
      }
    }
  }

  const beacons = new Map();
  scanners.forEach((scanner) => {
    scanner.beacons.forEach((beacon) => {
      const absX = beacon.x + scanner.absPos.x;
      const absY = beacon.y + scanner.absPos.y;
      const absZ = beacon.z + scanner.absPos.z;

      if (!beacons.has(absX, absY, absZ)) {
        beacons.set(`${absX},${absY},${absZ}`);
      }
    });
  });

  console.log(`Part 1: ${beacons.size}`);
}

function part2(scanners) {
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
  calculateRotations();

  const lines = data.split('\n');
  let scannerNum = 0;
  let scanners = [];

  lines.forEach((line) => {
    if (line.length === 0) {
      return;
    }
    if (line.substring(0, 2) === '--') {
      scanners = [...scanners, new Scanner(scannerNum)];
      scannerNum += 1;
    } else {
      scanners[scanners.length - 1].addBeacon(line);
    }
  });

  scanners[0].absPos.x = 0;
  scanners[0].absPos.y = 0;
  scanners[0].absPos.z = 0;

  part1(scanners);
  part2(scanners);
});
