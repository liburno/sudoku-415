var BUTTW = 150; BUTTH = BUTTW / 4; BUTTC = { r: 128, g: 128, b: 128 }, BUTTTEXTSIZE = BUTTH / 2;
var buttonround = 0;

class UI {
    constructor() {
        this.obj = []
    }
    draw() {

        this.obj.forEach(e => 
            
            e.draw()
        );
    }
    push(o) {
        if (Array.isArray(o)) {
            for (var a of o) {
                this.obj.push(a);
            }
        } else {
            this.obj.push(o);
        }
    }
    mousemove(x, y) {
    
        this.obj.forEach(e => {
            if (e && e.isin)
            e.hover = (e.enabled && 
                       e.callback && 
                       !e.pressed && 
                       e.isin(x, y));
        })
    }
    recalcbuttsize(CW) {
        var w, h, ts
        if (CW < 800) {
            w = CW * 150 / 800;
        } else {
            w = 150;
        }
        h = floor(w / 4);
        ts = floor(h / 2);
        if (w != BUTTW && w > 0 && BUTTW > 0) {
            var w1 = w / BUTTW;
            for (var o of this.obj) {
                o.wx *= w1;
                if (o.wy) o.wy *= w1;
                if (o.textsize && o.textsize == BUTTTEXTSIZE) o.textsize = ts;
            }
            BUTTW = w; BUTTH = h; BUTTTEXTSIZE = ts;
        }
    }
    keypress(k) {
        this.obj.forEach(e => {
            if (e.enabled && e.callback && e.key == k) {
                e.callback(e);
            }
        })
    }
    mousepress(x, y) {
        var fl = false;
        for (var e of this.obj) {
            if (e.enabled && e.callback && e.isin(x, y)) {
                fl = true;
                e.callback(e);
            } else {
                e.pressed = false;
            }
        }
        return fl;
    }
}

class Help {
    constructor(x, y, callback, text, wx, color) {
        this.enabled = true;
        this.callback = callback;
        this.text = text ? text : "?";
        this.hover = false;
        this.color = color ? color : BUTTC;
        if (!wx) wx = BUTTH;
        this.move(x, y, wx);
    }
    move(x, y, wx) {
        this.x = x;
        this.y = y;
        if (wx) {
            this.wx = wx;

        }
    }
    isin(x, y) {
        if (this.enabled == false || this.hidden) return false;
        return dist(x, y, this.x, this.y) < this.wx / 2;
    }
    draw() {
        if (this.hidden) return;
        stroke(0);
        strokeWeight(1);
        if (this.hover) fill(255); else fill(this.color.r, this.color.g, this.color.b);
        circle(this.x, this.y, this.wx);
        textAlign(CENTER, BASELINE);
        textFont('Helvetica, Arial, Sans-Serif')
        textSize(this.wx * .7);
        noStroke()
        if (this.hover) fill(255, 0, 0); else fill(255)
        text(this.text, this.x, this.y + this.wx * .24);
    }
}


class Button {
    constructor(text, callback, x, y, color, wx, wy, textsize, key) {
        if (!wx) wx = BUTTW;
        if (!wy) wy = BUTTH;
        this.move(x, y, wx, wy);
        this.text = text;
        this.callback = callback;
        this.color = color ? color : BUTTC;
        this.cborder = ligthen(this.color, -0.3);
        this.cdisabled = ligthen(this.color, 0.5)
        this.textsize = textsize ? textsize : BUTTTEXTSIZE;
        this.enabled = true;
        this.hover = false;
        this.pressed = false;
        this.visible = true;
        this.key = key;
    }
    move(x, y, wx, wy) {
        this.x = x;
        this.y = y;
        if (wx) this.wx = wx
        if (wy) this.wy = wy
    }
    isin(x, y) {
        if (this.isvisible && !this.isvisible()) return;
        return (abs(x - this.x) <= this.wx / 2 &&
            abs(y - this.y) <= this.wy / 2)
    }
    draw() {
        if (this.isvisible && !this.isvisible()) return;
        if (this.visible) {
            rectMode(CENTER)
            .textAlign(CENTER, BASELINE)
            .textFont('Helvetica, Arial, Sans-Serif')
            .textSize(this.textsize)
            .strokeWeight(1)
            var c;
            var r = this.wy / 2;//buttonround;
            if (!this.enabled) {
                noStroke();
                c = ligthen(this.color, .6);
            } else if (this.callback) {
                if (this.pressed) {
                    stroke(this.color.r, this.color.g, this.color.b);
                    c = this.cborder;
                } else if (this.hover) {
                    noStroke();
                    c = this.cborder;

                } else {
                    stroke(this.cborder.r, this.cborder.g, this.cborder.b);
                    c = this.color;
                }
            } else {
                noStroke();
                r = 0;
                c = ligthen(this.color, .2);
            }
            fill(c.r, c.g, c.b)
            .rect(this.x, this.y, this.wx, this.wy, r)
            .fill(255);

            if (this.text) text(this.text, this.x, this.y + this.wy * 0.2);
        }
    }
}
