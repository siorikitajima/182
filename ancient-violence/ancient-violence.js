let blood1;
let bloods = [];
let img, map, font, cols, rows, mapX, mapY;
// let id = 1;
let yr = 15000;
let sr = 'BCE';
let yx = 10;
let ctlIcon, pause, resume;
let playing = true;

function preload() {
  img = loadImage('../images/45-degree-fabric-light.png');
  map = loadImage('../images/world-map.svg');
  font = loadFont('../css/dosis.light.otf');
  pause = loadImage('../images/Pause_btn.svg');
  resume = loadImage('../images/Play_btn.svg');
}

function setup() {
    textFont(font);
    textSize(18);
    createCanvas(windowWidth, windowHeight - 40);

    cols = windowWidth/img.width;
    rows = windowHeight/img.height;
    if( windowWidth%img.width> 0){cols++;}
    if( windowHeight%img.height > 0){rows++;}

    ctlIcon = pause;
  }
  
  function draw() {
    background(11,11,11,11);
    
    for(let i = 0;i<bloods.length;i++) {
        bloods[i].show();
        if (playing) {
          if(sr == 'CE' && yr > 1980) {
            bloods[i].fade(100);
          } else {
            bloods[i].fade(1);
          }
        }
        bloods[i].remove(bloods);
      }

    // BG texture 
    // tint(50,50,50);
    // for (let y=0; y<rows; y++){
    //   for (let x=0; x<cols; x++){
    //       image(img,x*img.width,y*img.height);
    //   }
    // }

    textSize(18);
    fill(11,11,11);
    stroke(150,150,150);

    // The Year + Controller + Map Frame
    rect(10, 50, 100, 40);
    rect(110, 50, 40, 40);
    rect(windowWidth - 210, 50, 200, 100);
    noTint();
    image (ctlIcon, 110, 50, 40, 40);
    

    // The timeline
    rect(10, 10, windowWidth - 20, 40);
    line(10, 30, windowWidth - 10, 30);
    
    // The map
    tint(50,50,50);
    image(map, windowWidth - 210, 50, 200, 100);
    noFill();
    rect(windowWidth - 210, 50, 200, 100);

    // The year
    textAlign(CENTER, CENTER);
    fill(150,150,150);
    text(yr + ' ' + sr, 60, 68);
    fill(177, 10, 30);
    noStroke();
    ellipse(windowWidth - 210 + mapX, 50 + mapY, 10);
  
    // The timeline handle
    rect( yx, 10, 2, 40);

    // The mini bloods on the timeline
    fill(177, 10, 30, 150);
    // console.log();
    for(let d = 0; d < ancViol.length; d++) {
      let dotsize = 40 / 100 * ancViol[d].share;
      let dotx;
      if (ancViol[d].sr == 'BCE') {
        dotx = windowWidth - 10 - ((windowWidth-20) / (15000 + 2000) * (ancViol[d].yr + 2000));
      } else if (ancViol[d].sr == 'CE') {
        dotx = (windowWidth-20) / (15000 + 2000) * (15000 + ancViol[d].yr) + 10;
      }
      ellipse(dotx, 30, dotsize + 4);
    }

    if (playing) {
      if (sr == 'BCE' && yr == 0) {
        sr = 'CE';
        yr = yr +10;
      } else if (sr == 'CE' && yr == 2000) {
        sr = 'BCE';
        yr = 15000;
        yr = yr -50;
      } else if (sr == 'BCE' && yr < 6500 && yr > 5900 || sr == 'BCE' && yr < 4700 ) {
        yr = yr -10;
      } else if (sr == 'BCE') {
        yr = yr -50;
      } else if (sr == 'CE' && yr > 1300) {
        yr = yr +5;
      } else if (sr == 'CE') {
        yr = yr +10;
      }
    }

    for (let b = 0; b < ancViol.length; b++) {
      if (ancViol[b].yr == yr && ancViol[b].sr == sr) {
        bloods.push(new Blood(ancViol[b].sname, ancViol[b].share, ancViol[b].syear));
        mapX = ancViol[b].mapX;
        mapY = ancViol[b].mapY;
        break;
      }
    }

    if (sr == 'BCE') {
      yx = windowWidth - 10 - ((windowWidth-20) / (15000 + 2000) * (yr + 2000));
    } else if (sr == 'CE') {
      yx = (windowWidth-20) / (15000 + 2000) * (15000 + yr) + 10;
    }
  }

  function mousePressed() {
    let grid = (windowWidth - 20) / (15000 + 2000);
    if(mouseY > 10 && mouseY < 50 && mouseX > 10 && mouseX < windowWidth-10) {
      let posX = floor(mouseX / grid);
      let gridX = Math.round(posX / 100) * 100;
      if (gridX > 15000) { 
        gridX = gridX - 15000;
        sr = 'CE'; yr = gridX;
      } else {
        gridX = (gridX - 15000) * (-1);
        sr = 'BCE'; yr = gridX;
      }
      return false
    }

    if(mouseY > 50 && mouseY < 90 && mouseX > 110 && mouseX < 150) {
      if(playing) {
        playing = false;
        ctlIcon = resume;
      } else {
        playing = true;
        ctlIcon = pause;
      }
      return false
    }
  }

  class Blood {
    constructor(name, rate, year) {
        this.name = name;
        this.rate = rate;
        this.year = year;
        this.size = random(0.9, 1.1) * ( rate / 100 ) * windowHeight;
        this.x = random(this.size/2 + 40, windowWidth - 40 - this.size/2);
        this.y = random(this.size/2 + 60, windowHeight - 60 - this.size/2);
        this.third = floor(this.size * 0.3);
        this.num = floor(this.size * 0.1);
        this.area = floor(this.size * 0.75);
        this.smsize = []; this.smx = []; this.smy = [];
        for(let s = 0; s < this.num; s++) {
            this.smsize.push(random(1, this.third/1.5));
            this.smx.push(this.x + random(-(this.area), this.area));
            this.smy.push(this.y + random(-(this.area), this.area));
        }
        this.lgx = random(-this.size*0.8, this.size*0.8); 
        this.lgy = random(-this.size*0.8, this.size*0.8); 
        this.thick = random(10, 30);
        this.r = 177;
        this.g = 10;
        this.b = 30;
        this.o = 255;
        this.sec = random(this.num, this.third);
        this.white = 230;
    }
    show() {
        fill(this.r, this.g, this.b, this.o);
        stroke(this.r - 5, this.g - 5, this.b - 5, this.o);
        ellipse(this.x, this.y, this.size);
        for(let s = 0; s < this.num; s++) {
            ellipse(this.smx[s], this.smy[s], this.smsize[s]);
        }

        beginShape();
        curveVertex(this.x, this.y);
        curveVertex(this.x + this.thick, this.y + this.thick * 0.7);
        curveVertex(this.x + this.lgx, this.y + this.lgy + this.thick);
        curveVertex(this.x + this.lgx + this.thick * 0.7, this.y + this.lgy);
        curveVertex();
        endShape();        
        ellipse(this.x + this.lgx, this.y + this.lgy, this.sec);

        noStroke();
        textSize(18);
        textAlign(CENTER, CENTER);
        fill(this.white,this.white,this.white);
        text(this.year + '\n' + this.name, this.x, this.y -20);
        textSize(24);
        text(this.rate + '%', this.x, this.y + 18);
    }
    fade(acc) {
        if (this.r > 100 * 0.1) {
            this.r = this.r - (0.2 * acc);
            this.g = this.g - (0.2 * acc);
            this.b = this.b - (0.2 * acc);
            this.o = this.o - (0.2 * acc);
            this.white = this.white - (0.2 * acc);
        }
    }
    remove(array) {
      if (array.length > ancViol.length *2) {
        array.splice(0, 1);
      }
    }
  }
