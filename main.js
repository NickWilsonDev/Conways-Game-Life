/* main.js */
/* http://siteoftutorials.com/conways-game-life-javascript-tutorial/ */
/*
    Rules
    1. Any live cell with fewer than two live neighbors dies.
    2. Any live cell with two or three live neighbors lives on to the next generation.
    3. Any live cell with more than three neighbors dies, as if overpopulation.
    4. Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
*/


var drawPixel = function (context, x, y) {
    context.fillStyle = 'blue';
    context.fillRect( x, y, 1, 1 );
    context.fillRect( x+1, y, 1, 1);
    context.fillRect( x-1, y, 1, 1);
    context.fillRect( x, y+1, 1, 1);
    context.fillRect( x, y-1, 1, 1);
}

// grab context
var canvas = document.querySelector("#canvas");
var context = canvas.getContext("2d");

// map variable
var map = [];
var width = 100; //40;
var height = 70; //25;
var cellSize = 10; //25; // was 20;
var generation = 0;
// automatic generation option
var isAutomate = false;
var fps = 5;
var now;
var then = Date.now();
var interval = 1000 / fps;
var delta;

// Cell class
var Cell = function(x, y) {
    this.x = x;
    this.y = y;
    this.size = cellSize;
    this.isAlive = false;

    this.draw = function() {
        // draw outline border
        context.beginPath();
        context.rect(this.x * this.size, this.y * this.size, this.size, this.size);
        context.strokeStyle = "#000"; //black color
        context.stroke();
        context.closePath();

        //fill color
        if (this.isAlive) {
            context.fillStyle = 'blue'; //"#000"; //black color
        } else {
            context.fillStyle = "#f3f3f3"; // white color
        }

        context.fillRect(this.x * this.size, this.y * this.size, this.size, this.size);
        context.stroke();
    }
};

var initializeMap = function () {
    for (var i = 0; i < width; i++) {
        var temp = []
        for (var j = 0; j < height; j++) {
            temp[j] = new Cell(i, j);
        }
        map[i] = temp;
    }
};

var on_canvas_click = function(event) {
    console.log(event.clientX);
    var xPosition = event.clientX - canvas.offsetLeft;
    var yPosition = event.clientY - canvas.offsetTop;
    toggleCell(xPosition, yPosition);
};


// Add click event listener to the canvas
canvas.addEventListener('click', on_canvas_click, false);

// toggle cell state
var toggleCell = function(xPosition, yPosition) {
    for (var i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {
            cell = map[i][j];
            // map the mouse position to cell grid position by mult by cell size
            if ((xPosition >= cell.x * cell.size && xPosition < cell.x * cell.size + cell.size) && (yPosition >= cell.y * cell.size && yPosition < cell.y * cell.size + cell.size)) {
                cell.isAlive = !cell.isAlive
            }
        }
    }
};

var clearCanvas = function () {
    isAutomate = false;
    generation = 0;
    var temporaryMap = [];

    // initialize an grid of cells
    for (var i = 0; i < width; i++) {
        var temp = [];
        for (var j = 0; j < height; j++) {
            temp[j] = new Cell(i, j);
        }
        temporaryMap[i] = temp;
    }

    // loop through every cell and clear/kill any shaded cells
    for (var i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {
            cell = map[i][j];
            if (temporaryMap[i][j].isAlive) {
                temporaryMap[i][j].isAlive = false;
            }
        }
    }
    map = temporaryMap;
}

var randomPop = function () {
    var temporaryMap = [];
    // initialize an grid of cells
    for (var i = 0; i < width; i++) {
        var temp = [];
        for (var j = 0; j < height; j++) {
            temp[j] = new Cell(i, j);
        }
        temporaryMap[i] = temp;
    }

    // loop through every cell and clear/kill any shaded cells
    for (var i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {
            cell = map[i][j];
            
            console.log("i, j :: " + i + " " + j);
            rand = Math.floor(Math.random() * 100);
            console.log("rand " + rand);
            if (rand === 0 || rand % 2 === 0) {
                temporaryMap[i][j].isAlive = true;
                toggleCell(i, j);
            }
        }
    }
    map = temporaryMap;
}

var getNeighbors = function(cell) {
    neighborsCount = 0;
    var x = cell.x;
    var y = cell.y;

    // check all 8 neighbors
    if (x > 0 && map[x - 1][y].isAlive) {
        neighborsCount++;
    }
    if (x < width - 1 && map[x + 1][y].isAlive) {
        neighborsCount++;
    }
    if (y < height - 1 && map[x][y + 1].isAlive) {
        neighborsCount++;
    }
    if (y > 0 && map[x][y - 1].isAlive) {
        neighborsCount++;
    }

    if (x > 0 && y > 0 && map[x - 1][y - 1].isAlive) {
        neighborsCount++;
    }
    if (x < width - 1 && y > 0 && map[x + 1][y - 1].isAlive) {
        neighborsCount++;
    }
    if (y < height - 1 && x > 0 && map[x - 1][y + 1].isAlive) {
        neighborsCount++;
    }
    if (x < width - 1 && y < height - 1 && map[x + 1][y + 1].isAlive) {
        neighborsCount++;
    }
    return neighborsCount;
};

function animate() {
  requestAnimationFrame(animate);
  now = Date.now();
  delta = now - then;
  if (delta > interval) {
    then = now - (delta % interval);
    if (isAutomate) {
      applyRules();
    }
    // Draw all cells
    drawCells();
    document.getElementById("generationSpan").textContent=generation;
  }
};

function drawCells(){
  // Draw all cells
  for (var i = 0; i < width; i++) {
    for (var j = 0; j < height; j++) {
      map[i][j].draw();
    }
  }
};

// toggle isAutomate variable
var automate = function () {
    isAutomate = !isAutomate;
    if (isAutomate) {
        document.getElementById("automateButton").value="Stop";
    } else {
        document.getElementById("automateButton").value="Automate";
    }
};


function applyRules() {
  // Create a temporary map
  var temporaryMap = [];

  // initialize an grid of cells
  for (var i = 0; i < width; i++) {
    var temp = [];
    for (var j = 0; j < height; j++) {
      temp[j] = new Cell(i, j);
    }
    temporaryMap[i] = temp;
  }

  // loop through every cell and apply the rules
  for (var i = 0; i < width; i++) {
    for (var j = 0; j < height; j++) {
      cell = map[i][j];

      neighbors = getNeighbors(cell);
      if (neighbors < 2) {
        temporaryMap[i][j].isAlive = false;
      }
      if (cell.isAlive && (neighbors == 3 || neighbors == 2)) {
        temporaryMap[i][j].isAlive = true;
      }
      if (neighbors > 3) {
        temporaryMap[i][j].isAlive = false;
      }
      if (neighbors == 3) {
        temporaryMap[i][j].isAlive = true;
      }
    }
  }
  // replace the map with the fresh calculated temporary map
  map = temporaryMap;
  generation++; // increase the generation 
};

//function calls
initializeMap();
animate();
