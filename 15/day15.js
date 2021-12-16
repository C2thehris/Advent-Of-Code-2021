class Board {
  constructor(lines) {
    this.board = [];
    this.dists = [];

    lines.forEach((line) => {
      let row = [];
      let distRow = [];
      const risks = line.split('');
      risks.forEach((risk) => {
        row = [...row, parseInt(risk, 10)];
        distRow = [...distRow, -1, -1, -1, -1, -1];
      });
      this.board = [...this.board, row];
      this.dists = [...this.dists, distRow, distRow, distRow, distRow, distRow];
    });
  }

  getDist(point) {
    return this.dists[point[0]][point[1]];
  }

  resetDists() {
    let newDists = [];
    this.dists.forEach((row) => {
      let newRow = [];
      row.forEach(() => {
        newRow = [...newRow, -1];
      });
      newDists = [...newDists, newRow];
    });
    this.dists = newDists;
  }

  setDist(point, dist) {
    this.dists[point[0]][point[1]] = dist;
  }

  getNeighbors(point, expanded) {
    let neighbors = [];
    if (point[0] > 0) {
      neighbors = [...neighbors, [point[0] - 1, point[1]]];
    }
    if (point[1] > 0) {
      neighbors = [...neighbors, [point[0], point[1] - 1]];
    }

    if ((expanded && point[0] < 5 * this.getWidth() - 1) || point[0] < this.getWidth() - 1) {
      neighbors = [...neighbors, [point[0] + 1, point[1]]];
    }
    if ((expanded && point[1] < 5 * this.getHeight() - 1) || point[1] < this.getHeight() - 1) {
      neighbors = [...neighbors, [point[0], point[1] + 1]];
    }
    return neighbors;
  }

  getVal(i, j, expanded) {
    if (!expanded) {
      return this.board[i][j];
    }

    const boardPos = [Math.floor(i % this.getHeight()), Math.floor(j % this.getWidth())];
    const boardsOut = Math.floor(i / this.board.length) + Math.floor(j / this.board[0].length);
    const newVal = this.getVal(boardPos[0], boardPos[1]) + boardsOut;
    if (newVal < 10) {
      return newVal;
    }
    return newVal - 9;
  }

  getWidth() {
    return this.board.length;
  }

  getHeight() {
    return this.board[0].length;
  }
}

require('google-closure-library');

// eslint-disable-next-line no-undef
goog.require('goog.structs.PriorityQueue');

function dijkstra(board, expanded) {
  const pq = new goog.structs.PriorityQueue();
  pq.enqueue(0, [0, 0]);

  while (!pq.isEmpty()) {
    const current = pq.peek();
    const currentDist = pq.peekKey() + board.getVal(current[0], current[1], expanded);
    pq.dequeue();

    board.setDist(current, currentDist);

    const neighbors = board.getNeighbors(current, expanded);
    neighbors.forEach((neighbor) => {
      const dist = board.getDist(neighbor);
      if (dist === -1 || dist > currentDist) {
        board.setDist(neighbor, currentDist);
        pq.enqueue(currentDist, neighbor);
      }
    });
  }

  const ret = board.getDist([0, 0]);
  if (expanded) {
    return board.getDist([5 * board.getHeight() - 1, 5 * board.getWidth() - 1]) - ret;
  }
  return board.getDist([board.getHeight() - 1, board.getWidth() - 1]) - ret;
}

function part1(board) {
  board.resetDists();
  const ans = dijkstra(board, false);
  console.log(`Part 1: ${ans}`);
}

function part2(board) {
  board.resetDists();
  const ans = dijkstra(board, true);
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
  lines.pop();
  const b = new Board(lines);

  part1(b);
  part2(b);
});
