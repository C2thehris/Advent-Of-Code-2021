function part1(inputs, output) {
  var ans = 0

  output.forEach(element => {
    var len = element.length
    switch (len) {
      case 2:
      case 3:
      case 4:
      case 7:
        ++ans;
    }
  })

  console.log(`Part 1: ${ans}`)
}


class Line {
  constructor(inputs, outputs) {
    this.output = outputs.split(' ')
    this.all = outputs.split(' ')
    this.all.push(...inputs.split(' '))
    this.segments = []
    for (var i = 0; i < 7; ++i) {
      this.segments.push('abcdefg')
    }
  }

  hash(char) {
    return char.charCodeAt(0) - "a".charCodeAt(0)
  }

  discardNoOverlap(term, segment) {
    var next = ''
    var current = [...this.segments[segment]]
    current.forEach(elem => {
      if (term.indexOf(elem) != -1) {
        next = next.concat(elem);
      }
    })
    this.segments[segment] = next
  }

  discardOverlap(term, segment) {
    var next = ''
    var current = [...this.segments[segment]]
    current.forEach(elem => {
      if (term.indexOf(elem) == -1) {
        next = next.concat(elem);
      }
    })
    this.segments[segment] = next

  }

  setSegments(term, segments) {
    segments = [...segments];

    segments.forEach(segment => {
      this.discardNoOverlap(term, this.hash(segment))
    })

    const all = [...'abcdefg']
    var remove = []
    all.forEach(segment => {
      if (segments.indexOf(segment) == -1) {
        remove.push(segment)
      }
    })

    remove.forEach(segment => {
      this.discardOverlap(term, this.hash(segment))
    })

  }

  countSegmentTypes(term) {
    var a_count = term.includes(this.a_segments[0]) + term.includes(this.a_segments[1])
    var ones_count = term.includes(this.one_segments[0]) + term.includes(this.one_segments[1])
    if (term.length == 6) {
      if (a_count == 2 && ones_count == 2) {
        return '9'
      } else if (a_count == 2) {
        return '6'
      }
      return '0'
    } else {
      if (a_count == 2 && ones_count != 2) {
        return '5'
      } else if (ones_count == 2) {
        return '3'
      }
      return '2'
    }

  }

  decode() {
    this.all.forEach(term => {
      switch (term.length) {
        case 2:
          this.setSegments(term, 'cf');
          break;
        case 3:
          this.setSegments(term, 'acf');
          break;
        case 4:
          this.setSegments(term, 'bdcf');
          break;
      }
    })

    this.a_segments = this.segments[1].split('')
    this.one_segments = this.segments[2].split('')

    var int = ''
    this.output.forEach(term => {
      var val = '';
      switch (term.length) {
        case 2:
          val = '1'
          break;
        case 3:
          val = '7'
          break;
        case 4:
          val = '4'
          break;
        case 7:
          val = '8'
          break;
        default:
          val = this.countSegmentTypes(term);
          break;
      }
      int = int.concat(val)
    })
    return parseInt(int);
  }

}


function part2(lines) {
  var ans = 0

  lines.forEach(line => {
    ans += line.decode()
  })


  console.log(`Part 2: ${ans}`)
}

var fs = require('fs')

if (process.argv.length < 3) {
  console.error("Invalid Usage.\nUsage: node template.js [input file]")
  process.exit(1)
}

fs.readFile(process.argv[2], 'ascii', (err, data) => {
  if (err)
    throw err

  var data2 = data
  data = data.split("\n")
  var lines = []

  var inputs1 = []
  var outputs1 = []

  data.forEach(element => {
    element = element.split(' ')

    var isInput = false
    element.forEach(e => {
      if (e == '|') {
        isInput = true;
      } else {
        if (!isInput) {
          inputs1.push(e)
        } else {
          outputs1.push(e)
        }
      }
    })
  });

  var lines = []

  data2 = data2.split('\n')
  data2 = data2.slice(0, -1);

  data2.forEach(element => {
    var output = ''
    var input = ''
    element = element.split(' ')
    var delim = element.indexOf("|")
    for (var i = 0; i < delim; ++i) {
      input = input.concat(element[i]).concat(' ')
    }
    input = input.slice(0, -1)

    for (var i = delim + 1; i < element.length; ++i) {
      output = output.concat(element[i]).concat(' ')
    }

    output = output.slice(0, -1)
    lines.push(new Line(input, output))
  })



  part1(Object.assign([], inputs1), Object.assign([], outputs1))
  part2(Object.assign([], lines))
});
