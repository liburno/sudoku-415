var w,ox,oy;
var CW,CH;
var sudoku;
var nine;
var ui,btreset,btnsound,btnhelp,btnhelp2,btnrestart,btninfo,btk,issound,clicksound;
var numbersel;
var applause,tosse,solver,undosolver;
var xxlevel=0;
var ishelped=false;
var dstart,dend;


function preload() {
  applause=loadSound('../songs/umgawa.mp3');
  tosse=loadSound('../songs/tosse.mp3');
  clicksound=loadSound("../songs/click.mp3");
 
}
function mouseClicked() {
  ui.mousepress(mouseX,mouseY);
}
function mousePressed() {
   sudoku.mousepress(mouseX,mouseY);
}

function mouseMoved() {
  if (!mouseIsPressed) {
      if (ui) ui.mousemove(mouseX,mouseY);
  }
}
function keyPressed() {
  ui.keypress(key);
}


function recalcpos() {
  btreset.move(ox+w*10.5,oy,w*3)
  btnrestart.move(ox+w*9.5,oy+w)
  btnsound.move(ox+w*10.5,oy+w)
  btnhelp.move(ox+w*11.5,oy+w)
  btninfo.move(ox+w*10.5,oy+w*7.5,w*3)

}

function windowResized() {
  checksize();
  resizeCanvas(CW,CH);
  ui.recalcbuttsize(CW)
  recalcpos();
}

function checksize() {
  CW=windowWidth;
  CH=windowHeight
  w=CW/13.5
  if (CH/10<w) w=CH/10;
  w=floor(w);
  ox=floor(w*.8);
  oy=floor(w*.8);  
  
}
function setup() {
  checksize();
  var can=createCanvas(CW,CH).parent("canvas");
  
  sudoku=new Sudoku();
  undosolver=[];
  if (!sudoku.fromLocalStorage())   sudoku.reset();
  ui=new UI();
  btk=[];


  btreset=new Button("New",() =>{
    sudoku.reset() 
  } );
  btnrestart=new Help(0,0,() =>{
    sudoku.fromLocalStorage();
  } ,'↺');
  btninfo=new Button("info",() =>{
    window.location.hash="#help"
  } ,0,0);
  
  issound=!(!getstorage("sound"))
  btnsound=new Help(ox+w*9.8,oy+w,()=>{
    issound=!issound;
    btnsound.text=sounddes();
    setstorage("sound",issound);
  } ,sounddes());
  btnhelp=new Help(ox+w*11.2,oy+w,()=>{
    ishelped=!ishelped
  },"?");

  ui.push([btreset,btnsound,btnhelp,btninfo,btnrestart]);
 
  recalcpos();
  
}
function draw() {
  background(0,128,0);
  sudoku.draw();
  ui.draw();
}

