const grid = document.querySelector(".grid");
const scoreDisplay = document.querySelector("#score");

const blockWidth = 100;
const blockHeight = 20;
const boardWidth = 560;
const boardHeight = 300;
const ballDiameter = 20;

let timerID;  //takes the ball speed and movement and wraps it in a setInterval()
let xDirection = -2;
let yDirection = 2;
let leftKeyDown = false;
let rightKeyDown = false;

let leftInterval; //setInterval values for the movement (makes smooth movement for the player)
let rightInterval;

let score = 0;
// set speeds 
let ballSpeed = 10;
let playerSpeed = 10;

const playerStart = [230, 10];
let currentPosition = playerStart;

const ballStart = [270, 40]; //sets start point for ball, the first value is the x axis 
let ballCurrentPosition = ballStart;

// Creates a Block class that xAxis and yAxis can be passed into to define the blocks size 
class Block {
    constructor(xAxis, yAxis) {
        this.bottomLeft = [xAxis, yAxis]
        this.bottomRight = [xAxis + blockWidth, yAxis]
        this.topLeft = [xAxis, yAxis + blockHeight]
        this.topRight = [xAxis + blockWidth, yAxis + blockHeight]
    }
}

//creates an array, each new Block creates a block using the block class and defines the co-ordinates
const blocks = [
    new Block(10, 270),
    new Block(120, 270),
    new Block(230, 270),
    new Block(340, 270),
    new Block(450, 270),
    //row 2
    new Block(10, 240),
    new Block(120, 240),
    new Block(230, 240),
    new Block(340, 240),
    new Block(450, 240),
    //row 3
    new Block(10, 210),
    new Block(120, 210),
    new Block(230, 210),
    new Block(340, 210),
    new Block(450, 210),

]

//addBlocks function takes the blocks array and creates a div (e.g. a block) for each block in the array
function addBlocks() {
    for (let i = 0; i < blocks.length; i++) {
        const block = document.createElement("div");
        block.classList.add("block"); // this adds a CSS class for the block element, in turn the .block CSS is then applied to each block with this class
        block.style.left = blocks[i].bottomLeft[0] + 'px';
        block.style.bottom = blocks[i].bottomLeft[1] + 'px';
        //appends a block, this process is in a for loop so goes back to the start of this function until all the blocks are placed. 
        grid.appendChild(block);
    }
}
addBlocks();

// add player
const player = document.createElement("div");
player.classList.add("player");
drawPlayer();
grid.appendChild(player);

// draws the player
function drawPlayer() {
    player.style.left = currentPosition[0] + 'px';
    player.style.bottom = currentPosition[1] + 'px';
}

// draw the ball
function drawTheBall() {
    ball.style.left = ballCurrentPosition[0] + 'px';
    ball.style.bottom = ballCurrentPosition[1] + 'px';
}

//listens for keydown and keyup events
document.addEventListener('keydown', movePlayer);
document.addEventListener('keyup', stopPlayer);

//stops the player on keyup event
function stopPlayer(event) {
    if (event.keyCode == 65) {
        clearInterval(leftInterval); //The clearInterval method clears a timer set with the setInterval() method.
        leftKeyDown = false;
    }
    if (event.keyCode == 68) {
        clearInterval(rightInterval);
        rightKeyDown = false;
    }
}

function moveLeft() {
    if (currentPosition[0] > 0 && leftKeyDown) {
        currentPosition[0] -= playerSpeed;
        drawPlayer();
    }
}

function moveRight() {
    if (currentPosition[0] < boardWidth - blockWidth && rightKeyDown) {
        currentPosition[0] += playerSpeed;
        drawPlayer();
    }
}

function movePlayer(event) {
    if (event.keyCode == 65 && !leftKeyDown) {
        leftKeyDown = true;
        // The setInterval() method calls a function at specified intervals (in milliseconds), until clearInterval() is called or the window is closed.
        // setInterval() differs from setTimeout() in that setTimeout() is called only once, If you need repeated executions, use setInterval() instead.
        leftInterval = setInterval(moveLeft, 25); 
    }
    if (event.keyCode == 68 && !rightKeyDown) {
        rightKeyDown = true;
        rightInterval = setInterval(moveRight, 25);
    }
}

// add ball 
const ball = document.createElement("div");
ball.classList.add("ball"); //adds the CSS to the const ball
drawTheBall();
grid.appendChild(ball); //adds the ball to the grid (which is the main container element)

// moves the ball and re-draws it, checks for collisions. 
function moveBall() {
    ballCurrentPosition[0] += xDirection;
    ballCurrentPosition[1] += yDirection;
    drawTheBall();
    checkForCollisions();
}

//
timerID = setInterval(moveBall, ballSpeed);

// checks for collisions with the blocks
function checkForCollisions() {
    for (let i = 0; i < blocks.length; i++) {
        if (
            (ballCurrentPosition[0] > blocks[i].bottomLeft[0] && ballCurrentPosition[0] < blocks[i].bottomRight[0]) &&
            ((ballCurrentPosition[1] + ballDiameter) > blocks[i].bottomLeft[1] && ballCurrentPosition[1] < blocks[i].topLeft[1])
        ) {
            const allBlocks = Array.from(document.querySelectorAll(".block"));
            allBlocks[i].classList.remove("block")
            blocks.splice(i, 1) // Splice: Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements
            // if contact has been made it changes the ball direction
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

    //checks to see if the ball has hit the baseline, in which case you lose! 
    if (ballCurrentPosition[1] <= 0) {
        clearInterval(timerID);
        document.removeEventListener("keydown", movePlayer);
        if (confirm("You Lose!" + "\n" + "Final score = " + score + "\n" + "Do you want to play again? Ok or Cancel")) {
            // location.reload re-loads the page from the server. 
            location.reload();
        }
        else {
            scoreDisplay.innerHTML = "You lose!";
            alert("No worries, better luck next time");
            stopPlayer();
        }
    }
}

// takes care of the ball changing direction
function changeDirection() {
    if (xDirection === 2 && yDirection == 2) {
        yDirection = -2;
        return;
    }

    if (xDirection === 2 && yDirection === -2) {
        xDirection = -2
        return;
    }

    if (xDirection === -2 && yDirection === -2) {
        yDirection = 2;
        return;
    }

    if (xDirection === -2 && yDirection === 2) {
        xDirection = 2;
        return;
    }
}


