import * as model from "./model.js";
import * as view from "./view.js";

let GRID_HEIGHT;
let GRID_WIDTH;
let gameGrid;
let isFoodPresent = false;
let snake;
let direction = "left";
let foodLocationRow;
let foodLocationCol;
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

    document.querySelector("#grid-height-input").addEventListener("change", resizeGrid);
    document.querySelector("#grid-width-input").addEventListener("change", resizeGrid);

    document.addEventListener("keydown", keyPress);

    isGameOver = false;
    console.log("gameover when init is: ", isGameOver);
}

function startGame() {
    document.querySelector("#start-btn").disabled = true;

    // create grid
    gameGrid = model.createGrid(GRID_HEIGHT, GRID_WIDTH, 0);
    view.createVisualGrid(GRID_HEIGHT, GRID_WIDTH);
    console.table(gameGrid.grid);

    // create initial snake/queue
    snake = model.createQueue();
    snake.enqueue({ row: Math.floor(GRID_HEIGHT / 2), col: Math.floor(GRID_WIDTH / 2) + 2 });
    snake.enqueue({ row: Math.floor(GRID_HEIGHT / 2), col: Math.floor(GRID_WIDTH / 2) + 1 });
    snake.enqueue({ row: Math.floor(GRID_HEIGHT / 2), col: Math.floor(GRID_WIDTH / 2) });
    // console.log(snake);

    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
    });

    isGameOver = false;

    tick();
}

function tick() {
    if (isGameOver) return;

    setTimeout(tick, 120);

    // remove the snake
    for (const part of snake) {
        gameGrid.set(part.row, part.col, 0);
    }

    // set the head of the snake to be the tail of the snake queue
    // in a normal perception of a queue, after the head/first in queue is removed, the rest of the line moves up...
    // but in this case the rest of the line stands still and the head(of the visual snake) is re-added to the end of the line
    // thus the snakes direction can be percieved as opposite of the queue
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

    checkFoodCollision();

    // re-add the snake
    for (const part of snake) {
        gameGrid.set(part.row, part.col, 1);
    }

    addFood();

    view.updateVisualGrid(gameGrid);
    // console.table(gameGrid.grid)
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
    if (!isFoodPresent) {
        foodLocationRow = Math.floor(Math.random() * GRID_HEIGHT);
        foodLocationCol = Math.floor(Math.random() * GRID_WIDTH);

        // retriving the value of the new food location
        const foodLocationValue = gameGrid.get(foodLocationRow, foodLocationRow);

        // if the new food location does not have the value of 1 then the location is not part of the snake and food can be placed
        if (foodLocationValue != 1) {
            gameGrid.set(foodLocationRow, foodLocationCol, 2);
        }

        isFoodPresent = true;
    }
}

function checkFoodCollision() {
    if (snake.tail.data.row === foodLocationRow && snake.tail.data.col === foodLocationCol) {
        gameGrid.set(foodLocationRow, foodLocationCol, 0);
        snake.enqueue({ row: foodLocationRow, col: foodLocationCol });

        setTimeout(() => {
            isFoodPresent = false;
        }, 3000);
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
