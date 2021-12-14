class Board {
  constructor(rows, cols) {
    this.board = [];
    this.rows = rows + 1;
    this.cols = cols + 1;

    for (let i = 0; i < this.rows; i += 1) {
      this.board = [...this.board, []];
      for (let j = 0; j < this.cols; j += 1) {
        this.board[i] = [...this.board[i], '.'];
      }
    }
  }

  addPoint(line) {
    const [r, c] = line.split(',');
    const row = parseInt(r, 10);
    const col = parseInt(c, 10);

    this.board[row][col] = '#';
  }

  countPoints() {
    let ans = 0;
    for (let r = 0; r < this.rows; r += 1) {
      for (let c = 0; c < this.cols; c += 1) {
        ans += this.board[r][c] === '#';
      }
    }
    return ans;
  }

  foldAlongY(coord) {
    for (let r = 0; r < this.rows; r += 1) {
      for (let c = coord + 1; c < this.cols; c += 1) {
        if (this.board[r][c] === '#') {
          this.board[r][coord - (c - coord)] = '#';
        }
      }
    }

    this.cols = coord;
  }

  foldAlongX(coord) {
    for (let r = coord + 1; r < this.rows; r += 1) {
      for (let c = 0; c < this.cols; c += 1) {
        if (this.board[r][c] === '#') {
          this.board[coord - (r - coord)][c] = '#';
        }
      }
    }
    this.rows = coord;
  }

  fold(line) {
    const coord = line.split('=');
    if (coord[0].charAt(coord[0].length - 1) === 'x') {
      this.foldAlongX(parseInt(coord[1], 10));
    } else {
      this.foldAlongY(parseInt(coord[1], 10));
    }
  }

  print() {
    const rows = [];
    for (let i = 0; i < 6; i += 1) {
      rows.push(['................................']);
    }

    for (let k = 0; k < 8; k += 1) {
      const offset = 5 * k;
      for (let r = 0; r < 5; r += 1) {
        for (let c = 0; c < this.cols; c += 1) {
          rows[c][r + offset] = this.board[r + offset][c];
        }
      }
    }
    for (let i = 0; i < 6; i += 1) {
      console.log(rows[i].join(''));
    }
    console.log('\n');
  }
}

function part1(folds, board) {
  board.fold(folds[0]);

  const ans = board.countPoints();

  console.log(`Part 1: ${ans}`);
}

function part2(folds, board) {
  let first = true;
  folds.forEach((fold) => {
    if (!first) {
      board.fold(fold);
    }
    first = false;
  });

  const ans = board.countPoints();

  board.print();
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

  let points = true;
  let maxRow = 0;
  let maxCol = 0;
  lines.forEach((line) => {
    if (line === '' || line[0] === 'f') {
      return;
    }
    const [r, c] = line.split(',');
    maxRow = Math.max(parseInt(r, 10), maxRow);
    maxCol = Math.max(parseInt(c, 10), maxCol);
  });

  const board = new Board(maxRow, maxCol);
  const folds = [];

  lines.forEach((line) => {
    if (line === '') {
      points = false;
    } else if (points) {
      board.addPoint(line);
    } else {
      folds.push(line);
    }
  });

  part1(folds, board);
  part2(folds, board);
});
