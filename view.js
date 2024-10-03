export { init, createVisualGrid, updateVisualGrid };

function init() {
    console.log("View ok");
}

function createVisualGrid(rows, cols) {
    // clear grid
    const visualGrid = document.querySelector("#grid-container");
    visualGrid.innerHTML = "";

    // css variables that defines the grid row/columns are set
    document.documentElement.style.setProperty("--grid-rows", rows);
    document.documentElement.style.setProperty("--grid-cols", cols);

    // building grid with div cells
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");

            visualGrid.insertAdjacentElement("beforeend", cell);
        }
    }
}

function updateVisualGrid(grid) {
    const cells = document.querySelectorAll(".cell");

    for (let row = 0; row < grid.rows; row++) {
        for (let col = 0; col < grid.cols; col++) {
            let index = row * grid.cols + col;

            switch (grid.get(row, col)) {
                case 0:
                    cells[index].classList.remove("snake", "food");
                    break;
                case 1:
                    cells[index].classList.add("snake");
                    break;
                case 2:
                    cells[index].classList.add("food");
                    break;
                default:
                    break;
            }
        }
    }
}