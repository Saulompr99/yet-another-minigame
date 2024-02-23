const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const sqw = 17;
const sqh = 15;
const speed = 10;

var board = Array.from({ length: sqh }, () => Array(sqw).fill(0));

function drawScore() {
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.font = "bold " + canvas.width * 0.05 + "px serif";

    ctx.fillText('SCORE: ' + (snake.length - 4), canvas.width / 2, canvas.height / 2 - (canvas.width * 0.04));
}

function drawSquares() {
    for (let i = 0; i < sqh; i++) {
        for (let j = 0; j < sqw; j++) {
            if (board[i][j] != 0) {
                switch (board[i][j]) {
                    case -1:
                        // apple
                        ctx.fillStyle = "rgb(255 0 0)";
                        break;

                    default:
                        // body
                        ctx.fillStyle = "rgb(0 " + Math.floor(255 * board[i][j] / snake.length) +" 0)";
                        break;
                }
                ctx.fillRect(j * canvas.width / sqw, i * canvas.height / sqh, canvas.width / sqw, canvas.height / sqh);
            }
        }
    }
}

function drawGrid() {
    ctx.fillStyle = "rgb(0 0 0)";
    for (let i = 0; i <= sqw; i++) {
        ctx.strokeRect(i * canvas.width / sqw, 0, i * canvas.width / sqw, canvas.height);
    }

    for (let i = 0; i <= sqh; i++) {
        ctx.strokeRect(0, i * canvas.height / sqh, canvas.width, i * canvas.height / sqh);
    }
}

function adaptBoardResolution() {
    const windowWidth = window.innerWidth - 24;
    const windowHeight = window.innerHeight - 24;

    if (windowWidth / windowHeight < sqw / sqh) {
        canvas.width = windowWidth;
        canvas.height = windowWidth * sqh / sqw;
    } else {
        canvas.width = windowHeight * sqw / sqh;
        canvas.height = windowHeight;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawSquares();
    drawGrid();
    drawScore();

}

function moveSnake() {
    for (let i = 0; i < sqh; i++) {
        for (let j = 0; j < sqw; j++) {
            if (board[i][j] > 0) {
                board[i][j]--;
            }
        }
    }

    switch (snake.facing) {
        case 'up':
            board[snake.y - 1] && board[snake.y - 1][snake.x] < 1 ? snake.y-- : reset();
            break;

        case 'down':
            board[snake.y + 1] && board[snake.y + 1][snake.x] < 1 ? snake.y++ : reset();
            break;

        case 'left':
            board[snake.y][snake.x - 1] < 1 ? snake.x-- : reset();
            break;

        default:
            // right
            board[snake.y][snake.x + 1] < 1 ? snake.x++ : reset();
            break;
    }
    if (board[snake.y][snake.x] == -1) {
        eatApple();
    }

    board[snake.y][snake.x] = snake.length;
}

function eatApple() {
    snake.length++;
    const freeCells = [];
    for (let i = 0; i < sqh; i++) {
        freeCells.push(board[i].map((element, index) => element == 0 ? index : -1).filter(index => index !== -1));
    }

    y = Math.floor(Math.random() * sqh);

    while (!freeCells[y]) {
        y = Math.floor(Math.random() * sqh);
    }
    
    x = Math.floor(Math.random() * freeCells[y].length);
    board[y][freeCells[y][x]] = -1;
}

function reset() {
    board = Array.from({ length: sqh }, () => Array(sqw).fill(0));
    snake = { x: Math.floor(sqw / 2), y: Math.floor(sqh / 2), facing: 'right', length: 3 };
    eatApple();
}

var snake = { x: Math.floor(sqw / 2), y: Math.floor(sqh / 2), facing: 'right', length: 3 };
var score = 0;

var previousFrameTime = -Infinity;
var debugTime = new Date().getTime();
var count = 0;
var now;

adaptBoardResolution();
window.onresize = adaptBoardResolution;

function animate() {
    now = new Date().getTime();

    // count fps
    count++;
    if (now - debugTime > 1000) {
        console.log('fps: ' + count);
        count = 0;
        debugTime = now;
    }

    if (now - previousFrameTime > 1000 / speed) {
        previousFrameTime = now;
        moveSnake();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSquares();
    drawGrid();
    drawScore();

    window.requestAnimationFrame(animate);
}

window.requestAnimationFrame(animate);
eatApple();
window.addEventListener("keydown", (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (snake.facing != 'down') {
                snake.facing = 'up';
            }
            break;

        case 'ArrowDown':
            if (snake.facing != 'up') {
                snake.facing = 'down';
            }
            break;

        case 'ArrowLeft':
            if (snake.facing != 'right') {
                snake.facing = 'left';
            }
            break;

        case 'ArrowRight':
            if (snake.facing != 'left') {
                snake.facing = 'right';
            }
            break;
    }
});