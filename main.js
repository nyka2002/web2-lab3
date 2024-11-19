const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const borderSize = 4;
canvas.width = window.innerWidth - borderSize;
canvas.height = window.innerHeight - borderSize;

// postavke palice
const paddleHeight = 30;
const paddleWidth = 150;
let paddleX = (canvas.width - paddleWidth) / 2;
const paddleSpeed = 10;

// postavke loptice
let ballX = canvas.width / 2;
let ballY = canvas.height - 50;
let ballSpeedX = (Math.random() * 4 + 2) * (Math.random() < 0.5 ? 1 : -1);
let ballSpeedY = -(Math.random() * 2 + 4);
const ballRadius = 10;
const ballColor = "#b3ebf2";

// postavke cigli
const brickPadding = 10;
const brickOffsetTop = 50;
const brickRowCount = 4;
const brickColumnCount = Math.floor((canvas.width + brickPadding) / (75 + brickPadding));
const brickWidth = (canvas.width - (brickColumnCount - 1) * brickPadding) / brickColumnCount;
const brickHeight = 30;

// inicijalizacija cigli
let bricks = [];
function resetBricks() {
    bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
}
resetBricks();

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;

// postavke upravljanja palicom
let rightPressed = false;
let leftPressed = false;
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") rightPressed = true;
    if (e.key === "ArrowLeft") leftPressed = true;
});
document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowRight") rightPressed = false;
    if (e.key === "ArrowLeft") leftPressed = false;
});

function drawPaddle() {
    ctx.save();
    ctx.shadowColor = "rgba(255, 0, 0, 1)";
    ctx.shadowBlur = 50;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.restore();
}

function movePaddle() {
    if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += paddleSpeed;
    if (leftPressed && paddleX > 0) paddleX -= paddleSpeed;
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
}

// postavke kretanja loptice
function moveBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // odbijanje od zidova
    if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
        ballSpeedX = -ballSpeedX;
    }

    // odbijanje od vrha
    if (ballY - ballRadius < 0) {
        ballSpeedY = -ballSpeedY;
    }

    // prekid igre pri doticaju dna
    if (ballY + ballRadius > canvas.height) {
        alert("GAME OVER!");
        updateHighScore();
        resetGame();
    }

    // odbijanje od palice
    if (ballY + ballRadius > canvas.height - paddleHeight &&
        ballX > paddleX && ballX < paddleX + paddleWidth) {
        ballSpeedY = -ballSpeedY;
    }
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (brickWidth + brickPadding);
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;

                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;

                ctx.save();
                ctx.shadowColor = "#aa4a44";
                ctx.shadowBlur = 10;
                ctx.shadowOffsetX = 3;
                ctx.shadowOffsetY = 3;
                ctx.fillStyle = "#aa4a44";
                ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
                ctx.restore();
            }
        }
    }
}

// detekcija sudara loptice s ciglama
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if (ballX > b.x && ballX < b.x + brickWidth &&
                    ballY > b.y && ballY < b.y + brickHeight) {
                    ballSpeedY = -ballSpeedY;
                    b.status = 0;
                    score++;
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "#9fd4a3";
    ctx.textAlign = "right";
    ctx.fillText(`score: ${score} | high score: ${highScore}`, canvas.width - 20, 40);
}

// provjera uništenja cigli, pobjeda ako su sve
function checkWinCondition() {
    let allBricksDestroyed = true;
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                allBricksDestroyed = false;
                break;
            }
        }
    }

    if (allBricksDestroyed) {
        alert("CONGRATULATIONS!");
        updateHighScore();
        resetGame();
    }
}

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
    }
}

function resetGame() {
    ballX = canvas.width / 2;
    ballY = canvas.height - 50;
    ballSpeedX = (Math.random() * 4 + 2) * (Math.random() < 0.5 ? 1 : -1);
    ballSpeedY = -(Math.random() * 2 + 4);
    resetBricks();
    score = 0;
}

// upravljanje veličinom Canvas-a
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth - borderSize;
    canvas.height = window.innerHeight - borderSize;
    resetBricks();
});

// main
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    moveBall();
    movePaddle();
    collisionDetection();
    checkWinCondition();
    requestAnimationFrame(draw);
}

draw();