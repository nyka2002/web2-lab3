const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Paddle properties
const paddleHeight = 30;
const paddleWidth = 150;
let paddleX = (canvas.width - paddleWidth) / 2;
const paddleSpeed = 10;

// Ball properties
let ballX = canvas.width / 2;
let ballY = canvas.height - 50;
let ballSpeedX = (Math.random() * 4 + 2) * (Math.random() < 0.5 ? 1 : -1);
let ballSpeedY = -(Math.random() * 2 + 4);
const ballRadius = 10;

// Brick properties
const brickPadding = 10;
const brickOffsetTop = 60; // Increased offset for score space
const brickRowCount = 4;
const brickColumnCount = Math.floor((canvas.width + brickPadding) / (75 + brickPadding));
const brickWidth = (canvas.width - (brickColumnCount - 1) * brickPadding) / brickColumnCount;
const brickHeight = 30;

// Initialize the bricks
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

// Score variable
let score = 0;

// Paddle controls
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

// Draw paddle with shadow
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

// Move paddle
function movePaddle() {
    if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += paddleSpeed;
    if (leftPressed && paddleX > 0) paddleX -= paddleSpeed;
}

// Draw ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095dd";
    ctx.fill();
    ctx.closePath();
}

// Move ball
function moveBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Bounce off walls
    if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
        ballSpeedX = -ballSpeedX;
    }

    // Bounce off the top
    if (ballY - ballRadius < 0) {
        ballSpeedY = -ballSpeedY;
    }

    // Game over if ball touches the bottom
    if (ballY + ballRadius > canvas.height) {
        alert("GAME OVER!");
        resetGame();
    }

    // Bounce off paddle
    if (ballY + ballRadius > canvas.height - paddleHeight &&
        ballX > paddleX && ballX < paddleX + paddleWidth) {
        ballSpeedY = -ballSpeedY;
    }
}

// Draw bricks dynamically with shadow
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

// Collision detection for bricks
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if (ballX > b.x && ballX < b.x + brickWidth &&
                    ballY > b.y && ballY < b.y + brickHeight) {
                    ballSpeedY = -ballSpeedY;
                    b.status = 0;
                    score++; // Increment score
                }
            }
        }
    }
}

// Draw score in the top-right corner
function drawScore() {
    ctx.font = "24px Arial";
    ctx.fillStyle = "#0095dd";
    ctx.textAlign = "right";
    ctx.fillText(`Score: ${score}`, canvas.width - 20, 40);
}

// Check if all bricks are destroyed
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
        resetGame();
    }
}

// Reset game state
function resetGame() {
    ballX = canvas.width / 2;
    ballY = canvas.height - 50;
    ballSpeedX = (Math.random() * 4 + 2) * (Math.random() < 0.5 ? 1 : -1);
    ballSpeedY = -(Math.random() * 2 + 4);
    resetBricks();
    score = 0; // Reset score
}

// Main game loop
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore(); // Draw score
    moveBall();
    movePaddle();
    collisionDetection();
    checkWinCondition();
    requestAnimationFrame(draw);
}

draw();