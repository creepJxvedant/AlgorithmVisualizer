import { ModulegenerateMaze } from "./generateMaze.js";
import { setStartNode, setEndNode, toggleWall, handleCellDrag } from "./HandleButtons.js";

const numRows = 20;
const numCols = 50;
let grid = [];
let startNode = null;
let endNode = null;
let openSet = [];
let closedSet = [];
let path = [];
let isAutomatic = false;
let isMouseDown = false;
let isRunning = false;

const gridContainer = document.getElementById("grid-container");
const nextButton = document.getElementById("next");
const startAutomaticButton = document.getElementById("automatic");
const startManualButton = document.getElementById("manual");
const resetButton = document.getElementById("reset");
const generateButton = document.getElementById("generate");
const debugText = document.getElementById("debug-text");

gridContainer.addEventListener('mousedown', () => (isMouseDown = true));
gridContainer.addEventListener('mouseup', () => (isMouseDown = false));
gridContainer.addEventListener('mouseleave', () => (isMouseDown = false));
nextButton.addEventListener('click', nextStep);
startAutomaticButton.addEventListener('click', startAutomatic);
startManualButton.addEventListener('click', startManual);
resetButton.addEventListener('click', resetGrid);
generateButton.addEventListener('click', generateMaze);

function createGrid() {
    gridContainer.innerHTML = '';
    grid = [];
    gridContainer.style.gridTemplateColumns = `repeat(${numCols}, 18px)`;
    gridContainer.style.gridTemplateRows = `repeat(${numRows}, 18px)`;

    for (let row = 0; row < numRows; row++) {
        let gridRow = [];
        for (let col = 0; col < numCols; col++) {
            const cell = createCell(row, col);
            gridRow.push(cell);
            const div = createCellDiv(cell);
            gridContainer.appendChild(div);
        }
        grid.push(gridRow);
    }

    assignNeighbors();
}

function createCell(row, col) {
    return {
        row,
        col,
        isStart: false,
        isEnd: false,
        isWall: false,
        f: Infinity,
        g: Infinity,
        h: 0,
        previous: null,
        visited: false,
        neighbors: [],
    };
}

function createCellDiv(cell) {
    const div = document.createElement('div');
    div.classList.add('cell');
    div.dataset.row = cell.row;
    div.dataset.col = cell.col;
    div.addEventListener('click', () => !isRunning && handleCellClick(div, cell));
    div.addEventListener('mousemove', () => !isRunning && isMouseDown && handleCellDrag(div, cell));
    return div;
}

function assignNeighbors() {
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const node = grid[row][col];
            if (row > 0) node.neighbors.push(grid[row - 1][col]);
            if (row < numRows - 1) node.neighbors.push(grid[row + 1][col]);
            if (col > 0) node.neighbors.push(grid[row][col - 1]);
            if (col < numCols - 1) node.neighbors.push(grid[row][col + 1]);
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

function resetGrid() {
    gridContainer.innerHTML = '';
    createGrid();
    resetState();
    debugText.innerText = 'Click "Start Manual" or "Start Automatic" to begin.';
}

function resetState() {
    isRunning = false;
    startNode = null;
    endNode = null;
    openSet = [];
    closedSet = [];
    path = [];
    isAutomatic = false;
    nextButton.disabled = false;
    startAutomaticButton.disabled = false;
}

function heuristic(a, b) {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

function startManual() {
    if (!startNode || !endNode) {
        alert('Please select both start and end nodes.');
        return;
    }

    isRunning = true;
    openSet = [startNode];
    startNode.g = 0;
    startNode.f = heuristic(startNode, endNode);

    nextButton.disabled = false;
    startAutomaticButton.disabled = true;
    debugText.innerText = 'Manual mode started. Click "Next Step" to proceed.';
}

function nextStep() {
    if (openSet.length === 0) {
        debugText.innerText = 'No path found.';
        return;
    }

    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift();
    current.visited = true;

    if (current === endNode) {
        reconstructPath();
        return;
    }

    updateNeighbors(current);
    markAsVisited(current);
    document.querySelector(`[data-row="${current.row}"][data-col="${current.col}"]`).classList.add('visited');
    debugText.innerText = `Visiting node at (${current.row}, ${current.col})`;
}

function updateNeighbors(current) {
    current.neighbors.forEach((neighbor) => {
        if (!neighbor.visited && !neighbor.isWall) {
            const tempG = current.g + 1;
            const h = heuristic(neighbor, endNode);
            if (tempG < neighbor.g) {
                neighbor.previous = current;
                neighbor.g = tempG;
                neighbor.h = h;
                neighbor.f = neighbor.g + neighbor.h;
                if (!openSet.includes(neighbor)) openSet.push(neighbor);
            }
        }
    });
}

function markAsVisited(current) {
    const cellDiv = document.querySelector(`[data-row="${current.row}"][data-col="${current.col}"]`);
    cellDiv.classList.add('visited');
    animateFollowingNodes(current);
}

function animateFollowingNodes(current) {
    const cellDiv = document.querySelector(`[data-row="${current.row}"][data-col="${current.col}"]`);
    cellDiv.style.transition = "background-color 0.4s ease, transform 0.4s ease";
    cellDiv.style.backgroundColor = 'rgba(255, 255, 0, 0.7)';
    cellDiv.style.transform = "scale(1.1)";
    setTimeout(() => {
        cellDiv.style.transform = "scale(1)";
    }, 400);
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
            nodeDiv.classList.add('path');
            nodeDiv.style.transition = "background-color 0.3s ease, transform 0.3s ease";
            nodeDiv.style.backgroundColor = 'rgba(0, 0, 255, 0.7)';
            nodeDiv.style.transform = "scale(1.2)";
            setTimeout(() => {
                nodeDiv.style.transform = "scale(1)";
            }, 300);
        }, index * 100);
    });

    debugText.innerText = 'Path found!';
    nextButton.disabled = true;
}

async function startAutomatic() {
    if (!startNode || !endNode) {
        alert('Please select both start and end nodes.');
        return;
    }

    isRunning = true;
    openSet = [startNode];
    startNode.g = 0;
    startNode.f = heuristic(startNode, endNode);

    nextButton.disabled = true;
    startAutomaticButton.disabled = true;
    debugText.innerText = 'Automatic mode started. Please wait for the algorithm to finish.';

    while (openSet.length > 0) {
        openSet.sort((a, b) => a.f - b.f);
        const current = openSet.shift();
        current.visited = true;

        if (current === endNode) {
            reconstructPath();
            return;
        }

        updateNeighbors(current);
        markAsVisited(current);
        document.querySelector(`[data-row="${current.row}"][data-col="${current.col}"]`).classList.add('visited');
        debugText.innerText = `Visiting node at (${current.row}, ${current.col})`;

        await new Promise((resolve) => setTimeout(resolve, 20));
    }

    debugText.innerText = 'No path found.';
    isRunning = false;
}

function generateMaze() {
    resetGrid();
    ModulegenerateMaze(numRows, numCols, grid);
    debugText.innerText = 'Random maze generated!';
}

createGrid();
