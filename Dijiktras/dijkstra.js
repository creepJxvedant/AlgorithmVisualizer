const numRows =10;
const numCols = 25;
let grid = [];
let startNode = null;
let endNode = null;
let openSet = [];
let closedSet = [];
let path = [];
let isAutomatic = false;

const gridContainer = document.getElementById("grid-container");
const nextButton = document.getElementById("next-button");
const startAutomaticButton = document.getElementById("start-automatic");
const debugText = document.getElementById("debug-text");



function createGrid() {
    gridContainer.innerHTML = ''; // Clear previous grid
    grid = [];
    
    // Set grid dimensions dynamically
    gridContainer.style.gridTemplateColumns = `repeat(${numCols}, 36px)`;
    gridContainer.style.gridTemplateRows = `repeat(${numRows}, 36px)`;
    
    for (let row = 0; row < numRows; row++) {
        let gridRow = [];
        for (let col = 0; col < numCols; col++) {
            const cell = {
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
            gridRow.push(cell);
            const div = document.createElement('div');
            div.classList.add('cell');
            div.dataset.row = row;
            div.dataset.col = col;
            gridContainer.appendChild(div);

            div.addEventListener('click', () => handleCellClick(div, cell));
        }
        grid.push(gridRow);
    }

    // Add neighbors for each cell
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
        startNode = cell;
        cell.isStart = true;
        div.classList.add('start');
    } else if (!endNode) {
        endNode = cell;
        cell.isEnd = true;
        div.classList.add('end');
    } else if (!cell.isStart && !cell.isEnd) {
        cell.isWall = !cell.isWall; // Toggle wall state
        div.classList.toggle('wall', cell.isWall);
    }
}

function resetGrid() {
    gridContainer.innerHTML = '';
    createGrid();
    startNode = null;
    endNode = null;
    openSet = [];
    closedSet = [];
    path = [];
    isAutomatic = false;
    nextButton.disabled = false;
    startAutomaticButton.disabled = false;
    debugText.innerText = 'Click "Start Manual" or "Start Automatic" to begin.';
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

    document.querySelector(`[data-row="${current.row}"][data-col="${current.col}"]`).classList.add('visited');
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

function reconstructPath() {
    let temp = endNode;
    while (temp.previous) {
        path.unshift(temp);
        temp = temp.previous;
    }
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

        await new Promise(resolve => setTimeout(resolve, 300));
    }

    debugText.innerText = 'No path found.';
}

// Initialize grid
createGrid();
