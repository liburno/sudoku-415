var w, ox, oy;
var CW, CH;
var sudoku;
var nine;
var ui, btreset, btnhelp, btnrestart, btninfo;
var numbersel;
var solver, undosolver;
var xxlevel = 0;
var ishelped = false;
var dstart, dend;


function mouseClicked() {
  ui.mousepress(mouseX, mouseY);
}
function mousePressed() {
  sudoku.mousepress(mouseX, mouseY);
}

function mouseMoved() {
  if (!mouseIsPressed) {
    if (ui) ui.mousemove(mouseX, mouseY);
  }
}
function keyPressed() {
  ui.keypress(key);
}


function recalcpos() {
  btreset.move(ox + w * 10.5, oy, w * 3)
  btnrestart.move(ox + w * 9.5, oy + w)
  btnhelp.move(ox + w * 11.5, oy + w)
  btninfo.move(ox + w * 10.5, oy + w * 7.5, w * 3)

}

function windowResized() {
  checksize();
  resizeCanvas(CW, CH);
  ui.recalcbuttsize(CW)
  recalcpos();
}

function checksize() {
  CW = windowWidth;
  CH = windowHeight
  w = CW / 13.5
  if (CH / 10 < w) w = CH / 10;
  w = floor(w);
  ox = floor(w * .8);
  oy = floor(w * .8);

}
function setup() {
  checksize();
  var can = createCanvas(CW, CH).parent("canvas");

  sudoku = new Sudoku();
  undosolver = [];
  if (!sudoku.fromLocalStorage()) sudoku.reset();
  ui = new UI();
  btreset = new Button("New", () => {
    sudoku.reset()
  });
  btnrestart = new Help(0, 0, () => {
    sudoku.fromLocalStorage();
  }, '↺');
  btninfo = new Button("info", () => {
    window.location.hash = "#help"
  }, 0, 0);
  btnhelp = new Help(ox + w * 11.2, oy + w, () => {
    ishelped = !ishelped
  }, "?");

  ui.push([btreset, btnhelp, btninfo, btnrestart]);

  recalcpos();
  frameRate(10);
}
function draw() {
  background(0, 128, 0);
  sudoku.draw();
  ui.draw();
}

