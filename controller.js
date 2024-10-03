import * as model from "./model.js";
import * as view from "./view.js";

let GRID_HEIGHT;
let GRID_WIDTH;
let gameGrid;
let isFoodPresent = false;
let snake;
let direction = "left";
let foodLocation = { row: 0, col: 0 };
let isGameOver = false;

init();

function init() {
    // set grid size
    GRID_HEIGHT = document.querySelector("#grid-height-input").value;
    GRID_WIDTH = document.querySelector("#grid-width-input").value;

    //create initial grid
    view.createVisualGrid(GRID_HEIGHT, GRID_WIDTH);

    // add eventlisteners
    document.querySelector("#start-btn").addEventListener("click", startGame);
    document.querySelector("#start-btn").disabled = false;
    document.querySelector("#reset-btn").addEventListener("click", resetGame);
    document.querySelector("#reset-btn").disabled = true;

    document.querySelector("#grid-height-input").disabled = false;
    document.querySelector("#grid-width-input").disabled = false;
    document.querySelector("#grid-height-input").addEventListener("change", resizeGrid);
    document.querySelector("#grid-width-input").addEventListener("change", resizeGrid);

    document.addEventListener("keydown", keyPress);

    // reset game
    isGameOver = false;
    isFoodPresent = false;
    direction = "left"; // so that the snake does not collide with itself at game start
}

function startGame() {
    document.querySelector("#start-btn").disabled = true;
    document.querySelector("#grid-height-input").disabled = true;
    document.querySelector("#grid-width-input").disabled = true;

    // create model & view grid
    gameGrid = model.createGrid(GRID_HEIGHT, GRID_WIDTH, 0);
    view.createVisualGrid(GRID_HEIGHT, GRID_WIDTH);

    // create initial snake/queue
    snake = model.createQueue();
    snake.enqueue({ row: Math.floor(GRID_HEIGHT / 2), col: Math.floor(GRID_WIDTH / 2) + 2 });
    snake.enqueue({ row: Math.floor(GRID_HEIGHT / 2), col: Math.floor(GRID_WIDTH / 2) + 1 });
    snake.enqueue({ row: Math.floor(GRID_HEIGHT / 2), col: Math.floor(GRID_WIDTH / 2) });

    // scroll to bottom of page to see the gamegrid
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
    });

    // first tick
    tick();
}

function tick() {
    // if game is over then tick should not run
    if (isGameOver) return;

    setTimeout(tick, 120);

    // remove the snake
    for (const part of snake) {
        gameGrid.set(part.row, part.col, 0);
    }

    // the visual snake head is the tail of the snake queue
    const snakeHead = {
        row: snake.tail.data.row,
        col: snake.tail.data.col,
    };

    // string cases decides where the new snakeHead goes
    switch (direction) {
        case "left":
            snakeHead.col--;
            if (snakeHead.col < 0) {
                snakeHead.col = gameGrid.cols - 1;
            }
            break;
        case "right":
            snakeHead.col++;
            if (snakeHead.col > gameGrid.cols - 1) {
                snakeHead.col = 0;
            }
            break;
        case "up":
            snakeHead.row--;
            if (snakeHead.row < 0) {
                snakeHead.row = gameGrid.rows - 1;
            }
            break;
        case "down":
            snakeHead.row++;
            if (snakeHead.row > gameGrid.rows - 1) {
                snakeHead.row = 0;
            }
            break;
        default:
            break;
    }

    // check for self collision
    for (const part of snake) {
        if (snakeHead.row === part.row && snakeHead.col === part.col) {
            gameOver();
        }
    }

    snake.enqueue(snakeHead); // add the new head to the tail of the queue/snake
    snake.dequeue(); // remove the head(tail of the visual snake) of the queue/snake

    checkFoodCollision(snakeHead);
    
    // re-add the snake
    for (const part of snake) {
        gameGrid.set(part.row, part.col, 1);
    }
    
    addFood();
    
    view.updateVisualGrid(gameGrid);
}

function keyPress(e) {
    // case key pressed then set direction
    switch (e.key) {
        case "ArrowLeft":
        case "a":
            if (direction !== "right") {
                direction = "left";
            }
            break;
        case "ArrowRight":
        case "d":
            if (direction !== "left") {
                direction = "right";
            }
            break;
        case "ArrowUp":
        case "w":
            if (direction !== "down") {
                direction = "up";
            }
            break;
        case "ArrowDown":
        case "s":
            if (direction !== "up") {
                direction = "down";
            }
            break;
    }
}

function addFood() {
    // if no food is present then find a location for the food
    if (!isFoodPresent) {
        foodLocation = {
            row: Math.floor(Math.random() * GRID_HEIGHT),
            col: Math.floor(Math.random() * GRID_WIDTH),
        };

        // retriving value of the new food location from the grid(model)
        const foodLocationValue = gameGrid.get(foodLocation.row, foodLocation.col);

        console.log("Attempting to place food at: ", foodLocation, "Current value at location: ", foodLocationValue);

        // if the new food location does not have the value of 1 then the location is not part of the snake and food can be placed
        if (foodLocationValue != 1) {
            console.log("food placed at: ", foodLocation, foodLocationValue);
            gameGrid.set(foodLocation.row, foodLocation.col, 2);
        } else {
            console.log("food placement failed at: ", foodLocation, foodLocationValue);
        }

        view.updateVisualGrid(gameGrid);

        isFoodPresent = true;
    }
}

function checkFoodCollision(snakeHead) {
    // if snakeHead and foodLocation is the same then remove the food and add the snakeHead to the snake
    if (snakeHead.row === foodLocation.row && snakeHead.col === foodLocation.col) {
        gameGrid.set(foodLocation.row, foodLocation.col, 0);
        snake.enqueue(foodLocation);
        // console.log("food eaten");

        setTimeout(() => {
            isFoodPresent = false;
        }, 2000);
    }
}

function resizeGrid() {
    GRID_HEIGHT = document.querySelector("#grid-height-input").value;
    GRID_WIDTH = document.querySelector("#grid-width-input").value;
}

function gameOver() {
    isGameOver = true;
    document.querySelector("#game-over").classList.remove("hidden");
    document.querySelector("#reset-btn").disabled = false;
}

function resetGame() {
    document.querySelector("#game-over").classList.add("hidden");
    document.querySelector("#start-btn").disabled = false;
    document.querySelector("#reset-btn").disabled = true;
    init();
}
