const grid = document.querySelector(".grid");
const scoreDisplay = document.querySelector("#score"); 

const blockWidth = 100;
const blockHeight = 20; 
const boardWidth = 560;
const boardHeight = 300;
const ballDiameter = 20; 

let timerID = 0;
let xDirection = -2;
let yDirection = 2;
let leftKeyDown = false;
let rightKeyDown = false;

let leftInterval;
let rightInterval;

let score = 0;

const playerStart = [230, 10];
let currentPosition = playerStart;

const ballStart = [270, 40];
let ballCurrentPosition = ballStart;

// Create Block 
class Block {
    constructor(xAxis, yAxis) {
        this.bottomLeft = [xAxis, yAxis]
        this.bottomRight = [xAxis + blockWidth, yAxis]
        this.topLeft = [xAxis, yAxis + blockHeight]
        this.topRight = [xAxis + blockWidth, yAxis + blockHeight]
    } 
}

const blocks = [
    new Block(10,270),
    new Block(120,270),
    new Block(230,270),
    new Block(340,270),
    new Block(450,270),
    new Block(10,240),
    new Block(120,240),
    new Block(230,240),
    new Block(340,240),
    new Block(450,240),   
    new Block(10,210),
    new Block(120,210),
    new Block(230,210),
    new Block(340,210),
    new Block(450,210),
]

function addBlocks() {
   for (let i = 0; i < blocks.length; i++) {
        const block = document.createElement("div");
        block.classList.add("block");
        block.style.left = blocks[i].bottomLeft[0] + 'px';
        block.style.bottom = blocks[i].bottomLeft[1] + 'px';
        grid.appendChild(block); 
    }
}
addBlocks(); 

// add player
const player = document.createElement("div");
player.classList.add("player");
drawPlayer();
grid.appendChild(player);

function drawPlayer() {
    player.style.left = currentPosition[0] + 'px';
    player.style.bottom = currentPosition[1] + 'px';
}

// draw the ball
function drawTheBall() {
    ball.style.left = ballCurrentPosition[0] + 'px';
    ball.style.bottom = ballCurrentPosition[1] + 'px'; 
}

document.addEventListener('keydown', movePlayer);
document.addEventListener('keyup', stopPlayer);

function stopPlayer(event) {
    if (event.keyCode == 65) {
        clearInterval(leftInterval);
        leftKeyDown = false;
    }
    if (event.keyCode == 68) {
        clearInterval(rightInterval);
        rightKeyDown = false;
    }
}

function moveLeft() {
    if (currentPosition[0] > 0 && leftKeyDown) {
        currentPosition[0] -= 10;   
        drawPlayer();
    }
}

function moveRight() {
    if (currentPosition[0] < boardWidth - blockWidth && rightKeyDown) { 
        currentPosition[0] += 10; 
        drawPlayer();
    }
}

function movePlayer(event) {
    if (event.keyCode == 65 && !leftKeyDown) {
        leftKeyDown = true;
        leftInterval = setInterval(moveLeft, 25);
    }
    if (event.keyCode == 68 && !rightKeyDown) {
        rightKeyDown = true;
        rightInterval = setInterval(moveRight, 25);
    } 
}

// add ball 
const ball = document.createElement("div");
ball.classList.add("ball");
drawTheBall();
grid.appendChild(ball); 

function moveBall() { 
    ballCurrentPosition[0] += xDirection;
    ballCurrentPosition[1] += yDirection; 
    drawTheBall(); 
    checkForCollisions();
} 

timerID = setInterval(moveBall, 10); 

function checkForCollisions() {
    for (let i = 0; i < blocks.length; i++) {
        if (
            (ballCurrentPosition[0] > blocks[i].bottomLeft[0] && ballCurrentPosition[0] < blocks[i].bottomRight[0]) &&
            ((ballCurrentPosition[1] + ballDiameter) > blocks[i].bottomLeft[1] && ballCurrentPosition[1] < blocks[i].topLeft[1])
        ) {
            const allBlocks = Array.from(document.querySelectorAll(".block"));
            allBlocks[i].classList.remove("block")
            blocks.splice(i, 1)
            changeDirection() 
            score++ 
            scoreDisplay.innerHTML = score;

            if (blocks.length === 0) { 
                scoreDisplay.innerHTML = "you win!!";
                clearInterval(timerID);
                document.removeEventListener('keydown', movePlayer);
            }
        }
    }
    
    if (
        ballCurrentPosition[0] >= (boardWidth - ballDiameter) || 
        ballCurrentPosition[1] >= (boardHeight - ballDiameter) ||
        ballCurrentPosition[0] <= 0 
    ) { 
        changeDirection()
    }

    if (
        (ballCurrentPosition[0] > currentPosition[0] && ballCurrentPosition[0] < currentPosition[0] + blockWidth) &&
        (ballCurrentPosition[1] > currentPosition[1] && ballCurrentPosition[1] < currentPosition[1] + blockHeight)
    ) {
        changeDirection(); 
    }

    if (ballCurrentPosition[1] <= 0) {
        clearInterval(timerID); 
        scoreDisplay.innerHTML = "You lose!";
        document.removeEventListener("keydown", movePlayer);
    }
}

function changeDirection() { 
    if (xDirection === 2 && yDirection == 2) {
        yDirection = -2;
        return; 
    }
    
    if (xDirection === 2 && yDirection === -2) {
        xDirection = -2
        return; 
    }
    
    if(xDirection === -2 && yDirection === -2) {
        yDirection = 2;
        return;
    }

    if(xDirection === -2 && yDirection === 2) {
        xDirection = 2;
        return;
    }
}
