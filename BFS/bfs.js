import { ModulegenerateMaze } from "../Modules/generateMaze.js";
import { setStartNode, setEndNode, toggleWall, handleCellDrag } from "../Modules/HandleButtons.js";

const numRows = 20;
const numCols = 50;
let grid = [];
let startNode = null;
let endNode = null;
let queue = [];
let visitedNodes = [];
let path = [];
let isMouseDown = false;
let isRunning = false;

const gridContainer = document.getElementById("grid-container");
const nextButton = document.getElementById("next");
const startAutomaticButton = document.getElementById("automatic");
const startManualButton = document.getElementById("manual");
const resetButton = document.getElementById("reset");
const generateButton = document.getElementById("generate");
const debugText = document.getElementById("debug-text");

// Event Listeners
gridContainer.addEventListener("mousedown", () => (isMouseDown = true));
gridContainer.addEventListener("mouseup", () => (isMouseDown = false));
gridContainer.addEventListener("mouseleave", () => (isMouseDown = false));
nextButton.addEventListener("click", nextStep);
startAutomaticButton.addEventListener("click", startAutomatic);
startManualButton.addEventListener("click", startManual);
resetButton.addEventListener("click", resetGrid);
generateButton.addEventListener("click", generateMaze);

// Create Grid
function createGrid() {
    gridContainer.innerHTML = '';
    grid = [];
    gridContainer.style.gridTemplateColumns = `repeat(${numCols}, 18px)`;
    gridContainer.style.gridTemplateRows = `repeat(${numRows}, 18px)`;

    for (let row = 0; row < numRows; row++) {
        const gridRow = [];
        for (let col = 0; col < numCols; col++) {
            const cell = createCell(row, col);
            gridRow.push(cell);
            gridContainer.appendChild(createCellDiv(cell));
        }
        grid.push(gridRow);
    }

    assignNeighbors();
    resetState();
}

function createCell(row, col) {
    return {
        row,
        col,
        isStart: false,
        isEnd: false,
        isWall: false,
        visited: false,
        previous: null,
        neighbors: [],
    };
}

function createCellDiv(cell) {
    const div = document.createElement('div');
    div.classList.add('cell');
    div.dataset.row = cell.row;
    div.dataset.col = cell.col;
    div.addEventListener('click', () => !isRunning && handleCellClick(div, cell));
    div.addEventListener('mousemove', () =>!isRunning && isMouseDown && handleCellDrag(div, cell));
    return div;
}

function assignNeighbors() {
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const node = grid[row][col];
            if (row > 0) node.neighbors.push(grid[row - 1][col]); // Up
            if (row < numRows - 1) node.neighbors.push(grid[row + 1][col]); // Down
            if (col > 0) node.neighbors.push(grid[row][col - 1]); // Left
            if (col < numCols - 1) node.neighbors.push(grid[row][col + 1]); // Right
        }
    }
}

function handleCellClick(div, cell) {
    if (!startNode) {
        startNode = cell;
        setStartNode(cell, div);
    } else if (!endNode) {
        endNode = cell;
        setEndNode(cell, div);
    } else if (!cell.isStart && !cell.isEnd) {
        toggleWall(cell, div);
    } else {
        alert("Cannot assign values while running.");
    }
}


function generateMaze() {
    resetGrid();
    ModulegenerateMaze(numRows, numCols, grid);
    debugText.innerText = 'Random maze generated!';
}

function resetGrid() {
    createGrid();
    updateDebugText('Click "Start Manual" or "Start Automatic" to begin.');
}

function resetState() {
    startNode = null;
    endNode = null;
    queue = [];
    visitedNodes = [];
    path = [];
    isRunning = false;
    nextButton.disabled = false;
    startAutomaticButton.disabled = false;
}


function startManual() {
    if (!startNode || !endNode) {
        alert("Please select both start and end nodes.");
        return;
    }
    isRunning = true;
    queue = [startNode];
    startNode.visited = true;
    nextButton.disabled = false;
    startAutomaticButton.disabled = true;
    debugText.innerText = 'Manual mode started. Click "Next Step" to proceed.';
}

function nextStep() {
    if (queue.length === 0) {
        debugText.innerText = "No path found.";
        return;
    }

    const current = queue.shift();
    visitedNodes.push(current);

    if (current === endNode) {
        reconstructPath();
        return;
    }

    updateNeighbors(current);
    markAsVisited(current);
}

async function startAutomatic() {
    if (!startNode || !endNode) {
        alert("Please select both start and end nodes.");
        return;
    }
    isRunning = true;
    queue = [startNode];
    startNode.visited = true;
    nextButton.disabled = true;
    startAutomaticButton.disabled = true;
    debugText.innerText = "Automatic mode started.";

    while (queue.length > 0) {
        const current = queue.shift();
        visitedNodes.push(current);

        if (current === endNode) {
            reconstructPath();
            return;
        }

        updateNeighbors(current);
        markAsVisited(current);
        await new Promise((resolve) => setTimeout(resolve, 20));
    }

    debugText.innerText = "No path found.";
    isRunning = false;
}

function updateNeighbors(current) {
    current.neighbors.forEach((neighbor) => {
        if (!neighbor.visited && !neighbor.isWall) {
            neighbor.visited = true;
            neighbor.previous = current;
            queue.push(neighbor);
        }
    });
}

function markAsVisited(node) {
    const nodeDiv = document.querySelector(`[data-row="${node.row}"][data-col="${node.col}"]`);
    nodeDiv.classList.add("visited");
}

function reconstructPath() {
    let temp = endNode;
    while (temp.previous) {
        path.unshift(temp);
        temp = temp.previous;
    }
    path.unshift(startNode);

    path.forEach((node, index) => {
        setTimeout(() => {
            const nodeDiv = document.querySelector(`[data-row="${node.row}"][data-col="${node.col}"]`);
            nodeDiv.classList.add("path");
        }, index * 50);
    });

    debugText.innerText = "Path found!";
}

// Initialize Grid
createGrid();
