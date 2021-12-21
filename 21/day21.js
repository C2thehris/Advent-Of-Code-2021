let dieState = 1;
let rolls = 0;

function roll() {
  rolls += 1;
  const result = dieState;
  dieState += 1;
  if (dieState > 100) {
    dieState = 1;
  }

  return result;
}

function move(pos) {
  const first = roll();
  const second = roll();
  const third = roll();

  const newPos = (pos - 1 + first + second + third) % 10;

  return newPos + 1;
}

function playDeterministicGame(player1, player2) {
  let player1Pos = player1;
  let player2Pos = player2;
  let player1Score = 0;
  let player2Score = 0;
  let turn = 1;

  while (player1Score < 1000 && player2Score < 1000) {
    if (turn === 1) {
      player1Pos = move(player1Pos);
      player1Score += player1Pos;
      turn = 2;
    } else {
      player2Pos = move(player2Pos);
      player2Score += player2Pos;
      turn = 1;
    }
  }

  return (player1Score > player2Score) ? player2Score : player1Score;
}

function updateState(state, inc, turn) {
  const terms = state.split(',');
  const playerNum = turn - 1;
  const nPos = ((parseInt(terms[playerNum], 10) - 1 + inc) % 10) + 1;
  if (turn === 1) {
    return `${nPos},${terms[1]},${terms[2]},${terms[3]}`;
  }
  return `${terms[0]},${nPos},${terms[2]},${terms[3]}`;
}

function scoreState(state, turn) {
  const terms = state.split(',');
  let player1Score = parseInt(terms[2], 10);
  let player2Score = parseInt(terms[3], 10);

  if (turn === 1) {
    player1Score += parseInt(terms[0], 10);
  } else {
    player2Score += parseInt(terms[1], 10);
  }
  if (player1Score >= 21) {
    return 'player 1 wins';
  }
  if (player2Score >= 21) {
    return 'player 2 wins';
  }

  return `${terms[0]},${terms[1]},${player1Score},${player2Score}`;
}

function playQuantumGame(player1, player2) {
  let currentStates = new Map();
  let turn = 1;
  let player1Wins = 0;
  let player2Wins = 0;
  currentStates.set(`${player1},${player2},0,0`, 1);

  while (currentStates.size) {
    const nextStates = new Map();
    const current = turn;
    currentStates.forEach((value, key) => {
      let next = [];
      for (let i = 1; i <= 3; i += 1) {
        const firstRoll = updateState(key, i, current);
        if (firstRoll.indexOf('wins') !== -1) {
          next = [...next, firstRoll];
        } else {
          for (let j = 1; j <= 3; j += 1) {
            const secondRoll = updateState(firstRoll, j, current);
            if (secondRoll.indexOf('wins') !== -1) {
              next = [...next, secondRoll];
            } else {
              for (let k = 1; k <= 3; k += 1) {
                let endState = updateState(secondRoll, k, current);
                endState = scoreState(endState, current);
                next = [...next, endState];
              }
            }
          }
        }
      }
      next.forEach((state) => {
        if (nextStates.has(state)) {
          nextStates.set(state, value + nextStates.get(state));
        } else {
          nextStates.set(state, value);
        }
      });
    });
    if (turn === 1) {
      turn = 2;
    } else {
      turn = 1;
    }

    if (nextStates.has('player 1 wins')) {
      player1Wins += nextStates.get('player 1 wins');
      nextStates.delete('player 1 wins');
    }

    if (nextStates.has('player 2 wins')) {
      player2Wins += nextStates.get('player 2 wins');
      nextStates.delete('player 2 wins');
    }

    currentStates = nextStates;
  }

  return Math.max(player1Wins, player2Wins);
}

function part1(player1, player2) {
  let ans = playDeterministicGame(player1, player2);
  ans *= rolls;
  console.log(`Part 1: ${ans}`);
}

function part2(player1, player2) {
  const ans = playQuantumGame(player1, player2);

  console.log(`Part 2: ${ans}`);
}

// const player1 = 4;
const player1 = 6;
const player2 = 8;

part1(player1, player2);
part2(player1, player2);
