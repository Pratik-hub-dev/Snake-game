const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreText = document.getElementById("score");
const highScoreText = document.getElementById("highScore");
const levelText = document.getElementById("level");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const restartBtn = document.getElementById("restartBtn");

const box = 20;
const rows = canvas.width / box;

let snake;
let food;
let direction;
let score;
let level;
let speed;
let gameLoop;
let running = false;
let paused = false;

let highScore = localStorage.getItem("snakeHighScore") || 0;
highScoreText.textContent = highScore;

function initGame() {

    snake = [
        { x: 10 * box, y: 10 * box }
    ];

    direction = "RIGHT";
    score = 0;
    level = 1;
    speed = 140;

    scoreText.textContent = score;
    levelText.textContent = level;

    food = randomFood();
}

function randomFood() {

    let newFood;

    do {

        newFood = {
            x: Math.floor(Math.random() * rows) * box,
            y: Math.floor(Math.random() * rows) * box
        };

    } while (collision(newFood));

    return newFood;

}

document.addEventListener("keydown", changeDirection);

function changeDirection(e) {

    if (e.key === "ArrowUp" && direction !== "DOWN")
        direction = "UP";

    if (e.key === "ArrowDown" && direction !== "UP")
        direction = "DOWN";

    if (e.key === "ArrowLeft" && direction !== "RIGHT")
        direction = "LEFT";

    if (e.key === "ArrowRight" && direction !== "LEFT")
        direction = "RIGHT";

}

function collision(head) {

    // Skip the snake's head (index 0)
    for (let i = 1; i < snake.length; i++) {

        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }

    }

    return false;

}

function drawBoard() {

    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    snake.forEach((part, index) => {

        ctx.fillStyle = index === 0 ? "#00ff66" : "#00aa44";
        ctx.fillRect(part.x, part.y, box - 2, box - 2);

    });

}
function moveSnake() {

    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "UP") headY -= box;
    if (direction === "DOWN") headY += box;
    if (direction === "LEFT") headX -= box;
    if (direction === "RIGHT") headX += box;

    let newHead = { x: headX, y: headY };

    // Game Over
    if (
        headX < 0 ||
        headY < 0 ||
        headX >= canvas.width ||
        headY >= canvas.height ||
        collision(newHead)
    ) {

        clearInterval(gameLoop);
        running = false;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("snakeHighScore", highScore);
            highScoreText.textContent = highScore;
        }

        if (confirm("🐍 Game Over!\n\nScore: " + score + "\n\nPlay Again?")) {
            startGame();
        }

        return;
    }

    // Eat Food
    if (headX === food.x && headY === food.y) {

    score++;
    scoreText.textContent = score;

    food = randomFood();

    if (score % 5 === 0) {
        level++;
        levelText.textContent = level;

        speed = Math.max(50, speed - 10);

        clearInterval(gameLoop);
        gameLoop = setInterval(updateGame, speed);
    }

} else {
    snake.pop();
}

snake.unshift(newHead);

}

function updateGame() {

    drawBoard();
    moveSnake();

}

// Start Button
function startGame() {

    clearInterval(gameLoop);

    initGame();

    running = true;
    paused = false;

    pauseBtn.textContent = "⏸ Pause";

    gameLoop = setInterval(updateGame, speed);

}

// Pause Button
pauseBtn.onclick = function () {

    if (!running) return;

    if (!paused) {

        clearInterval(gameLoop);
        paused = true;
        pauseBtn.textContent = "▶ Resume";

    } else {

        gameLoop = setInterval(updateGame, speed);
        paused = false;
        pauseBtn.textContent = "⏸ Pause";

    }

};

// Restart Button
restartBtn.onclick = function () {

    startGame();

};

// Start Button
startBtn.onclick = function () {

    startGame();

};

initGame();
drawBoard();
function changeDirectionMobile(dir){

    if(dir==="UP" && direction!=="DOWN")
        direction="UP";

    if(dir==="DOWN" && direction!=="UP")
        direction="DOWN";

    if(dir==="LEFT" && direction!=="RIGHT")
        direction="LEFT";

    if(dir==="RIGHT" && direction!=="LEFT")
        direction="RIGHT";

}
