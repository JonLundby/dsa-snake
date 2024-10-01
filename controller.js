import * as model from "./model.js";
import * as view from "./view.js";

let GRID_HEIGHT;
let GRID_WIDTH;

init();

function init() {
    // set grid size
    GRID_HEIGHT = document.querySelector("#grid-height-input").value;
    GRID_WIDTH = document.querySelector("#grid-width-input").value;
    
    view.createVisualGrid(GRID_HEIGHT, GRID_WIDTH);

    // add eventlistenerBtns
    document.querySelector("#start-btn").addEventListener("click", startGame);
    document.querySelector("#grid-height-input").addEventListener("change", resizeGrid);
    document.querySelector("#grid-width-input").addEventListener("change", resizeGrid);
}

function startGame() {
    toggleControlPanel();

    const gameGrid = model.createGrid(GRID_HEIGHT, GRID_WIDTH, 0);
    view.createVisualGrid(GRID_HEIGHT, GRID_WIDTH);

    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
    });

    console.table(gameGrid.grid);
    tick();
}

function tick() {
    setTimeout(tick, 500);
    console.log("tick");
}

function resizeGrid() {
    GRID_HEIGHT = document.querySelector("#grid-height-input").value;
    GRID_WIDTH = document.querySelector("#grid-width-input").value;
}

function toggleControlPanel() {
    if (!document.querySelector("#start-btn").disabled) {
      document.querySelector("#start-btn").disabled = true;

      document.querySelector("#grid-height-input").disabled = true;  
      document.querySelector("#grid-width-input").disabled = true;  
    } 
}