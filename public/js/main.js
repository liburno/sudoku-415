var w, ox, oy;
var CW, CH;
var sudoku;
var nine;
var ui, btreset, btnhelp, btnrestart, btninfo;
var sedit, divblock, divsel, divinput, randid, baseid, countid;
var numbersel;
var modeedit = false;
var solver, undosolver;
var xxlevel = 0;
var ishelped = false;

var dstart, dend;

function getnextid() {
  baseid = getstorage("sudoku_baseid");
  if (!baseid) {
    baseid = Math.floor(Math.random() * 100000) + '';
    setstorage("sudoku_baseid", baseid);
  }
  countid = getstorage("sudoku_countid")
  countid = Number(countid)
  if (!countid) {
    countid = 1;
  } else {
    countid++;
  }
  setstorage("sudoku_countid", countid);
  return `${baseid}_${countid}`;
}

function copyfromsudoku() {
  var vv = [];
  for (var i = 0; i < 9; i++) {
    var v1 = [];
    for (var j = 0; j < 9; j++) {
      if (sudoku.grid[i][j].initial) v1.push(sudoku.grid[i][j].value); else v1.push(0);
    }
    vv.push(v1);
  }
  sedit = new SSolver(vv);
}

function mouseClicked() {
  if (!modeedit) {
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
    sedit.keypress(key)

  } else {
    if (key == '?') {
      ishelped = !ishelped

    }
    sudoku.keypress(key)
    ui.keypress(key);
  }
}


function recalcpos() {
  btreset.move(ox + w * 10.5, oy, w * 3)

  btnrestart.move(ox + w * 9.5, oy + w * .9)
  btnhelp.move(ox + w * 11.5, oy + w * .9)
  btnedit.move(ox + w * 10.5, oy + w * 7.4, w * 3)
  btninfo.move(ox + w * 10.5, oy + w * 8.2, w * 3)
  divblock.position(ox + w * 9, oy).size(w * 3)
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

  createblockinterface();
  sedit = new SSolver('');
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

  btnedit = new Button("Edit", () => {
    post('/post/jListSchema', {}).then(d => {
      fillList(d);
      divinput.value(sudoku.curid);

      divblock.show();
      copyfromsudoku();

      modeedit = true;
    }).catch(e => {
      alert(`error! ${e}`)
    })

  }, 0, 0);



  btnhelp = new Help(ox + w * 11.2, oy + w, () => {
    ishelped = !ishelped
  }, "?");

  ui.push([btreset, btnhelp, btninfo, btnrestart, btnedit]);
  recalcpos();
  frameRate(10);
}
function draw() {
  background(0, 128, 0);
  if (modeedit) {
    sedit.draw();
  } else {
    sudoku.draw();
    ui.draw();
  }
}

function fillList(d) {
  divsel.html("");
  for (var v of d)
    divsel.option(v);

}
function createblockinterface() {
  divblock = createDiv().parent("interface").hide();

  createButton('candidates').parent(divblock).class("btn").mousePressed(() => {
    var s2 = sedit.clone();
    if (s2.trysolve()) {
      sedit.getcandidates();
    } else {
      sedit = sedit.clone();
    }

  })
  createDiv().parent(divblock).class('label').html("name:")


  divinput = createInput().parent(divblock)
  createDiv().parent(divblock).class('label').style("margin-top:2em;").html("load:")
  divsel = createSelect().parent(divblock).html("");

  createButton('delete').parent(divblock).class("btn").mousePressed(() => {
    var id = divinput.value();
    if (id) {
      post('/post/jDeleteSchema', { id: id }).then(d => {
        alert(`deleted: ${id}`);  
        fillList(d);

      })
    }
  })


  createButton('save').parent(divblock).class("btn").style("margin-top:10em").mousePressed(() => {
    var s2 = sedit.clone();
    if (s2.trysolve()) {
      var id = divinput.value();
      if (id) {
        post('/post/jSaveSchema', { data: sedit.toString(), id: id }).then(d => {
          alert(`saved: ${id}`);  
          fillList(d);
        }).catch(e => {
          alert(e);
        })
      }
    }
  })

  createButton('exit').parent(divblock).class("btn").mousePressed(() => {
    var s2 = sedit.clone();
    if (s2.trysolve()) {
      var id = divinput.value();
      sudoku.fromEdit(id,s2);
      divblock.hide();
      modeedit = false;
    }
  })

  divsel.changed(() => {
    var id = divsel.value();
    if (id) {
      post('/post/jGetSchema', { id }).then(d => {
        sedit = new SSolver(d)
        divinput.value(id);
      }).catch(e => {
        alert(e);
      })
    }

  })

}
