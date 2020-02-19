
class SSolver {
    constructor(vector) {
        if (typeof (vector) == 'string') {
            var v = vector.split('\n');
            var vv = [];
            for (var i = 0; i <= 9; i++) {
                var vx = (v[i] || '').split(' ');
                var v1 = [];
                for (var j = 0; j < 9; j++) {
                    var n = Number(vx[j]) || 0;
                    v1.push(n);
                }
                vv.push(v1);
            }
            this.fromVector(vv);
        } else {
            this.fromVector(vector);
        }
        this.currow=0;
        this.curcol=0;
    }
    fromVector(vector) {
        var vv = [];
        for (var i = 0; i < 9; i++) {
            var v1 = [];
            for (var j = 0; j < 9; j++) {
                v1.push(new SCell ( i, j, vector[i][j], vector[i][j] ? true : false ));
            }
            vv.push(v1);
        };
        this.v = vv;
    }
    toVector() {
        var vv = [];
        for (var i = 0; i < 9; i++) {
            var v1 = [];
            for (var j = 0; j < 9; j++) {
                var xx = this.v[i][j];
                v1.push(xx.v);
            }
            vv.push(v1);
        };
        return vv;
    }
    clone() {
        return new SSolver(this.toVector());
    }
    toString() {
        var vv = [];
        for (var i = 0; i < 9; i++) {
            var v1 = [];
            for (var j = 0; j < 9; j++) {
                v1.push(this.v[i][j].v + '');
            }
            vv.push(v1.join(' '));
        }
        return vv.join('\n');
    }
    inrow(v, r, c) {
        var vv = this.v
        for (var i = 0; i < 9; i++) {
            if (i != c && vv[r][i].v == v) return true;
        }
        return false;
    }
    incol(v, r, c) {
        var vv = this.v
        for (var i = 0; i < 9; i++) {
            if (i != r && vv[i][c].v == v) return true;
        }
        return false;
    }
    inquad(v, r, c) {
        var qr = Math.floor(r / 3)
        var qc = Math.floor(c / 3);
        var vv = this.v
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (vv[i + qr * 3][j + qc * 3].v == v) return true;
            }
        }
        return false;
    }
    getcandidates() {
        this.valid = true;
        var vv = this.v;
        
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                vv[i][j].cx = [];
                if (vv[i][j].v == 0) {
                    for (var n = 1; n <= 9; n++) {
                        if (this.inrow(n, i, j) == false && this.incol(n, i, j) == false && this.inquad(n, i, j) == false) {
                            vv[i][j].cx.push(n);
                        }
                    }
                    if (this.v[i][j].cx.length == 0) this.valid = false;
                }
            }
        }
        return this.valid;
    }
    trysolve() {
        if (!this.getcandidates()) {
            this.errdes="missing candidates";
            return false;
        }
        var r2, c2, r3, c3;
        r2 = c2 = r3 = c3 = -1;
        var i = 0, j = 0;
        var fl = 0;
        for (; ;) {
            var xx = this.v[i][j];
            if (xx.v == 0) {
                fl = 1;
                if (xx.cx.length == 1) {
                    xx.v = xx.cx[0];
                    if (!this.getcandidates()) {
                        this.errdes="missing candidates";
                        return false;
                    }
                    i = 0; j = -1;fl=0;
                    r2 = c2 = r3 = c3 = -1;
                } else {
                    if (xx.cx.length == 2 && r2 < 0) {
                        r2 = i; c2 = j;
                    } else if (xx.cx.length > 2 && r3 < 0) {
                        r3 = i; c3 = j;
                    }

                }

            }
            j++;
            if (j >= 9) {
                j = 0;
                i++; if (i >= 9) break;
            }
        }
        if (fl == 0) return true;
        if (r2 < 0) {
            r2 = r3; c2 = c3;
        }
        if (r2 < 0) {
            this.errdes="no candidate"
            return false;
        }
        var xx = this.v[r2][c2];
        var fl=0;
        var xx2;
        for (var i = 0; i < xx.cx.length; i++) {
            xx.v = xx.cx[i];
            var x1 = this.clone();
            if (x1.trysolve()) {
                xx2=x1;
                fl++;
            }
            

        }
        if (fl==1) {
            for (var i=0;i<9;i++) {
                for (var j=0;j<9;j++) {
                    this.v[i][j].v=xx2.v[i][j].v;
                    this.v[i][j].cx=xx2.v[i][j].cx;
                }
            }
           return true;
        } else if (fl>1) {
            xx.v=0
            this.errdes="more than a solution";
            return false;    
        } else {
            xx.v=0
            this.errdes="no solution";
            return false;
        }
    }


    draw() {
        for (var i=0;i<9;i++) {
            for (var j=0;j<9;j++) {
                this.v[i][j].draw(i==this.curcol && j==this.currow);
            }
        }
    }

    mousepress(x,y) {
        for (var i=0;i<9;i++) {
            for (var j=0;j<9;j++) {
                if (this.v[i][j].isin(x,y)) {
                    this.currow=j;
                    this.curcol=i;
                };
            }
        }
    }
    movenext() {
        this.curcol++;
        if (this.curcol>8) {
            this.curcol=0;
            this.currow++;
            if (this.currow>8) this.currow=0;
        }
    }

}


class SCell {
    constructor(i, j, v, init) {
      this.i = i;
      this.j = j;
      this.v = v;
      this.cx=[];
      this.init = init;
    }
    pos() {
      if (this.i >= 0)
        return {
          x: this.i * w + ox + floor(this.i / 3) * 2,
          y: this.j * w + oy + floor(this.j / 3) * 2
        }
      var x = this.v;
      if (x == 0) {
        return { y: oy + w * 2.5, x: ox + w * 10.5 }
      } else {
        x--;
        return {
          y: oy + w * (3.5 + floor(x / 3)), x: ox + w * (9.5 + x % 3)
        }
      }
  
    }
    isin(x, y) {
      var pos = this.pos();
      var w0 = this.i < 0 ? w * .8 : w;
      return (abs(x - pos.x) < w0 / 2 && abs(y - pos.y) < w0 / 2)
    }
    draw(sel) {
      var pos = this.pos();
      var w0 = w;
      rectMode(CENTER);
      strokeWeight(1)
      stroke(0);
     
      if (sel) {
        fill(255, 225, 0)
      } else {
        fill(255)
      }
      rect(pos.x, pos.y, w0, w0);
      stroke(0);
      strokeWeight(1)
      textAlign(CENTER);
      textFont('Helvetica, Arial, Sans-Serif');
        fill(0)
        textSize(w0 * .6);
        if (this.init) {
            text(this.v, pos.x, pos.y + w0 * .2);
        } else {
            var c = this.cx;
            noStroke()
            fill(160, 160, 255);
          
            c.forEach(c2 => {
                textSize(w0 * .25);
                text(c2, pos.x + (((c2 - 1) % 3) - 1) * w0 / 3, pos.y + w0 * .1 + floor((c2 - 1) / 3 - 1) * w0 / 3);
            })
        }
     
    }
  }
  