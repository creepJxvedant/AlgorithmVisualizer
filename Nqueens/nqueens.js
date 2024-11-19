const boardContainer = document.querySelector(".board-container");
const debugText = document.getElementById("debug-text");
const nextStepButton = document.getElementById("next-step");
const manualModeButton = document.getElementById("manual-mode");
const autoModeButton = document.getElementById("auto-mode");
const numQueensInput = document.getElementById("num-queens");
const cell=document.getElementsByClassName("cell");


let size = 8;
let board = [];
let row = 0;
let isManual = false;
let isAutoRunning = false;
const MAXSIZE=480;

// Initialize board
function initializeBoard() {
    size = parseInt(numQueensInput.value);
    if (isNaN(size)) {
        updateDebugText("Please enter a valid number of queens between 1 and 8.");
        return;
    }
    board = Array.from({ length: size }, () => Array(size).fill(0));
    row = 0;
    isAutoRunning = false;
    renderBoard();
    updateDebugText("Choose a mode to start solving.");
}

function renderBoard() {
    boardContainer.innerHTML = "";
    const cellSize =MAXSIZE/size; // Dynamically adjust cell size for smaller boards
    boardContainer.style.gridTemplateColumns = `repeat(${size}, ${cellSize}px)`;
    boardContainer.style.gridTemplateRows = `repeat(${size}, ${cellSize}px)`;
    board.forEach((rowArray, r) => {
        rowArray.forEach((cell, c) => {
            const cellDiv = document.createElement("div");
            cellDiv.classList.add("cell");
            if ((r + c) % 2 === 0) cellDiv.classList.add("even-row");
            else cellDiv.classList.add("odd-row");
            if (cell === 1) cellDiv.innerText = "♛"; // Display queen
            
            boardContainer.appendChild(cellDiv);
        });
    });
}


// Check if placing a queen is valid
function isValid(row, col) {
    for (let i = 0; i < row; i++) {
        if (board[i][col] === 1) return false;
        if (col - (row - i) >= 0 && board[i][col - (row - i)] === 1) return false;
        if (col + (row - i) < size && board[i][col + (row - i)] === 1) return false;
    }
    return true;
}

// Place next queen (Manual Mode)
function manualStep() {
    if (row >= size) {
        updateDebugText("All queens placed!");
        nextStepButton.disabled = true;
        return;
    }

    for (let col = 0; col < size; col++) {
        if (isValid(row, col)) {
            board[row][col] = 1;
            renderBoard();
            row++;
            updateDebugText(`Placed queen at row ${row}.`);
            return;
        }
    }

    updateDebugText("No valid position found. Backtracking...");
    backtrack();
}

// Backtrack to remove the last queen
function backtrack() {
    row--;
    for (let col = 0; col < size; col++) {
        if (board[row][col] === 1) {
            board[row][col] = 0;
            renderBoard();
            return;
        }
    }
}

// Automatic Mode (Recursive Backtracking)
async function autoSolve() {
    if (isAutoRunning) return;
    isAutoRunning = true;

    async function solve(row) {
        if (row >= size) {
            updateDebugText("All queens placed!");
            isAutoRunning = false;
            return true;
        }
        for (let col = 0; col < size; col++) {
            if (isValid(row, col)) {
                board[row][col] = 1;
                renderBoard();
                await sleep(500); // Delay for visualization
                if (await solve(row + 1)) return true;
                board[row][col] = 0;
                renderBoard();
                await sleep(500);
            }
        }
        return false;
    }

    await solve(0);
    isAutoRunning = false;
}

// Sleep function for delay
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Update debug text
function updateDebugText(message) {
    debugText.innerText = message;
}

// Event Listeners
manualModeButton.addEventListener("click", () => {
    isManual = true;
    nextStepButton.style.display = "inline-block";
    initializeBoard();
    updateDebugText("Manual mode activated. Click 'Next Step' to proceed.");
});

autoModeButton.addEventListener("click", () => {
    isManual = false;
    nextStepButton.style.display = "none";
    initializeBoard();
    updateDebugText("Automatic mode activated. Solving...");
    autoSolve();
});

nextStepButton.addEventListener("click", () => {
    if (isManual) manualStep();
});

// Initialize default board on page load
initializeBoard();
