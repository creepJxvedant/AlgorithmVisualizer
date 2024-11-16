const numRows = 20;
const numCols = 50;
let grid = [];
let startNode = null;
let endNode = null;
let queue = [];
let visitedNodes = [];
let shortestPaths = [];
let isMouseDown = false;
let foundPaths = false;
let isAlgorithmRunning = false;

const gridContainer = document.getElementById("grid-container");
const nextButton = document.getElementById("next-button");
const startAutomaticButton = document.getElementById("start-automatic");
const debugText = document.getElementById("debug-text");

function createGrid() {
    gridContainer.innerHTML = ''; // Clear any previous grid
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
    addMouseEventListeners();
}

function createCell(row, col) {
    return {
        row,
        col,
        isStart: false,
        isEnd: false,
        isWall: false,
        visited: false,
        previous: [],
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
        if (!isAlgorithmRunning) {
            isMouseDown = true;
        }
    });
    
    gridContainer.addEventListener('mousemove', (event) => {
        if (isMouseDown && !isAlgorithmRunning) {
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
    if (isAlgorithmRunning) return; // Prevent cell interaction when the algorithm is running

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
    queue = [];
    visitedNodes = [];
    shortestPaths = [];
    nextButton.disabled = false;
    startAutomaticButton.disabled = false;
    foundPaths = false;
    isAlgorithmRunning = false;
}

async function startManual() {
    if (!startNode || !endNode) {
        alert('Please select both start and end nodes.');
        return;
    }

    queue.push(startNode);
    startNode.visited = true;
    nextButton.disabled = false;
    startAutomaticButton.disabled = true;
    isAlgorithmRunning = true; // Indicate that the algorithm is running
    debugText.innerText = 'Manual mode started. Click "Next Step" to proceed.';
}

function nextStep() {
    if (queue.length === 0) {
        debugText.innerText = 'No path found.';
        return;
    }

    const current = queue.shift();
    visitedNodes.push(current);
    document.querySelector(`[data-row="${current.row}"][data-col="${current.col}"]`).classList.add('visited');

    if (current === endNode && !foundPaths) {
        foundPaths = true;
        reconstructPath(current); // Find the shortest path
        debugText.innerText = 'Shortest path found!';
        return;
    }

    current.neighbors.forEach(neighbor => {
        if (!neighbor.visited && !neighbor.isWall) {
            neighbor.visited = true;
            neighbor.previous = current; // Only store one previous node (for the shortest path)
            queue.push(neighbor);
        }
    });

    debugText.innerText = `Visiting node at (${current.row}, ${current.col})`;
}

function reconstructPath(node) {
    const path = [];
    let currentNode = node;

    while (currentNode !== startNode) {
        path.push(currentNode);
        currentNode = currentNode.previous;
    }
    path.push(startNode);
    path.reverse();

    // Highlight the shortest path
    path.forEach(node => {
        document.querySelector(`[data-row="${node.row}"][data-col="${node.col}"]`).classList.add('path');
    });

    shortestPaths.push(path); // Store the shortest path
}

async function startAutomatic() {
    if (!startNode || !endNode) {
        alert('Please select both start and end nodes.');
        return;
    }

    queue.push(startNode);
    startNode.visited = true;
    nextButton.disabled = true;
    startAutomaticButton.disabled = true;
    isAlgorithmRunning = true; // Indicate that the algorithm is running
    debugText.innerText = 'Automatic mode started. Please wait for the algorithm to finish.';

    while (queue.length > 0) {
        const current = queue.shift();
        visitedNodes.push(current);
        document.querySelector(`[data-row="${current.row}"][data-col="${current.col}"]`).classList.add('visited');

        if (current === endNode && !foundPaths) {
            foundPaths = true;
            reconstructPath(current); // Find the shortest path
            break;
        }

        current.neighbors.forEach(neighbor => {
            if (!neighbor.visited && !neighbor.isWall) {
                neighbor.visited = true;
                neighbor.previous = current; // Only store one previous node (for the shortest path)
                queue.push(neighbor);
            }
        });

        await new Promise(resolve => setTimeout(resolve, 20)); // Allow UI updates
    }

    if (!foundPaths) {
        debugText.innerText = 'No path found.';
    } else {
        debugText.innerText = `Shortest path found!`;
    }

    isAlgorithmRunning = false; // Reset the algorithm status
}


function generateMaze() {
    resetState(); // Clear existing state to prevent conflicts
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const cell = grid[row][col];
            const cellDiv = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            
            // Skip start and end nodes to avoid overwriting them
            if (cell.isStart || cell.isEnd) continue;

            // Randomly decide if this cell should be a wall
            if (Math.random() < 0.3) { // Adjust probability (0.3 for ~30% walls)
                cell.isWall = true;
                cellDiv.classList.add('wall');
            } else {
                cell.isWall = false;
                cellDiv.classList.remove('wall');
            }
        }
    }
    debugText.innerText = 'Random maze generated!';
}


createGrid();
