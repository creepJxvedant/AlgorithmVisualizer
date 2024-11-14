const numRows = 10;
const numCols = 25;
let grid = [];
let startNode = null;
let endNode = null;
let openSet = [];
let closedSet = [];
let path = [];
let isAutomatic = false;
let isMouseDown = false; // Track if mouse is pressed

const gridContainer = document.getElementById("grid-container");
const nextButton = document.getElementById("next-button");
const startAutomaticButton = document.getElementById("start-automatic");
const debugText = document.getElementById("debug-text");

function createGrid() {
    gridContainer.innerHTML = ''; // Clear previous grid
    grid = [];
    
    gridContainer.style.gridTemplateColumns = `repeat(${numCols}, 36px)`;
    gridContainer.style.gridTemplateRows = `repeat(${numRows}, 36px)`;
    
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
    addMouseEventListeners();
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
        neighbors: []
    };
}

function createCellDiv(cell) {
    const div = document.createElement('div');
    div.classList.add('cell');
    div.dataset.row = cell.row;
    div.dataset.col = cell.col;
    div.addEventListener('click', () => handleCellClick(div, cell));
    return div;
}

function assignNeighbors() {
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const node = grid[row][col];
            if (row > 0) node.neighbors.push(grid[row - 1][col]); // up
            if (row < numRows - 1) node.neighbors.push(grid[row + 1][col]); // down
            if (col > 0) node.neighbors.push(grid[row][col - 1]); // left
            if (col < numCols - 1) node.neighbors.push(grid[row][col + 1]); // right
        }
    }
}

function addMouseEventListeners() {
    gridContainer.addEventListener('mousedown', () => { 
        isMouseDown = true; 
    });
    
    gridContainer.addEventListener('mousemove', (event) => {
        if (isMouseDown) {
            const cell = getCellFromEvent(event);
            if (cell && !cell.isStart && !cell.isEnd) {
                cell.isWall = !cell.isWall; 
                const div = document.querySelector(`[data-row="${cell.row}"][data-col="${cell.col}"]`);
                div.classList.toggle('wall', cell.isWall);
            }
        }
    });

    gridContainer.addEventListener('mouseup', () => { 
        isMouseDown = false; 
    });
}

function getCellFromEvent(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    if (!isNaN(row) && !isNaN(col)) {
        return grid[row][col];
    }
    return null;
}

function handleCellClick(div, cell) {
    if (!startNode) {
        startNode = cell;
        cell.isStart = true;
        div.classList.add('start');
    } else if (!endNode) {
        endNode = cell;
        cell.isEnd = true;
        div.classList.add('end');
    } else if (!cell.isStart && !cell.isEnd) {
        cell.isWall = !cell.isWall; 
        div.classList.toggle('wall', cell.isWall);
    }
}

function resetGrid() {
    gridContainer.innerHTML = '';
    createGrid();
    resetState();
    debugText.innerText = 'Click "Start Manual" or "Start Automatic" to begin.';
}

function resetState() {
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
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col); // Manhattan distance
}

function startManual() {
    if (!startNode || !endNode) {
        alert('Please select both start and end nodes.');
        return;
    }

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
    document.querySelector(`[data-row="${current.row}"][data-col="${current.col}"]`).classList.add('visited');
    debugText.innerText = `Visiting node at (${current.row}, ${current.col})`;
}

function updateNeighbors(current) {
    current.neighbors.forEach(neighbor => {
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

function reconstructPath() {
    let temp = endNode;
    while (temp.previous) {
        path.unshift(temp);
        temp = temp.previous;
    }

    document.querySelector(`[data-row="${startNode.row}"][data-col="${startNode.col}"]`).classList.add('path');
    path.forEach(node => document.querySelector(`[data-row="${node.row}"][data-col="${node.col}"]`).classList.add('path'));
    debugText.innerText = 'Path found!';
    nextButton.disabled = true;
}

async function startAutomatic() {
    if (!startNode || !endNode) {
        alert('Please select both start and end nodes.');
        return;
    }

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
        document.querySelector(`[data-row="${current.row}"][data-col="${current.col}"]`).classList.add('visited');
        debugText.innerText = `Visiting node at (${current.row}, ${current.col})`;

        await new Promise(resolve => setTimeout(resolve, 80));
    }

    debugText.innerText = 'No path found.';
}

createGrid();
