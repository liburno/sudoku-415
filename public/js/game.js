class Sudoku {
  constructor() {
    this.time = 0;
    this.id = 0;
    this.errors = 0;
    nine = new Array(9);
    for (var i = 0; i < 9; i++) nine[i] = i + 1;
    this.grid = new Array(9);
    for (var i = 0; i < 9; i++) {
      this.grid[i] = new Array(9);
      for (var j = 0; j < 9; j++)
        this.grid[i][j] = new Cell(i, j, 0);
    }
    this.finished = false;
    this.helps = new Array(10);
    for (var i = 0; i < 10; i++) {
      this.helps[i] = new Cell(-1, 0, i);
      this.helps.visible = false;
    }
  }
  soundclick() {
    if (issound) {
      clicksound.amp(0.3);
      clicksound.rate(2.5);
      clicksound.play()
    }
  }
  reset() {
    this.id = this.time = this.errors = 0;
    this.finished = false;
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        this.grid[i][j].value = 0;
      }
    }
    // riempie i quadrati diagonali! 
    for (var q = 0; q < 3; q++) {
      nine = shuffle(nine)
      var k = 0;
      for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++) {
          this.grid[q * 3 + i][q * 3 + j].value = nine[k++];
        }
      }
    }
    nine = shuffle(nine);
    numbersel = 0;
    this.resetnext()
    this.solve(true);

    this.removeelements(floor(random(40, 57)));
    solver = new Solver(sudoku);
    solver.trysolve(true);
    this.bilancia();
    solver = new Solver(sudoku);
    solver.trysolve();


    for (var r of this.grid) {
      for (var c of r) {
        c.initial = !c.hidden;
      }
    }
    this.checkfinish(true);
    this.toLocalStorage();
    dstart = new Date();


  }
  hiddens() {
    var k = 0;
    for (var r of this.grid) {
      for (var c of r) {
        if (c.hidden) k++;
      }
    }
    return k;
  }
  bilancia() {
    // bilancia!!!
    var rr = new Array(10);
    for (var i = 0; i < rr.length; i++) {
      rr[i] = [];
    }
    for (var r of this.grid) {
      for (var c of r) {
        if (!c.hidden) {
          rr[c.value].push(c);
        }
      }
    }
    var i = 0;
    var tt = random(10, 15);
    for (; ;) {
      rr = rr.sort((a, b) => { return b.length - a.length });
      var r = rr[0];
      if (r.length > 0) {
        var ii = floor(random(0, r.length))
        var c = r[ii];
        c.hidden = true;
        solver = new Solver(this);
        var n = solver.trysolve(true);
        r.splice(ii, 1);

        if (n == 0 && solver.replaced < 2) {
          i++;
          if (i > tt) break;
        } else {
          solver.annullasolver();
          c.hidden = false;
        }
      } else {
        break;
      }
    }


  }
  toLocalStorage() {
    var rx = getstorage("sudoku_v");
    if (!rx) rx = [];
    var id = 0;
    if (rx.length > 0) id = rx[0].id;
    id++
    if (!this.id) this.id = id;
    var rr = [];
    var tot1 = 81;
    var tot2 = xxlevel;
    for (var r of this.grid) {
      for (var c of r) {
        rr.push({ i: c.i, j: c.j, v: c.value, ini: c.initial });
        if (c.initial) tot1 -= 1;
      }
    }
    var fl = false;
    for (var r of rx) {
      if (r.id == this.id && this.time) {
        if (!r.time) {
          r.time = this.time;
          r.errors = this.errors;
        } else {
          if (this.errors < r.errors || (
            this.errors == r.errors && this.time < r.time
          )) {
            r.errors = this.errors;
            r.time = this.time;
          }
        }
        if (!r.time) r.time = this.time;
        fl = true; break;
      }
    }
    if (!fl) {
      rx.unshift({ id: this.id, data: rr, comment: '', level: tot2 + '/' + tot1, time: this.time, errors: this.errors })
      if (rx.length > 50) rx.pop();
    }
    setstorage("sudoku_v", rx);
    setstorage("sudoku", null);
  }
  fromLocalStorage(id) {
    var rx = getstorage("sudoku_v");
    if (!rx || rx.length < 1) return false
    var rr;
    if (!id) {
      rr = rx[0].data;
      xxlevel = parseInt(rx[0].level.split('/')[0]);
      this.id = rx[0].id
    } else {
      for (var r of rx) {
        if (r.id == id) {
          this.id = id;
          xxlevel = parseInt(r.level.split('/')[0]);
          rr = r.data;
          break;
        }
      }
    }
    if (rr) {
      var k = 0;
      for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
          this.grid[i][j].i = rr[k].i;
          this.grid[i][j].j = rr[k].j;
          this.grid[i][j].value = rr[k].v;
          this.grid[i][j].hidden = !rr[k].ini;
          this.grid[i][j].initial = rr[k].ini
          k++;
        }
      }
      this.finished = false;
      this.errors = 0;
      solver = new Solver(sudoku);
      solver.trysolve();
      this.checkfinish();
      dstart = new Date();
      return true;
    }
  }

  removeelements(n) {
    var remover = [];
    var k = 0;
    for (var r of this.grid) {
      for (var c of r) {
        if (!c.hidden) remover.push(k);
        k++;
      }
    }
    remover = shuffle(remover);
    for (var i = 0; i < n; i++) {
      var rc = remover[i];
      var r = floor(rc / 9);
      var c = rc % 9;
      this.grid[r][c].hidden = true;
      this.grid[r][c].initial = false;
    }
  }
  checkfinish() {
    if (this.finished) return true;
    this.finished = false;
    for (var i = 1; i < 10; i++) {
      this.helps[i].hidden = true;
    }
    var n = 0;
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        if (this.grid[i][j].hidden) {

          this.helps[this.grid[i][j].value].hidden = false;
          n++;
        };
      }
    }
    if (n == 0) {
      numbersel = 0;
      this.time = (dend - dstart) / 1000
      this.toLocalStorage();
      this.finished = true;
    }
    return this.finished;
  }

  solve(setinitial) {
    for (var r of this.grid) {
      for (var c of r) {
        c.hidden = false;
        if (setinitial) c.initial = true;
      }
    }
    if (!setinitial) this.checkfinish();
  }
  mousepress(x, y) {
    if (sudoku.finished) return;
    for (var r of this.grid) {
      for (var c of r) {
        if (c.isin(x, y)) {
          c.selected = true;
          if (c.hidden == false) {
            this.soundclick();
            numbersel = c.value;
          } else {
            if (numbersel > 0) {
              if (c.value == numbersel) {
                c.hidden = false;
                solver = new Solver(sudoku);
                solver.trysolve();
                this.checkfinish();
                //solver.grid[c.i][c.j].piazza(solver,numbersel)
                if (this.finished) {
                  setstorage("sudoku"); // reset local storage
                  c.selected = false;
                  if (issound) applause.play();

                } else {
                  this.soundclick();
                  //    this.toLocalStorage();
                }
              } else {
                if (issound) tosse.play();
                this.errors++;
              }
            }
          }
        } else {
          c.selected = false;
        }
      }
    }
    for (var i = 0; i < 10; i++) {
      if (this.helps[i].isin(x, y)) {
        numbersel = this.helps[i].value;
        this.helps[i].selected = true;
        this.soundclick();

      } else {
        this.helps[i].selected = false;
      }
    }
  }
  resetnext() {
    var rc = this.findunassign();
    if (rc == null) return true;
    for (var i = 0; i < 9; i++) {
      var x = nine[i];
      if (!this.isin(x, rc.r, rc.c)) {
        this.grid[rc.r][rc.c].value = x;
        if (this.resetnext()) return true;
        this.grid[rc.r][rc.c].value = 0;
      }
    }
    return false;
  }

  findunassign() {
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        if (this.grid[i][j].value == 0) return { r: i, c: j }
      }
    }
    return null;
  }

  inrow(n, r) {
    for (var i = 0; i < 9; i++) {
      if (this.grid[r][i].value == n) return true;
    }
    return false;
  }
  incol(n, c) {
    for (var i = 0; i < 9; i++) {
      if (this.grid[i][c].value == n) return true;
    }
    return false;
  }
  inquad(n, qr, qc) {
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (this.grid[i + qr * 3][j + qc * 3].value == n) return true;
      }
    }
    return false;
  }

  isin(n, r, c) {
    var qr = floor(r / 3)
    var qc = floor(c / 3);
    return this.inrow(n, r) || this.incol(n, c) || this.inquad(n, qr, qc);
  }
  draw() {
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        this.grid[i][j].draw();
      }
    }
    if (!this.finished)
      for (var i = 0; i < 10; i++) {
        this.helps[i].draw();
      }

    stroke(0);
    strokeWeight(1)
    fill(255, 0, 0)
    textAlign(CENTER);
    text('Helvetica');
    textSize(w * .3);
    var tm = "L:" + xxlevel;
    var tm1 = sudoku.hiddens();
    if (tm1) tm = tm + " H:" + tm1;
    text(tm, ox + w * 10.5, oy + w * 2);
    if (!dend || !this.finished) {
      dend = new Date();
    }
    text(elapsed(dstart, dend), ox + w * 10.5, oy + w * 6.5);

    if (this.errors)
      text("Errors:" + this.errors, ox + w * 10.5, oy + w * 7);

  }
}


class Cell {
  constructor(i, j, value) {
    this.i = i;
    this.j = j;
    this.value = value;
    this.hidden = false;
    this.initial = false;
    this.selected = false;
  }
  pos() {
    if (this.i >= 0)
      return {
        x: this.i * w + ox + floor(this.i / 3) * 2,
        y: this.j * w + oy + floor(this.j / 3) * 2
      }
    var x = this.value;
    if (x == 0) {
      return { y: oy + w * 2.5, x: ox + w * 10.5 }
    } else {
      x--;
      return {
        y: oy + w * (3.5 + floor(x / 3)), x: ox + w * (9.5 + x % 3)
      }
    }

  }
  isin(x, y, nohidden) {
    if (nohidden && this.hidden) return false;
    var pos = this.pos();
    var w0 = this.i < 0 ? w * .8 : w;
    return (abs(x - pos.x) < w0 / 2 && abs(y - pos.y) < w0 / 2)
  }
  draw() {
    var pos = this.pos();
    if (this.i < 0 && this.hidden) return;
    var w0 = this.i < 0 ? w * .8 : w;
    rectMode(CENTER);
    if (numbersel == this.value && !this.hidden) fill(255, 225, 0); else fill(255)
    if (this.selected) {
      stroke(255, 0, 0);
      strokeWeight(3)
      rect(pos.x, pos.y, w0 - 4, w0 - 4);
    } else {
      stroke(0);
      strokeWeight(1)
      rect(pos.x, pos.y, w0, w0);
    }
    stroke(0);
    strokeWeight(1)
    textAlign(CENTER);
    textFont('Sans');

    if (this.value && !this.hidden) {
      fill(this.initial ? 180 : 0)
      textSize(w0 * .6);
      text(this.value, pos.x, pos.y + w0 * .2);
    } else if (this.hidden && ishelped) {
      var c = solver.grid[this.i][this.j].can;
      c.forEach(c2 => {
        noStroke()
        fill(160, 160, 255);
        textSize(w0 * .25);
        text(c2, pos.x + (((c2 - 1) % 3) - 1) * w0 / 3, pos.y + w0 * .1 + floor((c2 - 1) / 3 - 1) * w0 / 3);
      })


    }
  }
}
