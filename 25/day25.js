function checkDiff(current, prev) {
  for (let i = 0; i < current.length; i += 1) {
    for (let j = 0; j < current[i].length; j += 1) {
      if (current[i][j] !== prev[i][j]) {
        return true;
      }
    }
  }
  return false;
}

function makeBoard(oldBoard) {
  const newBoard = [];
  oldBoard.forEach((row) => {
    newBoard.push([]);
    row.forEach((index) => {
      newBoard[newBoard.length - 1].push(index);
    });
  });
  return newBoard;
}

function moveEast(next, current, row, col) {
  let nextCol = col + 1;
  if (nextCol >= current[row].length) {
    nextCol = 0;
  }
  if (current[row][nextCol] === '.') {
    next[row][col] = '.';
    next[row][nextCol] = '>';
  }
}

function moveSouth(next, current, row, col) {
  let nextRow = row + 1;
  if (nextRow >= current.length) {
    nextRow = 0;
  }
  if (current[nextRow][col] === '.') {
    next[row][col] = '.';
    next[nextRow][col] = 'v';
  }
}

function step(old) {
  const afterEast = makeBoard(old);

  for (let i = 0; i < old.length; i += 1) {
    for (let j = 0; j < old[i].length; j += 1) {
      if (old[i][j] === '>') {
        moveEast(afterEast, old, i, j);
      }
    }
  }

  const afterSouth = makeBoard(afterEast);
  for (let i = 0; i < old.length; i += 1) {
    for (let j = 0; j < old[i].length; j += 1) {
      if (afterEast[i][j] === 'v') {
        moveSouth(afterSouth, afterEast, i, j);
      }
    }
  }

  return afterSouth;
}

function part1(board) {
  let ans = 0;
  let prev;
  let current = board;
  do {
    ans += 1;
    prev = current;
    current = step(current);
  } while (checkDiff(current, prev));

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
  const board = [];

  lines.forEach((line) => {
    board.push([]);
    line.split('').forEach((char) => {
      board[board.length - 1].push(char);
    });
  });

  part1(board);
  // part2(board);
});
