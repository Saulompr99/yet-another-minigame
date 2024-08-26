const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
let sqw = 9;
let sqh = 9;
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
let resolvedBoard;
let overBoard = Array.from({ length: sqh }, () => Array(sqw).fill(1));

var i = 0;

do {
    resolvedBoard = Array.from({ length: sqh }, () => Array(sqw).fill(0));
    fillResolvedBoard();
    i++;
} while (resolvedBoard[sqh-1][sqw-1] === 0);
console.log(i);

function chooseMode() {
    gameMode = prompt("Select mode: 1-Beginner 2-Intermediate 3-Expert", gameMode);

    while (!Number(gameMode) || gameMode < 0 || gameMode > 3) {
        gameMode = prompt("Select mode: 1-Beginner 2-Intermediate 3-Expert", "");
    }

    switch (gameMode) {
        case "1":
            // TODO

            break;

        case "2":
            // TODO

            break;

        case "3":
            // TODO

            break;
    }
    elapsedTime = 0;
    adaptBoardResolution();
}

function fillResolvedBoard() {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const shuffledNumbers = shuffleArray(numbers);

    resolvedBoard[0] = shuffledNumbers;

    var rows = resolvedBoard.map(row => row.filter(row => row !== 0));
    var columns = resolvedBoard[0].map((_, col) => resolvedBoard.map(row => row[col]).filter(cell => cell !== 0));
    var cellGroups = resolvedBoard.map((_, row) => 
    resolvedBoard[Math.floor(row / 3) * 3].slice(row % 3 * 3, row % 3 * 3 + 3).filter(cell => cell !== 0)
        .concat(resolvedBoard[Math.floor(row / 3) + 1 * 3].slice(row % 3 * 3, row % 3 * 3 + 3)).filter(cell => cell !== 0)
        .concat(resolvedBoard[Math.floor(row / 3) + 2 * 3].slice(row % 3 * 3, row % 3 * 3 + 3)).filter(cell => cell !== 0));

    for (let i = 1; i < sqh; i++) {
        for (let j = 0; j < sqw; j++) {
            cellGroupX = Math.floor(j / 3);
            cellGroupY = Math.floor(i / 3) * 3;
            cellGroup = cellGroups[cellGroupX + cellGroupY];
            
            column = columns[j];
            row = rows[i];

            availableNumbers = numbers.filter(k => !row.includes(k) && !column.includes(k) && !cellGroup.includes(k));

            if (availableNumbers.length !== 0) {
                resolvedBoard[i][j] = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
                rows[i].push(resolvedBoard[i][j]);
                columns[j].push(resolvedBoard[i][j]);
                cellGroups[cellGroupX + cellGroupY].push(resolvedBoard[i][j]);
            } else {
                return false;
            }
        }
    }

    return true;
}

function shuffleArray(array) {
    output = array;
    for (var i = output.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = output[i];
        output[i] = output[j];
        output[j] = temp;
    }
    return output;
}

function checkBoard() {
    if (resolvedBoard == overBoard) {
        alert("You win!\nTime: " +
            (minutes.toString().length < 2 ? "0" + minutes : minutes) +
            ":" +
            (seconds.toString().length < 2 ? "0" + seconds : seconds));
        chooseMode();
    }

    // Reset board
    isGameStarted = false;
}

function drawOverBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgb(230 230 230)";

    if (resolvedBoard[hoveredCelly] !== undefined && resolvedBoard[hoveredCelly][hoveredCellx] !== undefined) {
        ctx.fillRect(
            hoveredCellx * canvas.width / sqw,
            hoveredCelly * canvas.height / sqh,
            canvas.width / sqw,
            canvas.height / sqh
        );
    }

    for (let i = 0; i < sqh; i++) {
        for (let j = 0; j < sqw; j++) {
            if (resolvedBoard[i][j] !== 0) {
                ctx.textAlign = "center";
                ctx.fillStyle = "rgb(0 0 0)";
                ctx.font = "bold " + canvas.width / sqw / 2 + "px serif";

                ctx.fillText(resolvedBoard[i][j], ((2 * j * canvas.width) + canvas.width) / (2 * sqw), ((2 * i * canvas.height) + canvas.height) / (2 * sqh) + canvas.width / sqw / 6);
            }
        }
    }
}

function drawGrid() {
    ctx.fillStyle = "rgb(0 0 0)";

    for (let i = 0; i <= sqw; i++) {
        i % 3 ? ctx.lineWidth = 1 : ctx.lineWidth = 5;
        ctx.strokeRect(i * canvas.width / sqw, 0, i * canvas.width / sqw, canvas.height);
    }

    for (let i = 0; i <= sqh; i++) {
        i % 3 ? ctx.lineWidth = 1 : ctx.lineWidth = 5;
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

document.title = "Sudoku (00:00)";
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
        document.title = "Sudoku (" +
            (minutes.toString().length < 2 ? "0" + minutes : minutes) +
            ":" +
            (seconds.toString().length < 2 ? "0" + seconds : seconds) + ")";
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