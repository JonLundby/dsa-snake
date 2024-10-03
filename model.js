import Grid from "./grid.js";
import Queue from "./queue.js";

export { init, createGrid, createQueue };

function init() {
    console.log("model ok");
}

// GRID
function createGrid(rows, cols, value) {
    return new Grid(rows, cols, value);
}

// QUEUE
function createQueue() {
    return new Queue();
}
