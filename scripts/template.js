const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const sqw = 17;
const sqh = 15;
const speed = 4;

var board = Array.from({ length: sqh }, () => Array(sqw).fill(0));

function drawSquares() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < sqh; i++) {
        for (let j = 0; j < sqw; j++) {
            if(board[i][j] != 0) {
                board[i][j] == 1 ? ctx.fillStyle = "rgb(0 0 0)" : ctx.fillStyle = "rgb(255 255 255)";
                ctx.fillRect(j * canvas.width / sqw, i * canvas.height / sqh, canvas.width / sqw, canvas.height / sqh);
            }
        }
    }
}

function drawGrid() {
    ctx.fillStyle = "rgb(0 0 0)";
    for(let i = 0; i <= sqw; i++) {
        ctx.strokeRect(i * canvas.width / sqw, 0, i * canvas.width / sqw, canvas.height);
    }

    for(let i = 0; i <= sqh; i++) {
        ctx.strokeRect(0, i * canvas.height / sqh, canvas.width, i * canvas.height / sqh);
    }
}

function adaptBoardResolution() {
    const windowWidth = window.innerWidth - 24;
    const windowHeight = window.innerHeight - 24;

    if(windowWidth / windowHeight < sqw/sqh) {
        canvas.width = windowWidth;
        canvas.height = windowWidth * sqh/sqw;
    } else {
        canvas.width = windowHeight * sqw/sqh;
        canvas.height = windowHeight;
    }
    drawSquares();
    drawGrid();
}

function moveSquare() {
    board[currentsq.y][currentsq.x] = 0;
    if(board[currentsq.y][currentsq.x + 1] == 0) {
        currentsq.x++;
    } else if(board[currentsq.y][currentsq.x + 1] == undefined) {
        if(board[currentsq.y + 1] != undefined && board[currentsq.y + 1][0] == 0) {
            currentsq.x = 0;
            currentsq.y++;
        } else {
            board[currentsq.y][currentsq.x] = currentsq.color;
            currentsq.x = 0;
            currentsq.y = 0;
            currentsq.color == 1 ? currentsq.color = 2 : currentsq.color = 1;
        }
    } else {
        board[currentsq.y][currentsq.x] = currentsq.color;
        currentsq.x = 0;
        currentsq.y = 0;
        currentsq.color == 1 ? currentsq.color = 2 : currentsq.color = 1;
    }

    board[currentsq.y][currentsq.x] = currentsq.color;
}

function pushSquares() {
    outer: for (let i = 0; i < sqh; i++) {
        for (let j = 0; j < sqw; j++) {
            if(board[i][j] != 0) {
                board[i].unshift(0);
                for(let k = i; k < sqh - 1; k++) {
                    board[k + 1].unshift(board[k].pop());
                }
                board[sqh - 1].pop()
                break outer;
            }
        }
    }
}

// function drawChessBackground() {
//     for (let i = 0; i < sqh; i++) {
//         for (let j = 0; j < sqw; j++) {
//             (i + j) % 2 == 0 ? ctx.fillStyle = "rgb(0 0 0)" : ctx.fillStyle = "rgb(255 255 255)";
//             ctx.fillRect(j * canvas.width / sqw, i * canvas.height / sqh, canvas.width / sqw, canvas.height / sqh);
//         }
//     }
// }

// drawChessBackground();

var currentsq = {x: -1, y: 0, color: 1};
var previousFrameTime = -Infinity;
var debugTime = new Date().getTime();
var count = 0;
var now;
var emptying = false;

adaptBoardResolution();
window.onresize = adaptBoardResolution;

function animate() {
    now = new Date().getTime();

    // count fps
    count++;
    if(now - debugTime > 1000) {
        console.log('fps: ' + count);
        count = 0;
        debugTime = now;
    }
    if(now - previousFrameTime > 1000 / speed) {
        previousFrameTime = now;
        if(!emptying) {
                moveSquare();
                if (board[0][0] != 0 && board[0][1] != 0) {
                    emptying = true;
                }
        } else if(board[sqh - 1][sqw - 1] != 0) {
            pushSquares();
        } else {
            emptying = false;
            board[0][0] = currentsq.color;
        }
    }
    drawSquares();
    drawGrid();
    window.requestAnimationFrame(animate);
}

window.requestAnimationFrame(animate);
