// TODO: Memoize + Add Cost of pushing to dfs

const memos = new Map();

class Room {
  constructor(name, ...occupants) {
    this.name = name;
    this.occupants = [...occupants];
  }

  full() {
    if (this.occupants[0] !== '.') {
      return true;
    }
    return false;
  }

  popOccupant() {
    let pos = 0;
    while (this.occupants[pos] === '.') {
      pos += 1;
    }

    const letter = this.occupants[pos];
    this.occupants[pos] = '.';

    return [letter, pos + 1];
  }

  pushOccupant(letter) {
    let i = 0;
    for (; i < this.occupants.length; i += 1) {
      if (this.occupants[i] !== '.') {
        break;
      }
    }
    i -= 1;

    this.occupants[i] = letter;
    return i;
  }

  allValidOccupants() {
    for (let i = 0; i < this.occupants.length; i += 1) {
      if (this.occupants[i] !== this.name) {
        return false;
      }
    }
    return true;
  }

  noInvalidOccupants() {
    for (let i = 0; i < this.occupants.length; i += 1) {
      if (this.occupants[i] !== '.' && this.occupants[i] !== this.name) {
        return false;
      }
    }
    return true;
  }

  hasOccupant() {
    for (let i = 0; i < this.occupants.length; i += 1) {
      if (this.occupants[i] !== '.') return true;
    }
    return false;
  }

  print() {
    let state = '';
    this.occupants.forEach((occupant) => {
      state = `${state}${occupant}`;
    });
    return state;
  }
}

// Pen + Paper
// function part1(lines) {
//   let ans = 0;

//   console.log(`Part 1: ${ans}`);
// }

function multiplier(amphipod) {
  switch (amphipod) {
    case 'A':
      return 1;
    case 'B':
      return 10;
    case 'C':
      return 100;
    case 'D':
      return 1000;
    default:
      throw 'Unknown Amphipod';
  }
}

function hallwayPosition(roomName) {
  switch (roomName) {
    case 'A':
      return 2;
    case 'B':
      return 4;
    case 'C':
      return 6;
    case 'D':
      return 8;
    default:
      throw 'Unkown Room';
  }
}

function getRoomNumber(letter) {
  switch (letter) {
    case 'A':
      return 0;
    case 'B':
      return 1;
    case 'C':
      return 2;
    case 'D':
      return 3;
    default:
      throw 'Unkown amphipod';
  }
}

function seekLeftPath(hallway, pos, endPos) {
  for (let i = pos - 1; i > endPos; i -= 1) {
    if (hallway[i] !== '.') {
      return false;
    }
  }
  return true;
}

function seekRightPath(hallway, pos, endPos) {
  for (let i = pos + 1; i < endPos; i += 1) {
    if (hallway[i] !== '.') {
      return false;
    }
  }
  return true;
}

function clearHallway(rooms, hallway) {
  let cost = 0;
  let current = hallway.substring(0);
  const putInRooms = [];

  for (let k = 0; k < 5; k += 1) {
    let next = '';
    for (let i = 0; i < 11; i += 1) {
      const letter = current[i];
      if (letter === '.') {
        next = `${next}${current[i]}`;
        continue;
      }
      const roomReady = rooms[getRoomNumber(letter)].noInvalidOccupants();
      if (!roomReady) {
        next = `${next}${current[i]}`;
        continue;
      }

      const hallwayPos = hallwayPosition(letter);
      let found = false;
      if (i > hallwayPos) {
        found = seekLeftPath(current, i, hallwayPos);
      } else {
        found = seekRightPath(current, i, hallwayPos);
      }
      if (found) {
        putInRooms.push(hallway[i]);
        next = `${next}.`;
        cost += Math.abs(hallwayPos - i) * multiplier(letter);
      } else {
        next = `${next}${current[i]}`;
      }
    }
    current = next;
  }

  return [current, cost, putInRooms];
}

function putInCorrectRoom(rooms, amphipods) {
  for (let i = 0; i < amphipods.length; i += 1) {
    if (rooms[getRoomNumber(amphipods[i])].full()) {
      return false;
    }
  }
  amphipods.forEach((amphipod) => {
    rooms[getRoomNumber(amphipod)].pushOccupant(amphipod);
  });
  return true;
}

function removeFromCorrectRoom(rooms, amphipods) {
  amphipods.forEach((amphipod) => {
    rooms[getRoomNumber(amphipod)].popOccupant(amphipod);
  });
}

function allOrdered(rooms) {
  for (let i = 0; i < rooms.length; i += 1) {
    if (!rooms[i].allValidOccupants()) {
      return false;
    }
  }
  return true;
}

function computeState(rooms, hallway, choice) {
  let state = `${hallway}`;
  rooms.forEach((room) => {
    state = `${state},${room.print()}`;
  });
  state = `${state},${rooms[choice].name}`;
  return state;
}

function dfs(rooms, hallway, choice) {
  const hallwayPos = hallwayPosition(rooms[choice].name);
  const leftHallwayPos = hallwayPos - 1;
  const rightHallwayPos = hallwayPos + 1;
  let best = Infinity;
  const state = computeState(rooms, hallway, choice);
  if (memos.has(state)) {
    return memos.get(state);
  }

  const [letter, cost] = rooms[choice].popOccupant();
  let currentHallway = hallway.substring(0);

  if (hallway[leftHallwayPos] === '.') {
    let i = leftHallwayPos;
    for (; i >= 0 && hallway[i] === '.';) {
      let posCost = multiplier(letter) * ((leftHallwayPos - i + 1) + cost);
      currentHallway = `${currentHallway.substring(0, i)}${letter}${currentHallway.substring(i + 1)}`;
      const [nextHallway, hallwayCost, putInRooms] = clearHallway(rooms, currentHallway);
      const space = putInCorrectRoom(rooms, putInRooms);
      if (space) {
        posCost += hallwayCost;
        let bestNext = Infinity;
        for (let j = 0; j < rooms.length; j += 1) {
          if (!rooms[j].noInvalidOccupants() && rooms[j].hasOccupant()) {
            bestNext = Math.min(dfs(rooms, nextHallway, j), bestNext);
          }
        }
        removeFromCorrectRoom(rooms, putInRooms);
        best = Math.min(best, posCost + bestNext);
      }
      currentHallway = hallway.substring(0);
      i -= 2;
      if (i === -1) {
        i = 0;
      }
    }
  }
  if (hallway[rightHallwayPos] === '.') {
    let i = rightHallwayPos;
    for (; i < hallway.length && hallway[i] === '.';) {
      let posCost = multiplier(letter) * ((i - rightHallwayPos + 1) + cost);
      currentHallway = `${currentHallway.substring(0, i)}${letter}${currentHallway.substring(i + 1)}`;

      const [nextHallway, hallwayCost, putInRooms] = clearHallway(rooms, currentHallway);
      const space = putInCorrectRoom(rooms, putInRooms);
      if (space) {
        posCost += hallwayCost;
        let bestNext = allOrdered(rooms) ? 0 : Infinity;
        if (bestNext !== 0) {
          for (let j = 0; j < rooms.length; j += 1) {
            if (!rooms[j].noInvalidOccupants() && rooms[j].hasOccupant()) {
              bestNext = Math.min(dfs(rooms, nextHallway, j), bestNext);
            }
          }
        }
        removeFromCorrectRoom(rooms, putInRooms);
        best = Math.min(best, posCost + bestNext);
      }
      currentHallway = hallway.substring(0);
      i += 2;
      if (i === hallway.length) {
        i -= 1;
      }
    }
  }
  rooms[choice].pushOccupant(letter);

  memos.set(state, best);
  return best;
}

function pushCost(rooms) {
  let totCost = 0;
  for (let i = 0; i < rooms.length; i += 1) {
    totCost += ((rooms[i].occupants.length * (rooms[i].occupants.length + 1)) / 2) * multiplier(rooms[i].name);
  }
  return totCost;
}

function part2(rooms) {
  const hallway = '...........';
  let ans = Math.min(dfs(rooms, hallway, 0));
  ans = Math.min(ans, dfs(rooms, hallway, 1));
  ans = Math.min(ans, dfs(rooms, hallway, 2), dfs(rooms, hallway, 3));

  ans += pushCost(rooms);
  console.log(`Part 2: ${ans}`);
}

// const roomA = new Room('A', 'D', 'D');
// const roomB = new Room('B', 'A', 'A');
// const roomC = new Room('C', 'C', 'B');
// const roomD = new Room('D', 'C', 'B');

const roomA = new Room('A', 'D', 'D', 'D', 'D');
const roomB = new Room('B', 'A', 'C', 'B', 'A');
const roomC = new Room('C', 'C', 'B', 'A', 'B');
const roomD = new Room('D', 'C', 'A', 'C', 'B');

const rooms = [roomA, roomB, roomC, roomD];
part2(rooms);
