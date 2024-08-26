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
let overBoard = Array.from({ length: sqh }, () => Array(sqw).fill(0));
let resolvedBoard = Array.from({ length: sqh }, () => Array(sqw).fill(0));

let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let shuffledNumbers = shuffleArray(numbers);

resolvedBoard[0] = shuffledNumbers;

let rows = resolvedBoard.map(row => row.filter(row => row !== 0));
let columns = resolvedBoard[0].map((_, col) => resolvedBoard.map(row => row[col]).filter(cell => cell !== 0));
let cellGroups = resolvedBoard.map((_, row) =>
    resolvedBoard[Math.floor(row / 3) * 3].slice(row % 3 * 3, row % 3 * 3 + 3).filter(cell => cell !== 0)
        .concat(resolvedBoard[Math.floor(row / 3) + 1 * 3].slice(row % 3 * 3, row % 3 * 3 + 3)).filter(cell => cell !== 0)
        .concat(resolvedBoard[Math.floor(row / 3) + 2 * 3].slice(row % 3 * 3, row % 3 * 3 + 3)).filter(cell => cell !== 0));

generateNumber(9);
fillOverboard(15);

function generateNumber(x) {
    var cellx = x % sqw;
    var celly = Math.floor(x / sqw);
    const cellGroupX = Math.floor(cellx / 3);
    const cellGroupY = Math.floor(celly / 3) * 3;

    var availableNumbers = numbers.filter(k => !rows[celly].includes(k) && !columns[cellx].includes(k) && !cellGroups[cellGroupX + cellGroupY].includes(k));

    while (availableNumbers.length !== 0) {
        resolvedBoard[celly][cellx] = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
        rows[celly].push(resolvedBoard[celly][cellx]);
        columns[cellx].push(resolvedBoard[celly][cellx]);
        cellGroups[cellGroupX + cellGroupY].push(resolvedBoard[celly][cellx]);
        if (x < 80) {
            generateNumber(x + 1);
        }
        console.log(x);
        if (resolvedBoard[sqh - 1][sqw - 1] !== 0) {
            break;
        } else {
            availableNumbers.splice(availableNumbers.indexOf(resolvedBoard[celly][cellx]), 1);
            resolvedBoard[celly][cellx] = 0;
            rows[celly].pop();
            columns[cellx].pop();
            cellGroups[cellGroupX + cellGroupY].pop();
        }
    }

    return false;
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
    for (let i = 0; i < sqh; i++) {
        if (overBoard[i].filter(j => j !==0).length < 9) {
            return
        }
    }

    for (let i = 0; i < sqh; i++) {
        for (let j = 0; j < sqw; j++) {
            if(overBoard[i][j] % 10 !== resolvedBoard[i][j]) {
                return
            }
        }
    }

    alert("You win!\nTime: " +
        (minutes.toString().length < 2 ? "0" + minutes : minutes) +
        ":" +
        (seconds.toString().length < 2 ? "0" + seconds : seconds));
}

function drawOverBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgb(230 230 230)";

    if (overBoard[hoveredCelly] !== undefined && overBoard[hoveredCelly][hoveredCellx] !== undefined) {
        ctx.fillRect(
            0,
            hoveredCelly * canvas.height / sqh,
            canvas.width,
            canvas.height / sqh
        );

        ctx.fillRect(
            hoveredCellx * canvas.width / sqw,
            0,
            canvas.width / sqw,
            canvas.height
        );

        ctx.fillStyle = "rgb(200 200 200)";

        ctx.fillRect(
            hoveredCellx * canvas.width / sqw,
            hoveredCelly * canvas.height / sqh,
            canvas.width / sqw,
            canvas.height / sqh
        );
    }

    for (let i = 0; i < sqh; i++) {
        for (let j = 0; j < sqw; j++) {
            if (overBoard[i][j] !== 0) {
                ctx.textAlign = "center";
                overBoard[i][j] > 10 ? ctx.fillStyle = "rgb(0 0 0)" : ctx.fillStyle = "rgb(100 100 100)";
                ctx.font = "bold " + canvas.width / sqw / 2 + "px serif";

                ctx.fillText(overBoard[i][j] % 10, ((2 * j * canvas.width) + canvas.width) / (2 * sqw), ((2 * i * canvas.height) + canvas.height) / (2 * sqh) + canvas.width / sqw / 6);
            }
        }
    }
}

function fillOverboard(squaresToReveal) {
    count = 0;
    do {
        randx = Math.floor(Math.random() * 9);
        randy = Math.floor(Math.random() * 9);
        
        if (overBoard[randy][randx] === 0) {
            overBoard[randy][randx] = resolvedBoard[randy][randx] + 10;
            count++;
        }
    } while (count < squaresToReveal);
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
    if (overBoard[hoveredCelly][hoveredCellx] < 10) {
        num = prompt("Select a number between 1-9");
        if (num > 0 && num < 10) {
            overBoard[hoveredCelly][hoveredCellx] = num;
        }
    }
    checkBoard();
});


canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if(overBoard[hoveredCelly][hoveredCellx] < 10) {
        overBoard[hoveredCelly][hoveredCellx] = 0;
    }
});

Option();