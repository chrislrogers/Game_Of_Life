const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

const delaySlider = document.getElementById("delay");

let canvasSize = 500;
let grid = 10;
let scale;
let world;
let cols, rows;
let delay = 200;

function createState() {
    // Creates an empty 2D array.
    let array = [];
    for (let i = 0; i < cols; i++) {
        array[i] = new Array(rows);
    }
    return array;
}

function populateState(array) {
    // Populates a 2D array with random 1 or 0 values.
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            array[i][j] = Math.floor(Math.random() * 2);
        }
    }
    return array;
}

function drawState(array) {
    // Draws a grid on canvas from a 2D array of 1 or 0 values.
    let offset = 1;
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (array[i][j] === 1) {
                c.fillStyle = 'white';
            } else {
                c.fillStyle = 'black';
            }
            c.fillRect((i * grid) + offset, (j * grid) + offset, grid - (offset * 2), grid - (offset * 2));
        }
    }
}

function countLiveNeighbors(array, x, y) {
    // Counts the 8 neighbors surrounding a value and returns the living total.
    let live = 0;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            let col = (x + i + cols) % cols;
            let row = (y + j + rows) % rows;
            live += array[col][row];
        }
    }
    live -= array[x][y]; // remove self from the total.
    return live;
}

delaySlider.oninput = function () {
    delay = this.value;
}

function init() {
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    scale = canvasSize / grid;
    cols = canvas.width / grid;
    rows = canvas.height / grid;
    world = populateState(createState());
    animate();
}

function animate() {
    setTimeout(function onTick() {
        requestAnimationFrame(animate);
        drawState(world);
        let nextState = createState();
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                let neighbors = countLiveNeighbors(world, i, j);
                if (world[i][j] === 0 && neighbors === 3) {
                    nextState[i][j] = 1;
                } else if (world[i][j] === 1 && neighbors < 2) {
                    nextState[i][j] = 0;
                } else if (world[i][j] === 1 && neighbors > 3) {
                    nextState[i][j] = 0;
                } else {
                    nextState[i][j] = world[i][j];
                }
            }
        }
        world = nextState;
    }, delay)
}

init();
