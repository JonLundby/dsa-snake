export { init, createVisualGrid };

function init() {
    console.log("View ok");
}

function createVisualGrid(rows, cols) {
    // console.log(`colscreating visual grid, row:${rows} col: ${cols}`);

    const visualGrid = document.querySelector("#grid-container");
    visualGrid.innerHTML = "";

    document.documentElement.style.setProperty("--grid-rows", rows);
    document.documentElement.style.setProperty("--grid-cols", cols);

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");

            visualGrid.insertAdjacentElement("beforeend", cell);
        }
    }
}
