// looks for the HTML class of grid and assigns it to the varaible 'grid'.
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

let score = 0;

const playerStart = [230, 10];
let currentPosition = playerStart;

const ballStart = [270, 40];
let ballCurrentPosition = ballStart;

// Create Block 
// Classes can be used as blueprints to create objects
//Constructors: The constructor method is a special method: It has to have the exact name "constructor", It is executed automatically when a new object is created
//It is used to initialize object properties

//class block creates the layout of the block, it draws the shape based on where the corners are going to be.
class Block {
    constructor(xAxis, yAxis) {
        //bottomLeft serves as the anchor point
        //block width an block height are global variables declared at the top of the code sheet.
        this.bottomLeft = [xAxis, yAxis]
        this.bottomRight = [xAxis + blockWidth, yAxis]
        this.topLeft = [xAxis, yAxis + blockHeight]
        this.topRight = [xAxis + blockWidth, yAxis + blockHeight]
    } 
}

//all the blocks, this uses the class of 'Block' and assigns a position to them, numbers in yellow are (xAxis, yAxis)
// use ctrl + d to select all values that are the same beneath the current value for quick chaging!
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

// console.log(blocks[0])

// this function draws the blocks onto the screen.
function addBlocks() {
   for (let i = 0; i < blocks.length; i++) {

//creates a const which creates a div when called. 
const block = document.createElement("div");
// adds the class of bloc to the block variable (makes it a blue box!)
//.classList - Adds a "myStyle" class to an element. 
block.classList.add("block");

//places the blocks on screen as it itterates through the conts blocks array. 
block.style.left = blocks[i].bottomLeft[0] + 'px';
block.style.bottom = blocks[i].bottomLeft[1] + 'px';
//append child adds the element in the paretheses into the target element (in this case 'grid')
grid.appendChild(block); 
    }
}
addBlocks(); 

// add player
const player = document.createElement("div");
player.classList.add("player");
drawPlayer();
//adds the player to the div 'grid' on the HTML page 
grid.appendChild(player);

//drawUser
function drawPlayer() {
    player.style.left = currentPosition[0] + 'px';
    player.style.bottom = currentPosition[1] + 'px';
}

// draw the ball
    function drawTheBall() {
        ball.style.left = ballCurrentPosition[0] + 'px';
        ball.style.bottom = ballCurrentPosition[1] + 'px'; 
    }

//move player 
//My original move function. Very sticky and unresponsive!

// creates as listener for keydown, then calls the movePlayer function.
document.addEventListener('keydown', movePlayer);
document.addEventListener('keyup', stopPlayer);

function stopPlayer () {
    leftKeyDown = false;
    rightKeyDown = false;
    console.log("Key Up");
    currentPosition[0] += 0;
    drawPlayer();
}


function moveLeft (){
  
    if (currentPosition[0] > 0 && leftKeyDown == true) {
        currentPosition[0] -= 10;   
        drawPlayer();
        setTimeout(moveLeft, 20);

        //console.log("player moved left");
    } else {
        stopPlayer();
    }
}

function moveRight (){
       
    if (currentPosition[0] < boardWidth - blockWidth && rightKeyDown == true) { 
        currentPosition[0] += 10; 
        drawPlayer();
        setTimeout(moveRight, 20);
        //console.log("player moved left");
    } else {
        stopPlayer();
    }
}

function movePlayer(event) {
    if (event.keyCode == 65) {
        leftKeyDown = true;
        moveLeft();       
    }
    if (event.keyCode == 68) {
        rightKeyDown = true;
        moveRight();
        
    } 
}

// function movePlayer(e) {d    
//     switch(e.key) {
//         case 'ArrowLeft': 
//         case 'a':
            // if (currentPosition[0] > 0) {
            //     currentPosition[0] -= 10;   
            //     drawPlayer();
            //     //console.log("player moved left");
// }

//         case 'ArrowRight': 
//         case 'd':    
//             if (currentPosition[0] < boardWidth - blockWidth) { 
//                 currentPosition[0] += 10; 
//                 drawPlayer();
//                 //console.log("player moved right");
//             }           
//             break;
//     }
// }



// add ball 
const ball = document.createElement("div");
ball.classList.add("ball");
drawTheBall();
grid.appendChild(ball); 

// move ball 

function moveBall () { 
    //X axis
    ballCurrentPosition[0] += xDirection;
    //Y axis
    ballCurrentPosition[1] += yDirection; 
    drawTheBall(); 
    checkForCollisions();
} 

// timer interval sets speed
timerID = setInterval(moveBall, 10); 


function checkForCollisions () {
    // check for block collisions 
    for (let i = 0; i < blocks.length; i++) {
        if (
            (ballCurrentPosition[0] > blocks[i].bottomLeft[0] && ballCurrentPosition[0] < blocks[i].bottomRight[0]) &&
            ((ballCurrentPosition[1] + ballDiameter) > blocks[i].bottomLeft[1] && ballCurrentPosition[1] < blocks[i].topLeft[1])
        ) {
            const allBlocks = Array.from(document.querySelectorAll(".block"));
            console.log(allBlocks); 

            allBlocks[i].classList.remove("block")
            //splice used to remove the item from the array
            blocks.splice(i, 1)
            changeDirection() 
            score++ 
            scoreDisplay.innerHTML = score;


            //check for win 

            if (blocks.length === 0) { 
                scoreDisplay.innerHTML = "you win!!";
                clearInterval(timerID);
                document.removeEventListener('keydown', movePlayer);
            }

        }
    }
    
    //check for wall collisions 
if (
    ballCurrentPosition [0] >= (boardWidth - ballDiameter) || 
    ballCurrentPosition[1] >= (boardHeight - ballDiameter) ||
    ballCurrentPosition[0] <= 0 
    ) 
{ 
    changeDirection()
}

// check for user collisions

if (
    (ballCurrentPosition[0] > currentPosition[0] && ballCurrentPosition[0] < currentPosition[0] + blockWidth) &&
    (ballCurrentPosition[1] > currentPosition[1] && ballCurrentPosition[1] < currentPosition[1] + blockHeight)
    ) 
    {
        changeDirection(); 
    }

// check for game over
    if (ballCurrentPosition[1] <=0) {
        clearInterval(timerID); 
        scoreDisplay.innerHTML = "You lose!";
        //stops you being able to move the user
        document.removeEventListener("keydown");
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