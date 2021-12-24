function inp(value, ptr) {
  return parseInt(value[ptr], 10);
}

function add(left, right) {
  return left + right;
}

function mul(left, right) {
  return left * right;
}

function div(left, right) {
  return Math.floor(left / right);
}

function mod(left, right) {
  return left % right;
}

function eql(left, right) {
  return left === right ? 1 : 0;
}

function ALU(lines, MONAD) {
  let inputPtr = 0;
  const registers = {
    wReg: 0,
    xReg: 0,
    yReg: 0,
    zReg: 0,
  };

  lines.forEach((instruction) => {
    const terms = instruction.split(' ');
    let rhs;
    const lhs = registers[`${terms[1]}Reg`];

    if (terms.length > 2) {
      rhs = parseInt(terms[2], 10);
      if (Number.isNaN(rhs)) {
        rhs = registers[`${terms[2]}Reg`];
      }
    }

    switch (terms[0]) {
      case 'inp':
        registers[`${terms[1]}Reg`] = inp(MONAD, inputPtr);
        inputPtr += 1;
        break;
      case 'add':
        registers[`${terms[1]}Reg`] = add(lhs, rhs);
        break;
      case 'mul':
        registers[`${terms[1]}Reg`] = mul(lhs, rhs);
        break;
      case 'div':
        registers[`${terms[1]}Reg`] = div(lhs, rhs);
        break;
      case 'mod':
        registers[`${terms[1]}Reg`] = mod(lhs, rhs);
        break;
      case 'eql':
        registers[`${terms[1]}Reg`] = eql(lhs, rhs);
        break;
      default:
        throw `Unknown Operation${terms[0]}`;
    }
  });

  if (Math.abs(registers.zReg) <= 100) {
    console.log(MONAD);
  }
  return registers.zReg === 0;
}

function getRandomInt(upper) {
  return Math.floor(Math.random() * upper);
}

function part1(lines) {
  let ans = false;
  while (!ans) {
    // const input = 'REDACTED';
    const input = 'REDACTED';
    // for (let i = 0; i < 14; i += 1) {
    //   input = input.concat((getRandomInt(9) + 1).toString());
    // }
    ans = ALU(lines, input);
  }

  console.log(`Part 1: ${ans}`);
}

// function part2(lines) {
//   let ans = 0;

//   console.log(`Part 2: ${ans}`);
// }

const fs = require('fs');

if (process.argv.length < 3) {
  console.error('Invalid Usage.\nUsage: node template.js [input file]');
  process.exit(1);
}

fs.readFile(process.argv[2], 'ascii', (err, data) => {
  if (err) throw err;

  const lines = data.split('\n');
  lines.pop();
  // const input = '7';

  part1(lines);
  // part2(lines);
});
