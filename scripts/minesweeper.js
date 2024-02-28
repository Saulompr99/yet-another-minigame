const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
let sqw = 9;
let sqh = 9;
let bombs = 10;
let gameMode;
let previousFrameTime = -Infinity;
let debugTime = new Date().getTime();
let count = 0;
let now;
let mousex = 0;
let mousey = 0;
let hoveredCellx = 0;
let hoveredCelly = 0;
let elapsedTime = 0;
let isGameStarted = false;

chooseMode();

let mineBoard = Array.from({ length: sqh }, () => Array(sqw).fill(0));
let overBoard = Array.from({ length: sqh }, () => Array(sqw).fill(1));

const colors = [
    "hsl(240 100% 50%)",
    "hsl(120 100% 50%)",
    "hsl(60 100% 50%)",
    "hsl(270 100% 50%)",
    "hsl(0 100% 50%)",
    "hsl(330 100% 50%)",
    "hsl(30 100% 50%)",
    "hsl(0 100% 0%)"
];


function chooseMode() {
    gameMode = prompt("Select mode: 1-Beginner 2-Intermediate 3-Expert", gameMode);

    while (!Number(gameMode) || gameMode < 0 || gameMode > 3) {
        gameMode = prompt("Select mode: 1-Beginner 2-Intermediate 3-Expert", "");
    }

    switch (gameMode) {
        case "1":
            sqw = 9;
            sqh = 9;
            bombs = 10;
            break;
    
        case "2":
            sqw = 16;
            sqh = 16;
            bombs = 40;
            break;
    
        case "3":
            sqw = 30;
            sqh = 16;
            bombs = 99;
            break;
    }
    elapsedTime = 0;
    adaptBoardResolution();
}
function oddsPerLength(arrays, index) {
    const maxLength = arrays.reduce((max, arr) => Math.max(max, arr.length), 0);
    return arrays[index].length / maxLength;
}

function fillMineboard() {
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if(mineBoard[hoveredCelly + i] != undefined && mineBoard[hoveredCelly + i][hoveredCellx + j] != undefined) {
                mineBoard[hoveredCelly + i][hoveredCellx + j] = -2;
            }
        }
    }

    for (let bomb = 0; bomb < bombs; bomb++) {
        const freeCells = [];
        for (let i = 0; i < sqh; i++) {
            freeCells.push(mineBoard[i].map((element, index) => element == 0 ? index : -1).filter(index => index !== -1));
        }

        const odds = freeCells.map((array, index) => oddsPerLength(freeCells, index));

        const oddsSum = odds.reduce((sum, odd) => sum + odd, 0);
        const normalizedOdds = odds.map(odd => odd / oddsSum);

        let randomIndex;
        let randomValue = Math.random();
        let counter = 0;

        for (let i = 0; i < normalizedOdds.length; i++) {
            counter += normalizedOdds[i];
            if (randomValue <= counter) {
                randomIndex = i;
                break;
            }
        }

        x = Math.floor(Math.random() * freeCells[randomIndex].length);
        mineBoard[randomIndex][freeCells[randomIndex][x]] = -1;
    }

    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if(mineBoard[hoveredCelly + i] != undefined && mineBoard[hoveredCelly + i][hoveredCellx + j] != undefined) {
                mineBoard[hoveredCelly + i][hoveredCellx + j] = 0;
            }
        }
    }

    for (let i = 0; i < sqh; i++) {
        for (let j = 0; j < sqw; j++) {
            if (mineBoard[i][j] === -1) {
                for (let k = -1; k < 2; k++) {
                    for (let l = -1; l < 2; l++) {
                        if (mineBoard[i + k] !== undefined && mineBoard[i + k][j + l] !== undefined && mineBoard[i + k][j + l] !== -1) {
                            mineBoard[i + k][j + l]++;
                        }
                    }
                }
            }
        }
    }
}

function reveal(cellx, celly) {
    if (overBoard[celly][cellx] === 1) {
        overBoard[celly][cellx] = 0;
        if(mineBoard[celly][cellx] === 0) {
            for (let k = -1; k < 2; k++) {
                for (let l = -1; l < 2; l++) {
                    if (mineBoard[celly + k] !== undefined && mineBoard[celly + k][cellx + l] !== undefined && 
                        mineBoard[celly + k][cellx + l] >= 0 && overBoard[celly + k][cellx + l] === 1) {
                        try {
                            reveal(cellx + l, celly + k);
                        } catch (error) {
                        }
                    }
                }
            }
        }
    }
}

function checkBoard() {
    for (let i = 0; i < sqh; i++) {
        for (let j = 0; j < sqw; j++) {
            if(mineBoard[i][j] >= 0 && overBoard[i][j] !== 0) {
                return
            }
        }
    }

    alert("You win!\nTime: " + 
    (minutes.toString().length < 2 ? "0" + minutes : minutes) +
    ":" +
    (seconds.toString().length < 2 ? "0" + seconds : seconds));
    chooseMode();
    mineBoard = Array.from({ length: sqh }, () => Array(sqw).fill(0));
    overBoard = Array.from({ length: sqh }, () => Array(sqw).fill(1));
    isGameStarted = false;
}

function drawOverBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < sqh; i++) {
        for (let j = 0; j < sqw; j++) {
            if (overBoard[i][j] != 0) {
                ctx.fillStyle = "rgb(180 180 180)";
                ctx.fillRect(
                    j * canvas.width / sqw,
                    i * canvas.height / sqh,
                    canvas.width / sqw,
                    canvas.height / sqh
                );
            } else if (mineBoard[i][j] > 0) {
                ctx.textAlign = "center";
                ctx.fillStyle = colors[mineBoard[i][j]];
                ctx.font = "bold " + canvas.width / sqw / 2 + "px serif";

                ctx.fillText(mineBoard[i][j], ((2 * j * canvas.width) + canvas.width) / (2 * sqw), ((2 * i * canvas.height) + canvas.height) / (2 * sqh) + canvas.width / sqw / 6);
            } else if (mineBoard[i][j] === -1) {
                alert('You loose!');
                chooseMode();
                mineBoard = Array.from({ length: sqh }, () => Array(sqw).fill(0));
                overBoard = Array.from({ length: sqh }, () => Array(sqw).fill(1));
                isGameStarted = false;
            }
        }
    }

    ctx.fillStyle = "rgb(100 100 100)";

    if (overBoard[hoveredCelly] !== undefined && overBoard[hoveredCelly][hoveredCellx] !== undefined && overBoard[hoveredCelly][hoveredCellx] !== 0) {
        ctx.fillRect(
            hoveredCellx * canvas.width / sqw,
            hoveredCelly * canvas.height / sqh,
            canvas.width / sqw,
            canvas.height / sqh
        );
    }

    for (let i = 0; i < sqh; i++) {
        for (let j = 0; j < sqw; j++) {
            if (overBoard[i][j] == 2) {
                ctx.textAlign = "center";
                ctx.fillStyle = "red";
                ctx.font = "bold " + canvas.width / sqw / 2 + "px serif";

                ctx.fillText('X', ((2 * j * canvas.width) + canvas.width) / (2 * sqw), ((2 * i * canvas.height) + canvas.height) / (2 * sqh) + canvas.width / sqw / 6);
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
}

document.title = "Minesweeper (00:00)";
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
        elapsedTime++;
        minutes = Math.floor(elapsedTime / 60);
        seconds = elapsedTime % 60;
        document.title = "Minesweeper ("+ 
        (minutes.toString().length < 2 ? "0" + minutes : minutes) +
        ":" +
        (seconds.toString().length < 2 ? "0" + seconds : seconds)  + ")";
    }

    drawOverBoard();
    drawGrid();
    window.requestAnimationFrame(animate);
}

window.requestAnimationFrame(animate);

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mousex = e.clientX - rect.left;
    mousey = e.clientY - rect.top;

    hoveredCellx = Math.floor(sqw * mousex / canvas.width);
    hoveredCelly = Math.floor(sqh * mousey / canvas.height);
});

canvas.addEventListener('click', (e) => {
    e.preventDefault();

    if (!isGameStarted) {
        fillMineboard();
        isGameStarted = true;
    }

    reveal(hoveredCellx, hoveredCelly);

    checkBoard();
});


canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();

    switch (overBoard[hoveredCelly][hoveredCellx]) {
        case 2:
            overBoard[hoveredCelly][hoveredCellx] = 1
            break;

        case 1:
            overBoard[hoveredCelly][hoveredCellx] = 2
            break;

        default:
            break;
    }
});