let blood1;
let bloods = [];
let img, map, font, cols, rows, mapX, mapY;
// let id = 1;
let yr = 15000;
let sr = 'BCE';

const ancViol = [
  {
    "year": "14000 - 6000 BCE",
    "name": "Gobero\n(Niger)",
    "share": 0,
    "yr": 14000,
    "sr": "BCE",
    "mapX": 95,
    "mapY": 50
  },
  {
    "year": "12000 - 10000 BCE",
    "name": "Nubia(Egypt):\nsite 117",
    "share": 46,
    "yr": 12000,
    "sr": "BCE",
    "mapX": 115,
    "mapY": 40
  },
  {
    "year": "12000 - 10000 BCE",
    "name": "Nubia(Egypt):\nnear site 117",
    "share": 3,
    "yr": 12000,
    "sr": "BCE",
    "mapX": 115,
    "mapY": 40
  },
  {
    "year": "10000 BCE",
    "name": "Nubia(Egypt):\nQadan burials",
    "share": 21,
    "yr": 10000,
    "sr": "BCE",
    "mapX": 115,
    "mapY": 40
  },
  {
    "year": "9000 BCE",
    "name": "Vasiliv'ka III\n(Ukraine)",
    "share": 21,
    "yr": 9000,
    "sr": "BCE",
    "mapX": 110,
    "mapY": 30
  },
  {
    "year": "7500 BCE",
    "name": "Volos'ke\n(Ukraine)",
    "share": 22,
    "yr": 7500,
    "sr": "BCE",
    "mapX": 110,
    "mapY": 30
  },
  {
    "year": "6300 - 5300 BCE",
    "name": "Calumnata\n(Algeria)",
    "share": 4,
    "yr": 6300,
    "sr": "BCE",
    "mapX": 88,
    "mapY": 40
  },
  {
    "year": "6000 BCE",
    "name": "Brittany\n(France)",
    "share": 8,
    "yr": 6000,
    "sr": "BCE",
    "mapX": 85,
    "mapY": 30
  },
  {
    "year": "6000 BCE",
    "name": "Columnata\n(Algeria)",
    "share": 2,
    "yr": 6000,
    "sr": "BCE",
    "mapX": 88,
    "mapY": 40
  },
  {
    "year": "4600 BCE",
    "name": "Ile Teviec\n(France)",
    "share": 12,
    "yr": 4600,
    "sr": "BCE",
    "mapX": 85,
    "mapY": 30
  },
  {
    "year": "4300 - 3800 BCE",
    "name": "Bogebakken\n(Denmark)",
    "share": 12,
    "yr": 4300,
    "sr": "BCE",
    "mapX": 90,
    "mapY": 25
  },
  {
    "year": "4100 BCE",
    "name": "Skateholm 1\n(Sweden)",
    "share": 7,
    "yr": 4100,
    "sr": "BCE",
    "mapX": 95,
    "mapY": 20
  },
  {
    "year": "4100 BCE",
    "name": "Vedbaek\n(Denmark)",
    "share": 17,
    "yr": 4100,
    "sr": "BCE",
    "mapX": 90,
    "mapY": 25
  },
  {
    "year": "3500 BCE - 1380 CE",
    "name": "S. California:\n28 sites",
    "share": 6,
    "yr": 3500,
    "sr": "BCE",
    "mapX": 25,
    "mapY": 45
  },
  {
    "year": "3500 BCE - 1674 CE",
    "name": "British Columbia:\n30 sites",
    "share": 23,
    "yr": 3500,
    "sr": "BCE",
    "mapX": 25,
    "mapY": 35
  },
  {
    "year": "2500 - 3000 BCE",
    "name": "Kentucky",
    "share": 6,
    "yr": 2500,
    "sr": "BCE",
    "mapX": 40,
    "mapY": 35
  },
  {
    "year": "2240 BCE - 1770 CE",
    "name": "Central California\n(2 sites)",
    "share": 4,
    "yr": 2200,
    "sr": "BCE",
    "mapX": 25,
    "mapY": 45
  },
  {
    "year": "1500 BCE - 500 CE",
    "name": "N. British Columbia",
    "share": 32,
    "yr": 1500,
    "sr": "BCE",
    "mapX": 25,
    "mapY": 35
  },
  {
    "year": "1500 BCE - 500 CE",
    "name": "Central California",
    "share": 5,
    "yr": 1500,
    "sr": "BCE",
    "mapX": 25,
    "mapY": 45
  },
  {
    "year": "1140 - 854 BCE",
    "name": "Sarai Nahar Rai\n(N. India)",
    "share": 30,
    "yr": 1150,
    "sr": "BCE",
    "mapX": 135,
    "mapY": 45
  },
  {
    "year": "415 BCE - 227 CE",
    "name": "Central California",
    "share": 8,
    "yr": 400,
    "sr": "BCE",
    "mapX": 25,
    "mapY": 45
  },
  {
    "year": "100 - 1100 CE",
    "name": "CA-Ven-110\n(S. California)",
    "share": 10,
    "yr": 100,
    "sr": "CE",
    "mapX": 25,
    "mapY": 45
  },
  {
    "year": "500 - 1774 CE",
    "name": "British Columbia",
    "share": 28,
    "yr": 500,
    "sr": "CE",
    "mapX": 25,
    "mapY": 35
  },
  {
    "year": "1300 CE",
    "name": "Illinois",
    "share": 16,
    "yr": 1300,
    "sr": "CE",
    "mapX": 40,
    "mapY": 33
  },
  {
    "year": "1325 CE",
    "name": "Crow Creek\n(South Dakota)",
    "share": 60,
    "yr": 1320,
    "sr": "CE",
    "mapX": 35,
    "mapY": 33
  },
  {
    "year": "1325 - 1650 CE",
    "name": "Northeast Plains\n(Plain Indians)",
    "share": 15,
    "yr": 1320,
    "sr": "CE",
    "mapX": 35,
    "mapY": 30
  },
  {
    "year": "1805 CE",
    "name": "Blackfoot tribe\n(Plain Indians)",
    "share": 50,
    "yr": 1800,
    "sr": "CE",
    "mapX": 35,
    "mapY": 35
  },
  {
    "year": "1857 CE",
    "name": "Blackfoot tribe\n(Plain Indians)",
    "share": 33,
    "yr": 1850,
    "sr": "CE",
    "mapX": 35,
    "mapY": 35
  },
  {
    "year": "1900 CE",
    "name": "Tribal Montenegro",
    "share": 25,
    "yr": 1900,
    "sr": "CE",
    "mapX": 100,
    "mapY": 35
  },
  {
    "year": "1920 - 1979 CE",
    "name": "Ayoreo\n(Hunter-Gatherer)",
    "share": 20,
    "yr": 1920,
    "sr": "CE",
    "mapX": 55,
    "mapY": 65
  },
  {
    "year": "1962 - 1977 CE",
    "name": "Casiguran Agta\n(Philippines)\n(Hunter-Gatherer)",
    "share": 12,
    "yr": 1960,
    "sr": "CE",
    "mapX": 160,
    "mapY": 55
  }

];

function preload() {
  img = loadImage('../images/45-degree-fabric-light.png');
  map = loadImage('../images/world-map.svg');
  font = loadFont('../css/dosis.light.otf');
}

function setup() {
    textFont(font);
    createCanvas(windowWidth, windowHeight - 40);

    cols = windowWidth/img.width;
    rows = windowHeight/img.height;
    if( windowWidth%img.width> 0){cols++;}
    if( windowHeight%img.height > 0){rows++;}
  }
  
  function draw() {
    background(11,11,11,11);
    
    for(let i = 0;i<bloods.length;i++) {
        bloods[i].show();
        bloods[i].fade();
        bloods[i].remove(bloods);
      }
    for (let y=0; y<rows; y++){
      for (let x=0; x<cols; x++){
          tint(50,50,50);
          image(img,x*img.width,y*img.height);
      }
    }

    fill(11,11,11);
    stroke(150,150,150);
    rect(10, 10, 100, 40);
    rect(windowWidth - 210, 10, 200, 100);
    image(map, windowWidth - 210, 10, 200, 100);
    noFill();
    rect(windowWidth - 210, 10, 200, 100);
    textAlign(CENTER, CENTER);
    fill(150,150,150);
    text(yr + ' ' + sr, 60, 28);
    fill(177, 10, 30);
    noStroke();
    ellipse(windowWidth - 210 + mapX, 10 + mapY, 10);

    if (sr == 'BCE' && yr == 0) {
      sr = 'CE';
      yr = yr +10;
    } else if (sr == 'CE' && yr == 2000) {
      sr = 'BCE';
      yr = 14000;
      yr = yr -50;
    } else if (sr == 'BCE' && yr < 7000) {
      yr = yr -10;
    } else if (sr == 'BCE') {
      yr = yr -50;
    } else if (sr == 'CE' && yr > 1300) {
      yr = yr +5;
    } else if (sr == 'CE') {
      yr = yr +10;
    }

    for (let b = 0; b < ancViol.length; b++) {
      if (ancViol[b].yr == yr && ancViol[b].sr == sr) {
        bloods.push(new Blood(ancViol[b].name, ancViol[b].share, ancViol[b].year));
        mapX = ancViol[b].mapX;
        mapY = ancViol[b].mapY;
        break;
      }
    }
  }

  // setInterval(() => {
  //   bloods.push(new Blood(ancViol[id].name, ancViol[id].share, ancViol[id].year));
  //   if (id == ancViol.length -1) {
  //     id = 0;
  //   } else {
  //     id = id +1;
  //   }
  // }, 2000);

  class Blood {
    constructor(name, rate, year) {
        this.name = name;
        this.rate = rate;
        this.year = year;
        this.size = random(0.9, 1.1) * ( rate / 100 ) * windowHeight;
        this.x = random(this.size/2 + 40, windowWidth - this.size/2);
        this.y = random(this.size/2 + 40, windowHeight - this.size/2);
        this.third = floor(this.size * 0.3);
        this.num = floor(this.size * 0.1);
        this.area = floor(this.size * 0.75);
        this.smsize = []; this.smx = []; this.smy = [];
        for(let s = 0; s < this.num; s++) {
            this.smsize.push(random(1, this.third/1.5));
            this.smx.push(this.x + random(-(this.area), this.area));
            this.smy.push(this.y + random(-(this.area), this.area));
        }
        // this.lgsize = random(this.third/1.5, this.third*2); 
        this.lgx = random(-this.size*0.8, this.size*0.8); 
        this.lgy = random(-this.size*0.8, this.size*0.8); 
        this.thick = random(10, 30);
        // this.lgangle = random(0, 360);
        this.r = 177;
        this.g = 10;
        this.b = 30;
        this.o = 255;
        this.sec = random(this.num, this.third);
        this.white = 230;
    }
    show() {
        // blendMode(OVERLAY)
        fill(this.r, this.g, this.b, this.o);
        noStroke();
        ellipse(this.x, this.y, this.size);
        for(let s = 0; s < this.num; s++) {
            ellipse(this.smx[s], this.smy[s], this.smsize[s]);
        }
        // translate(this.x + this.lgsize - 10, this.y);
        // angleMode(DEGREES);
        // rotate(this.lgangle);
        // rect(this.x, this.y, this.lgsize, this.thick, this.thick/2);

        // strokeWeight(this.thick);
        // stroke(this.r, this.g, this.b);
        // line(this.x, this.y, this.x + this.lgx, this.y + this.lgy);
        // ellipse(this.x + this.lgx, this.y + this.lgy, this.sec);

        beginShape();
        curveVertex(this.x, this.y);
        curveVertex(this.x + this.thick, this.y + this.thick * 0.7);
        curveVertex(this.x + this.lgx, this.y + this.lgy + this.thick);
        curveVertex(this.x + this.lgx + this.thick * 0.7, this.y + this.lgy);
        curveVertex();
        endShape();        
        ellipse(this.x + this.lgx, this.y + this.lgy, this.sec);

        textSize(18);
        textAlign(CENTER, CENTER);
        fill(this.white,this.white,this.white);
        text(this.year + '\n' + this.name + '\n' + this.rate + '%', this.x, this.y);
    }
    fade() {
        if (this.r > 100 * 0.1) {
            this.r = this.r - 0.5;
            this.g = this.g - 0.5;
            this.b = this.b - 0.5;
            this.o = this.o - 0.5;
            this.white = this.white - 0.5;
        }
    }
    remove(array) {
      if (array.length > ancViol.length *2) {
        array.splice(0, 1);
      }
    }
  }