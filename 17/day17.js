function changeState(pos, vel) {
  const newPos = {
    x: pos.x + vel.x,
    y: pos.y + vel.y,
  };

  const newVel = {
    x: vel.x,
    y: vel.y - 1,
  };

  if (vel.x < 0) {
    newVel.x += 1;
  } else if (vel.x > 0) {
    newVel.x -= 1;
  }

  return [newPos, newVel];
}

function inRange(currentPos, targetX, targetY) {
  const inX = targetX.min <= currentPos.x && currentPos.x <= targetX.max;
  const inY = targetY.min <= currentPos.y && currentPos.y <= targetY.max;

  return inX && inY;
}

function upperBoundsNotReached(pos, vel, targetX, targetY) {
  const maxY = vel.y > 0 ? pos.y + (vel.y * (vel.y + 1)) / 2 : pos.y;
  const maxX = vel.x > 0 ? pos.x + (vel.x * (vel.x + 1)) / 2 : pos.x - (vel.x * (vel.x + 1));

  if (maxY < targetY.min || maxX < targetX.min) {
    return false;
  }

  return true;
}

function part12(targetX, targetY) {
  const startingVel = {
    x: 0,
    y: 0,
  };
  const startingPos = {
    x: 0,
    y: 0,
  };

  let currentPos = startingPos;
  let currentVel = startingVel;
  let maxY = 0;
  let xStep = 1;
  let count = 0;

  if (targetX.min < 0) {
    xStep = -1;
  }

  for (; Math.abs(startingVel.x) <= targetX.largestMagnitude; startingVel.x += xStep) {
    for (startingVel.y = targetY.largest; startingVel.y >= -1 * targetY.largest; startingVel.y -= 1) {
      let top = 0;
      let found = false;
      while (upperBoundsNotReached(currentPos, currentVel, targetX, targetY)) {
        [currentPos, currentVel] = changeState(currentPos, currentVel);
        top = Math.max(top, currentPos.y);

        if (inRange(currentPos, targetX, targetY)) {
          found = true;
          count += 1;
          break;
        }
      }
      if (found) {
        maxY = Math.max(top, maxY);
      }
      currentPos = startingPos;
      currentVel = startingVel;
    }
  }

  console.log(`Part 1: ${maxY}`);
  console.log(`Part 2: ${count}`);
}

// const targetX = {
//   min: 20,
//   max: 30,
//   largestMagnitude: 30,
// };

// const targetY = {
//   min: -10,
//   max: -5,
//   largestMagnitude: 10,
// };

const targetX = {
  min: 48,
  max: 70,
  largest: 70,
};

const targetY = {
  min: -189,
  max: -148,
  largest: 189,
};

part12(targetX, targetY);
