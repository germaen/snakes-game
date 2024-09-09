const gameBoard = document.querySelector('#board');
console.log(gameBoard);

const ctx = gameBoard.getContext("2d");

const pointsTally = document.querySelector('#points');
console.log(pointsTally)

const clearBtn = document.querySelector('#clear');
console.log(clearBtn)

const boardWidth = gameBoard.width;
const boardHeight = gameBoard.height;

const unitSize = 25;
const boardBckg = 'white';
const snakeColor = 'blue';
const snakeBorder = 'white';
const foodColor = 'red';

let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX, foodY;
let score = 0;

let snake = createInitialSnake();

window.addEventListener('keydown', changeDirection);
clearBtn.addEventListener('click', resetGame);

gameStart();

function createInitialSnake() {
    return [
        {x: unitSize * 4, y: 0},
        {x: unitSize * 3, y: 0},
        {x: unitSize * 2, y: 0},
        {x: unitSize, y: 0},
        {x: 0, y: 0}
    ];
}

function gameStart() {
    running = true;
    pointsTally.textContent = score;
    createFood();
    nextTick();
}

function nextTick() {
    if (running) {
        setTimeout(() => {
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 80);
    } else {
        displayGameOver();
    }
}

function clearBoard() {
    ctx.fillStyle = boardBckg;
    ctx.fillRect(0, 0, boardWidth, boardHeight);
}

// Randomize food position
function createFood() {
    foodX = randomCoordinate(boardWidth);
    foodY = randomCoordinate(boardHeight);
}

function randomCoordinate(max) {
    return Math.round((Math.random() * (max - unitSize)) / unitSize) * unitSize;
}

// Food
function drawFood() {
    drawRectangle(foodX, foodY, unitSize, foodColor);
}


function moveSnake() {
    const head = {x: snake[0].x + xVelocity, y: snake[0].y + yVelocity};
    snake.unshift(head);
    
    if (snake[0].x === foodX && snake[0].y === foodY) {
        score++;
        pointsTally.textContent = score;
        createFood();
    } else {
        snake.pop(); 
    }
}

function drawSnake() {
    snake.forEach(snakePart => drawRectangle(snakePart.x, snakePart.y, unitSize, snakeColor, snakeBorder));
}

function drawRectangle(x, y, size, fillColor, borderColor = null) {
    ctx.fillStyle = fillColor;
    ctx.fillRect(x, y, size, size);
    
    if (borderColor) {
        ctx.strokeStyle = borderColor;
        ctx.strokeRect(x, y, size, size);
    }
}

//Key Press (Direction)
function changeDirection(event) {
    const LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;
    const goingUp = yVelocity === -unitSize;
    const goingDown = yVelocity === unitSize;
    const goingRight = xVelocity === unitSize;
    const goingLeft = xVelocity === -unitSize;

    switch(event.keyCode) {
        case LEFT:
            if (!goingRight) { xVelocity = -unitSize; yVelocity = 0; }
            break;
        case UP:
            if (!goingDown) { xVelocity = 0; yVelocity = -unitSize; }
            break;
        case RIGHT:
            if (!goingLeft) { xVelocity = unitSize; yVelocity = 0; }
            break;
        case DOWN:
            if (!goingUp) { xVelocity = 0; yVelocity = unitSize; }
            break;
    }
}

//Acknowledgement: ChatGPT and StackOverflow helped me with adding conditions (if the snake hits itself or if it collides on the wall)

function checkGameOver() {
    if (snake[0].x < 0 || snake[0].x >= boardWidth || snake[0].y < 0 || snake[0].y >= boardHeight) {
        running = false;
    }

    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            running = false;
        }
    }
}

function displayGameOver() {
    ctx.font = "bold 50px Helvetica";
    ctx.fillStyle = "blue";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!", boardWidth / 2, boardHeight / 2);
}


function resetGame() {
    score = 0;
    xVelocity = unitSize;
    yVelocity = 0;
    snake = createInitialSnake();
    gameStart();
}


// Game Inspiration: from Udemy JS Bootcamp Challenge