class Stopwatch {
  constructor(display, results, printResults) {
    this.running = false;
    this.display = display;
    this.results = results;
    this.printResults = printResults;
    this.savedTimes = [];
    this.reset();
    this.dispaly(this.times);
    this.log = "";
  }

  reset() {
    this.times = [0, 0, 0, 0];
  }

  zero() {
    this.running = false;
    this.reset();
    this.dispaly();
  }

  start() {
    if (!this.time) this.time = performance.now();
    if (!this.running) {
      this.running = true;
      requestAnimationFrame(this.step.bind(this));
    } else {
      this.running = false;
      this.time = null;
    }
  }

  restart() {
    if (!this.time) this.time = performance.now();
    if (!this.running) {
      this.running = true;
      requestAnimationFrame(this.step.bind(this));
    }
    this.reset();
  }

  save() {
    let times = this.times;
    let li = document.createElement("li");
    li.innerText = this.format(times);
    if (this.results.firstChild) {
      this.results.insertBefore(li, this.results.firstChild);
    } else {
      this.results.appendChild(li);
    }
  }

  printerDelay(print, memory) {
    let index = memory.childNodes.length;
    let int = setInterval(() => {
      --index;
      if (index < 0) {
        this.createTextFile();
        clearInterval(int);
        return;
      }
      if (print.firstChild) {
        print.insertBefore(memory.childNodes[index], print.firstChild);
      } else {
        print.appendChild(memory.childNodes[index]);
      }
    }, 150);
  }

  print() {
    let memory = this.results;
    let print = this.printResults;
    this.printerDelay(print, memory);
  }

  logUpdate() {
    this.log = "";
    for (let i = this.printResults.childNodes.length - 1; i >= 0; i--) {
      this.log += this.printResults.childNodes[i].innerText + "\r\n";
    }
  }

  clear() {
    clearChildren(this.results);
    this.log = "";
  }

  createTextFile() {
    var textFile = null;
    function makeTextFile(text) {
      var data = new Blob([text], { type: "text/plain" });
      if (textFile !== null) {
        window.URL.revokeObjectURL(textFile);
      }
      textFile = window.URL.createObjectURL(data);
      return textFile;
    }
    this.logUpdate();
    this.printResults.href = makeTextFile(this.log);
  }

  ripOff() {
    clearChildren(this.printResults);
    this.log = "";
  }

  step(timestamp) {
    if (!this.running) return;
    this.calculate(timestamp);
    this.time = timestamp;
    this.dispaly();
    requestAnimationFrame(this.step.bind(this));
  }

  calculate(timestamp) {
    var diff = timestamp - this.time;
    this.times[3] += diff / 10;
    if (this.times[3] >= 100) {
      this.times[2] += 1;
      this.times[3] -= 100;
    }
    if (this.times[2] >= 60) {
      this.times[1] += 1;
      this.times[2] -= 60;
    }
    if (this.times[1] >= 60) {
      this.times[0] += 1;
      this.times[1] -= 60;
    }
  }

  dispaly() {
    this.display.innerText = this.format(this.times);
  }

  format(times) {
    if (this.times[0] >= 1) {
      return `${pad0(times[0], 2)}:${pad0(times[1], 2)}:${pad0(times[2], 2)}`;
    } else {
      return `${pad0(times[1], 2)}:${pad0(times[2], 2)}.${pad0(
        Math.floor(times[3]),
        2
      )}`;
    }
  }
}

function pad0(value, count) {
  var result = value.toString();
  for (; result.length < count; --count) result = "0" + result;
  return result;
}

function clearChildren(node) {
  while (node.lastChild) node.removeChild(node.lastChild);
}

let stopwatch = new Stopwatch(
  document.querySelector(".stopwatch"),
  document.querySelector(".results"),
  document.querySelector(".results-print")
);

var casing = document.querySelector(".casing");

let xAngle = 0,
  yAngle = 0,
  zAngle = 0;

document.addEventListener(
  "keydown",
  function(e) {
    e.preventDefault();
    const key = e.which,
      arrow = { left: 37, up: 38, right: 39, down: 40 },
      x = xAngle / 90,
      y = yAngle / 90;

    switch (key) {
      case arrow.left:
        if (x % 2 == 0) {
          yAngle -= 30;
        } else {
          zAngle += 30;
        }
        break;
      case arrow.up:
        if (y % 2 == 0) {
          xAngle += 30;
        } else {
          zAngle -= 30;
        }
        break;
      case arrow.right:
        if (x % 2 == 0) {
          yAngle += 30;
        } else {
          zAngle -= 30;
        }
        break;
      case arrow.down:
        if (y % 2 == 0) {
          xAngle -= 30;
        } else {
          zAngle += 30;
        }
        break;
    }
    window.requestAnimationFrame(function() {
      const rotate =
        "translateZ(-300px) rotateX(" +
        xAngle +
        "deg) rotateY(" +
        yAngle +
        "deg) rotateZ(" +
        zAngle +
        "deg)";
      casing.style["transform"] = rotate;
      casing.style["-webkit-transform"] = rotate;
      casing.style["-moz-transform"] = rotate;
      casing.style["-ms-transform"] = rotate;
      casing.style["-o-transform"] = rotate;
    });
  },
  false
);
