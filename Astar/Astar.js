const numRows = 20;
const numCols = 50;
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

gridContainer.addEventListener('mousedown', () => isMouseDown = true);
gridContainer.addEventListener('mouseup', () => isMouseDown = false);
gridContainer.addEventListener('mouseleave', () => isMouseDown = false);


function createGrid() {
    gridContainer.innerHTML = ''; // Clear previous grid
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

// Set the start node
function setStartNode(cell, div) {
    startNode = cell;
    cell.isStart = true;
    div.classList.add('start');
}

function setEndNode(cell, div) {
    endNode = cell;
    cell.isEnd = true;
    div.classList.add('end');
}

// Toggle the wall state of a cell
function toggleWall(cell, div) {
    cell.isWall = !cell.isWall;
    div.classList.toggle('wall', cell.isWall);
}

function getCellFromEvent(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    if (!isNaN(row) && !isNaN(col)) {
        return grid[row][col];
    }
    return null;
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
    markAsVisited(current);
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

function markAsVisited(current) {
    const cellDiv = document.querySelector(`[data-row="${current.row}"][data-col="${current.col}"]`);
    cellDiv.classList.add('visited');
    animateFollowingNodes(current);
}

function animateFollowingNodes(current) {
    const cellDiv = document.querySelector(`[data-row="${current.row}"][data-col="${current.col}"]`);
    
    // Apply the color animation to show it following its neighbors
    cellDiv.style.transition = "background-color 0.4s ease, transform 0.4s ease";
    cellDiv.style.backgroundColor = 'rgba(255, 255, 0, 0.7)'; // Yellow flow color
    cellDiv.style.transform = "scale(1.1)"; // Slight enlargement for animation effect
    
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

    // Include the start node in the path
    path.unshift(startNode);

    // Animate the path
    path.forEach((node, index) => {
        setTimeout(() => {
            const nodeDiv = document.querySelector(`[data-row="${node.row}"][data-col="${node.col}"]`);
            nodeDiv.classList.add('path');
            nodeDiv.style.transition = "background-color 0.3s ease, transform 0.3s ease";
            nodeDiv.style.backgroundColor = 'rgba(0, 0, 255, 0.7)'; // Path color
            nodeDiv.style.transform = "scale(1.2)";
            setTimeout(() => {
                nodeDiv.style.transform = "scale(1)";
            }, 300);
        }, index * 50); // Adjust delay between each step
    });

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
        document.querySelector(`[data-row="${current.row}"][data-col="${current.col}"]`).classList.add('visited');
        debugText.innerText = `Visiting node at (${current.row}, ${current.col})`;

        await new Promise(resolve => setTimeout(resolve, 20));
    }

    debugText.innerText = 'No path found.';
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
