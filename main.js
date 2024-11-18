const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Paddle properties
const paddleHeight = 20;
const paddleWidth = 150;
let paddleX = (canvas.width - paddleWidth) / 2;
const paddleSpeed = 10;

// Ball properties
let ballX = Math.random() * (canvas.width - 2 * ballRadius) + ballRadius; // Random starting X position
let ballY = canvas.height - 50; // Start near the paddle
let ballSpeedX = 6; // Increased ball speed
let ballSpeedY = -6;
const ballRadius = 10;

// Brick properties
const brickPadding = 10;
const brickOffsetTop = 30;
const brickRowCount = 4;
const brickColumnCount = Math.floor((canvas.width + brickPadding) / (75 + brickPadding));
const brickWidth = (canvas.width - (brickColumnCount - 1) * brickPadding) / brickColumnCount;
const brickHeight = 30;

// Initialize the bricks
const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

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

// Draw paddle
function drawPaddle() {
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
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
        alert("GAME OVER");
        resetGame();
    }

    // Bounce off paddle
    if (ballY + ballRadius > canvas.height - paddleHeight &&
        ballX > paddleX && ballX < paddleX + paddleWidth) {
        ballSpeedY = -ballSpeedY;
    }
}

// Reset game
function resetGame() {
    ballX = Math.random() * (canvas.width - 2 * ballRadius) + ballRadius; // Random X position
    ballY = canvas.height - 50; // Near the paddle
    ballSpeedX = 6; // Reset speed
    ballSpeedY = -6;
    alert("Press OK to start again!");
}

// Draw bricks dynamically based on the new calculations
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (brickWidth + brickPadding);
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.fillStyle = "#0095dd";
                ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
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
                }
            }
        }
    }
}

// Main game loop
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    moveBall();
    movePaddle();
    collisionDetection();
    requestAnimationFrame(draw);
}

draw();