var w, ox, oy;
var CW, CH;
var sudoku;
var nine;
var ui, btreset, btnhelp, btnrestart, btninfo, ui2, btnnoedit,btncand;
var sedit;
var numbersel;
var modeedit = false;
var solver, undosolver;
var xxlevel = 0;
var ishelped = false;
var dstart, dend;



function copyfromsudoku() {
   var vv=[];
   for (var i=0;i<9;i++) {
     var v1=[];
     for (var j=0;j<9;j++) {
        if (sudoku.grid[i][j].initial) v1.push(sudoku.grid[i][j].value); else v1.push(0);
     }
     vv.push(v1);
   }
   sedit=new SSolver(vv);
}

function mouseClicked() {
  if (modeedit) {
    ui2.mousepress(mouseX, mouseY)
  } else {
    ui.mousepress(mouseX, mouseY);
  }
}
function mousePressed() {
  if (modeedit) {
    sedit.mousepress(mouseX, mouseY);

  } else {
    sudoku.mousepress(mouseX, mouseY);
  }
}

function keyPressed() {
  if (modeedit) {

    switch (key) {
      case "ArrowDown":
        sedit.checkmode = false;
        if (sedit.currow < 8) sedit.currow++; else sedit.currow = 0;
        break;
      case "ArrowUp":
        sedit.checkmode = false;
        if (sedit.currow > 0) sedit.currow--; else sedit.currow = 8;
        break;
      case "ArrowLeft":
        sedit.checkmode = false;
        if (sedit.curcol > 0) sedit.curcol--; else {
          sedit.curcol = 8;
          if (sedit.currow > 0) sedit.currow--; else sedit.currow = 8;
        }
        break;
      case "ArrowRight":
        sedit.checkmode = false;
        if (sedit.curcol < 8) sedit.curcol++; else {
          sedit.curcol = 0;
          if (sedit.currow < 8) sedit.currow++; else sedit.currow = 0;
        }
        break;
      case "0":
      case "Space":
      case " ":
        var xx = sedit.v[sedit.curcol][sedit.currow]
        xx.v = 0;
        xx.init = false;
        sedit.movenext();
        break;
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        var xx = sedit.v[sedit.curcol][sedit.currow]
        xx.v = Number(key);
        xx.init = true;
        sedit.movenext();

        break;
      default:
          console.log(key);
          break;
    }
  } else {
    ui.keypress(key);
  }
}


function recalcpos() {
  btreset.move(ox + w * 10.5, oy, w * 3)
  btncand.move(ox + w * 10.5, oy, w * 3)
 
  btnrestart.move(ox + w * 9.5, oy + w)
  btnhelp.move(ox + w * 11.5, oy + w)
  btnedit.move(ox + w * 10.5, oy + w * 7.4, w * 3)
  btnnoedit.move(ox + w * 10.5, oy + w * 7.4, w * 3)
  btninfo.move(ox + w * 10.5, oy + w * 8.2, w * 3)

}

function windowResized() {
  checksize();
  resizeCanvas(CW, CH);
  ui.recalcbuttsize(CW)
  ui2.recalcbuttsize(CW)
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
  sedit = new SSolver('');
  console.log(sedit);
  sudoku = new Sudoku();
  undosolver = [];
  if (!sudoku.fromLocalStorage()) sudoku.reset();
  ui = new UI();
  ui2 = new UI();
  btreset = new Button("New", () => {
    sudoku.reset()
  });
  btnrestart = new Help(0, 0, () => {
    sudoku.fromLocalStorage();
  }, '↺');
  btninfo = new Button("info", () => {
    window.location.hash = "#help"
  }, 0, 0);

  btnedit = new Button("Edit", () => {
    copyfromsudoku();
    modeedit = true;
  }, 0, 0);
  
  btncand = new Button("Candidates", () => {
    var s2=sedit.clone();
    if (s2.trysolve()) {
      sedit.getcandidates();
    } else {
      sedit=sedit.clone();
    }
  }, 0, 0);

  btnnoedit = new Button("Save", () => {
    var s2=sedit.clone();
    if (s2.trysolve()) {
      sudoku.fromEdit(s2);
      modeedit = false;
    }
  }, 0, 0);



  btnhelp = new Help(ox + w * 11.2, oy + w, () => {
    ishelped = !ishelped
  }, "?");

  ui.push([btreset, btnhelp, btninfo, btnrestart, btnedit]);
  ui2.push([btnnoedit,btncand]);
  recalcpos();
  frameRate(10);
}
function draw() {
  background(0, 128, 0);
  if (modeedit) {
    ui2.draw();
    sedit.draw();
  } else {
    sudoku.draw();
    ui.draw();
  }
}

