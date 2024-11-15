const numRows = 10;
const numCols = 25;
let grid = [];
let startNode = null;
let endNode = null;
let openSet = [];
let closedSet = [];
let path = [];
let isMouseDown = false;

const gridContainer = document.getElementById("grid-container");
const nextButton = document.getElementById("next-button");
const startAutomaticButton = document.getElementById("start-automatic");
const debugText = document.getElementById("debug-text");

// Event Listeners for mouse dragging to add walls
gridContainer.addEventListener('mousedown', () => isMouseDown = true);
gridContainer.addEventListener('mouseup', () => isMouseDown = false);
gridContainer.addEventListener('mouseleave', () => isMouseDown = false);

function createGrid() {
    gridContainer.innerHTML = ''; // Clear previous grid
    grid = [];
    
    // Set grid dimensions dynamically
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
    div.addEventListener('mousemove', () => handleCellDrag(div, cell));
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

function handleCellClick(div, cell) {
    if (!startNode) {
        setStartNode(cell, div);
    } else if (!endNode) {
        setEndNode(cell, div);
    } else if (!cell.isStart && !cell.isEnd) {
        toggleWall(cell, div);
    }
}

function setStartNode(cell, div) {
    startNode = cell;
    cell.isStart = true;
    start = cell;
    div.classList.add('start');
}

function setEndNode(cell, div) {
    endNode = cell;
    end = cell;
    cell.isEnd = true;
    div.classList.add('end');
}

function toggleWall(cell, div) {
    cell.isWall = !cell.isWall;
    div.classList.toggle('wall', cell.isWall);
}

function handleCellDrag(div, cell) {
    if (isMouseDown && !cell.isStart && !cell.isEnd && !cell.isWall) {
        cell.isWall = true;
        div.classList.add('wall');
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
    isMouseDown = false;
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
    debugText.innerText = `Visiting node at (${current.row}, ${current.col})`;
}

function updateNeighbors(current) {
    current.neighbors.forEach(neighbor => {
        if (!neighbor.visited && !neighbor.isWall) { // Skip wall cells
            const tempG = current.g + 1;
            if (tempG < neighbor.g) {
                neighbor.previous = current;
                neighbor.g = tempG;
                neighbor.f = neighbor.g + heuristic(neighbor, endNode);
                if (!openSet.includes(neighbor)) openSet.push(neighbor);
            }
        }
    });
}

function markAsVisited(current) {
    document.querySelector(`[data-row="${current.row}"][data-col="${current.col}"]`).classList.add('visited');
}

function reconstructPath() {
    let temp = endNode;
    while (temp.previous) {
        path.unshift(temp);
        temp = temp.previous;
    }
    
    path.forEach(node => document.querySelector(`[data-row="${node.row}"][data-col="${node.col}"]`).classList.add('path'));
    document.querySelector(`[data-row="${startNode.row}"][data-col="${startNode.col}"]`).classList.add('path');
    
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
        markAsVisited(current);
        debugText.innerText = `Visiting node at (${current.row}, ${current.col})`;

        await new Promise(resolve => setTimeout(resolve, 80));
    }

    debugText.innerText = 'No path found.';
}

// Initialize the grid
createGrid();
