
class Solver {
  constructor(sudo) {
    this.grid = new Array(9);
    for (var i = 0; i < 9; i++) {
      this.grid[i] = new Array(9);
      for (var j = 0; j < 9; j++) {
        var v0 = sudo.grid[i][j].value;
        this.grid[i][j] = new SolverCell(i, j, sudo.grid[i][j].hidden ? 0 : v0, v0);
      }
    }
    this.us = [];
  }
  dump() {
    var s = "";
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        if (this.grid[j][i].v)
          s = s + this.grid[j][i].v;
        else
          s = s + ' ';
      }
      s += '\n ';
    }
    return s;
  }
  reset() {
    for (var r of this.grid) {
      for (var c of r) {
        var v = c.v0;
        if (v == 0) {
          c.v = c.v0;
          c.calcolavalidi(this);
        }
      }
    }
    this.us = [];
    undosolver = [];
  }
  trysolve(mode) {
    this.reset();
    // crea
    this.replaced = 0;
    var res = this.getnexttry();
    if (res) this.recsolve(res, true);
    if (mode) {
      xxlevel = 0;
      for (var r of this.grid) {
        for (var c of r) {
          if (c.v == 0) {
            xxlevel += 1 + c.can.length
          }
        }
      }
      return this.replaced;
    }



  }
  getnexttry() {
    var ncomb = 9;
    var res = null;
    for (var r of this.grid) {
      for (var c of r) {
        if (c.v == 0) {
          if (c.can.length < ncomb) {
            ncomb = c.can.length;
            if (ncomb == 0) {
              console.log("try error!", c)
            } else if (ncomb == 1) {
              return c;
            }
            res = c;
          }
        }
      }
    }
    return res;
  }
  recsolve(s, istruesol) {
    var n = 0;
    var rq = [];
    var can = s.can;
    //s.can=[];

    for (var i = 0; i < can.length; i++) {
      var u = undosolver.length;
      var fl = s.piazza(this, can[i]);
      if (fl) {
        // posso piazzare il numero quindi continuo!
        var r = this.getnexttry();
        if (r) {
          var ist = (istruesol && can[i] == s.vh);
          var q = this.recsolve(r, ist);
          if (q == 0) fl = false;
        }
      }
      for (var j = undosolver.length - 1; j >= u; j--) {
        var k = undosolver[j];
        this.grid[k.i][k.j] = k;
      }
      s.v = 0;
      undosolver.length = u;
      if (fl) {
        n++;
        rq.push(can[i]);
      }
    }
    if (n > 1 && istruesol) {
      // non soluzione unica
      if (sudoku.grid[s.i][s.j].hidden) {
        this.replaced++;
        sudoku.grid[s.i][s.j].hidden = false;
        sudoku.grid[s.i][s.j].initial = true;
        this.us.push(s)
      }
      s.piazza(this, s.vh);
    } else if (n == 1) {
      s.vc = rq[0];
    }
    return n;

  }
  annullasolver() {
    for (var s of this.us) {
      sudoku.grid[s.i][s.j].hidden = true;
      sudoku.grid[s.i][s.j].initial = false;

    }

  }
}

class SolverCell {
  constructor(i, j, v, vh) {
    this.i = i;
    this.j = j;
    this.v = v;
    this.v0 = v;
    this.vh = vh
    this.can = [];
  }
  copy() {
    var ret = new SolverCell(this.i, this.j, this.v, this.vh);
    this.can.forEach(n => ret.can.push(n));
    return ret;
  }
  valid(solver, n) {
    // per la cella può essere valido il numero n?
    var r = this.i;
    var c = this.j;
    var qr = floor(r / 3);
    var qc = floor(c / 3);
    for (var i = 0; i < 9; i++) {
      if (c != i && solver.grid[r][i].v == n) return false;
      if (r != i && solver.grid[i][c].v == n) return false;
    }
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (i + qr * 3 != r && j + qc * 3 != c && solver.grid[i + qr * 3][j + qc * 3].v == n) return false;
      }
    }

    return true;
  }
  piazza(solver, n) {
    // prova a piazzare e elimina le possibilità
    var r = this.i;
    var c = this.j;
    var qr = floor(r / 3);
    var qc = floor(c / 3);
    this.v = n;
    var res = 1; // moltiplicatore per le soluzioni valide!
    for (var i = 0; i < 9; i++) {
      if (c != i) res *= solver.grid[r][i].removecan(n);
      if (r != i) res *= solver.grid[i][c].removecan(n);
    }
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (i + qr * 3 != r && j + qc * 3 != c) res *= solver.grid[i + qr * 3][j + qc * 3].removecan(n);
      }
    }
    return res != 0; // ritorna se piazzando questo numero la soluzione non è più valida!

  }
  removecan(n) {
    // ritorna il numero di combinazioni rimaste: se 0 la soluzione non è valida.
    // per tutti i piazzati vale 1'
    if (this.v == 0) {
      var l = this.can.length;
      var v = this.can.filter(k => { return k != n });
      if (l != v.length) {
        undosolver.push(this.copy()); // ho bisogno di una copia!
        this.can = v;
      }
      return this.can.length;
    } else {
      return 1;
    }
  }
  calcolavalidi(solver) {
    this.can = [];
    if (this.v0 == 0) {
      for (var i = 1; i < 10; i++)
        if (this.valid(solver, i)) this.can.push(i);
    }
  }

}

