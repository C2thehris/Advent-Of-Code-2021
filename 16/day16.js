function literalType(bin, version, type) {
  const packet = {
    version, type, size: 6, value: 0
  };

  let binStr = '';
  let i = 0;
  while (parseInt(bin[i], 2) === 1) {
    binStr = `${binStr}${bin.substring(i + 1, i + 5)}`;
    packet.size += 5;
    i += 5;
  }
  packet.value = parseInt(`${binStr}${bin.substring(i + 1, i + 5)}`, 2);
  packet.size += 5;

  return packet;
}

function operatorType(bin, version, type) {
  const packet = {
    version,
    type,
    IType: 0,
    size: 7,
    value: 0,
    subpackets: [],
  };
  let i = 0;
  packet.IType = parseInt(bin[i], 2);
  const lLength = packet.IType === 1 ? 11 : 15;
  packet.size = lLength + 7;
  i += 1;
  const len = parseInt(bin.substring(i, i + lLength), 2);
  i += lLength;

  if (packet.IType === 0) {
    packet.subpackets = getPackets(bin.substring(i, i + len), Infinity);
  } else {
    packet.subpackets = getPackets(bin.substring(i), len);
  }

  let operator;
  switch (packet.type) {
    case 0:
      packet.value = 0;
      operator = (a) => { packet.value += a.value; };
      break;
    case 1:
      packet.value = 1;
      operator = (a) => { packet.value *= a.value; };
      break;
    case 2:
      packet.value = Infinity;
      operator = (a) => { packet.value = Math.min(packet.value, a.value); };
      break;
    case 3:
      packet.value = -1;
      operator = (a) => { packet.value = Math.max(packet.value, a.value); };
      break;
    case 5:
      packet.value = packet.subpackets[0].value > packet.subpackets[1].value;
      operator = packet.value;
      break;
    case 6:
      packet.value = packet.subpackets[0].value < packet.subpackets[1].value;
      operator = packet.value;
      break;
    case 7:
      packet.value = packet.subpackets[0].value === packet.subpackets[1].value;
      operator = packet.value;
      break;
    default:
      console.log('Invalid operation');
      break;
  }

  if (typeof operator !== 'boolean') {
    packet.subpackets.forEach(operator);
  }

  packet.subpackets.forEach((subpacket) => {
    packet.version += subpacket.version;
    packet.size += subpacket.size;
  });

  return packet;
}

function getPackets(bin, packetsCount) {
  let packets = [];

  for (let i = 0; i < bin.length - 10 && packets.length < packetsCount;) {
    const version = parseInt(bin.substring(i, i + 3), 2);
    const type = parseInt(bin.substring(i + 3, i + 6), 2);
    switch (type) {
      case 4:
        packets = [...packets, literalType(bin.substring(i + 6), version, type)];
        break;
      default:
        packets = [...packets, operatorType(bin.substring(i + 6), version, type)];
        break;
    }
    i += packets[packets.length - 1].size;
  }

  return packets;
}

function part1(data) {
  const packets = getPackets(data, Infinity);
  let ans = 0;

  packets.forEach((packet) => {
    ans += packet.version;
  });

  console.log(`Part 1: ${ans}`);
}

function part2(data) {
  const packets = getPackets(data, Infinity);
  const ans = packets[0].value;

  console.log(`Part 2: ${ans}`);
}

const fs = require('fs');

if (process.argv.length < 3) {
  console.error('Invalid Usage.\nUsage: node template.js [input file]');
  process.exit(1);
}

fs.readFile(process.argv[2], 'ascii', (err, data) => {
  if (err) throw err;
  let bin = '';
  const hexChars = data.split('');
  hexChars.pop();

  hexChars.forEach((hex) => {
    let halfByte = parseInt(hex, 16).toString(2);
    while (halfByte.length < 4) {
      halfByte = `0${halfByte}`;
    }

    bin = `${bin}${halfByte}`;
  });

  part1(bin);
  part2(bin);
});
