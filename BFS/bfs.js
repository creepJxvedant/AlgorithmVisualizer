// Global Variables
const numRows = 20;
const numCols = 50;
const wallProbability = 0.3; // For maze generation

let grid = [];
let startNode = null;
let endNode = null;
let queue = [];
let visitedNodes = [];
let shortestPaths = [];
let isMouseDown = false;
let foundPaths = false;
let isAlgorithmRunning = false;

// DOM Elements
const gridContainer = document.getElementById("grid-container");
const nextButton = document.getElementById("next-button");
const startAutomaticButton = document.getElementById("start-automatic");
const debugText = document.getElementById("debug-text");

// Event Listeners
gridContainer.addEventListener("mousedown", () => (isMouseDown = true));
gridContainer.addEventListener("mouseup", () => (isMouseDown = false));
gridContainer.addEventListener("mouseleave", () => (isMouseDown = false));

// Utility Functions
function animateCell(cellDiv, { color, scale = 1, duration = 400 }) {
    cellDiv.style.transition = `background-color ${duration}ms ease, transform ${duration}ms ease`;
    cellDiv.style.backgroundColor = color;
    cellDiv.style.transform = `scale(${scale})`;
    setTimeout(() => (cellDiv.style.transform = "scale(1)"), duration);
}

function updateDebugText(message) {
    debugText.innerText = message;
}

// Grid Initialization
function createGrid() {
    gridContainer.innerHTML = "";
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
    const div = document.createElement("div");
    div.classList.add("cell");
    div.dataset.row = cell.row;
    div.dataset.col = cell.col;
    div.addEventListener("click", () => handleCellClick(div, cell));
    div.addEventListener("mousemove", () => handleCellDrag(div, cell));
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

// Cell Interaction Handlers
function handleCellClick(div, cell) {
    if (!startNode) setStartNode(cell, div);
    else if (!endNode) setEndNode(cell, div);
    else toggleWall(cell, div);
}

function handleCellDrag(div, cell) {
    if (isMouseDown && !cell.isStart && !cell.isEnd) {
        toggleWall(cell, div, true);
    }
}

function setStartNode(cell, div) {
    startNode = cell;
    cell.isStart = true;
    div.classList.add("start");
    animateCell(div, { color: "rgba(0, 128, 0,1)", scale: 1.2 }); 
}

function setEndNode(cell, div) {
    endNode = cell;
    cell.isEnd = true;
    div.classList.add("end");
    animateCell(div, { color: "rgba(255, 0, 0, 0.7)", scale: 1.2 }); // Red
}

function toggleWall(cell, div, force = false) {
    cell.isWall = force ? true : !cell.isWall;
    div.classList.toggle("wall", cell.isWall);
}

// Algorithm State Reset
function resetGrid() {
    createGrid();
    updateDebugText('Click "Start Manual" or "Start Automatic" to begin.');
}

function resetState() {
    startNode = null;
    endNode = null;
    queue = [];
    visitedNodes = [];
    shortestPaths = [];
    nextButton.disabled = true;
    startAutomaticButton.disabled = false;
    foundPaths = false;
    isAlgorithmRunning = false;
}

// Maze Generation
function generateMaze() {
    resetState();
    grid.forEach((row, rowIndex) =>
        row.forEach((cell, colIndex) => {
            const cellDiv = document.querySelector(`[data-row="${rowIndex}"][data-col="${colIndex}"]`);
            if (cell.isStart || cell.isEnd) return;

            cell.isWall = Math.random() < wallProbability;
            cellDiv.classList.toggle("wall", cell.isWall);
        })
    );
    updateDebugText("Random maze generated!");
}

// Manual Algorithm Execution
function startManual() {
    if (!startNode || !endNode) return alert("Please select both start and end nodes.");
    queue.push(startNode);
    startNode.visited = true;
    nextButton.disabled = false;
    startAutomaticButton.disabled = true;
    updateDebugText('Manual mode started. Click "Next Step" to proceed.');
}

function nextStep() {
    if (queue.length === 0) {
        updateDebugText("No path found.");
        return;
    }

    const current = queue.shift();
    visitedNodes.push(current);

    if (current === endNode) {
        reconstructPath(current);
        updateDebugText("Shortest path found!");
        return;
    }

    exploreNeighbors(current);
    markAsVisited(current);
}

// Automatic Algorithm Execution
async function startAutomatic() {
    if (!startNode || !endNode) return alert("Please select both start and end nodes.");
    queue.push(startNode);
    startNode.visited = true;
    nextButton.disabled = true;
    startAutomaticButton.disabled = true;
    updateDebugText("Automatic mode started.");

    while (queue.length > 0) {
        const current = queue.shift();
        visitedNodes.push(current);

        if (current === endNode) {
            reconstructPath(current);
            break;
        }

        exploreNeighbors(current);
        markAsVisited(current);
        await new Promise((resolve) => setTimeout(resolve, 20));
    }

    if (!foundPaths) updateDebugText("No path found.");
}

// Pathfinding Helpers
function exploreNeighbors(current) {
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
    animateCell(nodeDiv, { color: "rgba(255, 255, 0, 0.7)", scale: 1.1 }); // Yellow
    nodeDiv.classList.add("visited");
}

function reconstructPath(node) {
    const path = [];
    while (node) {
        path.push(node);
        node = node.previous;
    }
    path.reverse();

    path.forEach((node, index) => {
        setTimeout(() => {
            const nodeDiv = document.querySelector(`[data-row="${node.row}"][data-col="${node.col}"]`);
            animateCell(nodeDiv, { color: "rgba(0, 0, 255, 0.7)", scale: 1.1 }); // Green
            nodeDiv.classList.add("path");
        }, index * 50);
    });

    foundPaths = true;
}

// Initialize
createGrid();
