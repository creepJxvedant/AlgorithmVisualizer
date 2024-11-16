const numRows = 20;
const numCols = 50;
let grid = [];
let startNode = null;
let endNode = null;
let stack = [];
let visitedNodes = [];
let path = []; // To track the path
let isMouseDown = false;
let isAutomatic = false;
let isRunning = false; // To track if the algorithm is running

const gridContainer = document.getElementById("grid-container");
const nextButton = document.getElementById("next-button");
const startAutomaticButton = document.getElementById("start-automatic");
const debugText = document.getElementById("debug-text");

gridContainer.addEventListener('mousedown', () => isMouseDown = true);
gridContainer.addEventListener('mouseup', () => isMouseDown = false);
gridContainer.addEventListener('mouseleave', () => isMouseDown = false);


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
        visited: false,
        previous: null, // To track path
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
    div.classList.add('start');
}

// Set the end node
function setEndNode(cell, div) {
    endNode = cell;
    cell.isEnd = true;
    div.classList.add('end');
}

function toggleWall(cell, div) {
    cell.isWall = !cell.isWall;
    div.classList.toggle('wall', cell.isWall);
}

// Handle cell drag event (to create walls)
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
    stack = [];
    visitedNodes = [];
    path = [];
    isAutomatic = false;
    isRunning = false; // Reset running flag
    nextButton.disabled = false;
    startAutomaticButton.disabled = false;
}

async function startManual() {
    if (!startNode || !endNode) {
        alert('Please select both start and end nodes.');
        return;
    }

    stack.push(startNode);
    startNode.visited = true;
    isRunning = true; // Mark as running

    nextButton.disabled = false;
    startAutomaticButton.disabled = true;
    debugText.innerText = 'Manual mode started. Click "Next Step" to proceed.';
}

function nextStep() {
    if (stack.length === 0) {
        debugText.innerText = 'No path found.';
        return;
    }

    const current = stack.pop();
    visitedNodes.push(current);
    document.querySelector(`[data-row="${current.row}"][data-col="${current.col}"]`).classList.add('visited');

    if (current === endNode) {
        reconstructPath();
        return;
    }

    current.neighbors.forEach(neighbor => {
        if (!neighbor.visited && !neighbor.isWall) {
            neighbor.visited = true;
            neighbor.previous = current; // Track the previous node for path reconstruction
            stack.push(neighbor);
        }

    });
    markAsVisited(current);
    debugText.innerText = `Visiting node at (${current.row}, ${current.col})`;
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
    const delay = 100; // Delay for path animation

    // Animation for path reconstruction (highlight one by one)
    while (temp.previous) {
        path.unshift(temp);
        temp = temp.previous;
    }
    
    path.forEach((node, index) => {
        setTimeout(() => {
            const nodeDiv = document.querySelector(`[data-row="${node.row}"][data-col="${node.col}"]`);
            // Color the node as part of the path
            nodeDiv.classList.add('path');
            nodeDiv.style.transition = "background-color 0.3s ease, transform 0.3s ease";
            nodeDiv.style.backgroundColor = 'rgba(0, 0, 255, 0.7)'; // Path color
            nodeDiv.style.transform = "scale(1.2)"; // Slight scaling animation for visual effect
            setTimeout(() => {
                nodeDiv.style.transform = "scale(1)";
            }, 300);
        }, index * delay);
    });

    // Ensure start node is included in the path with color
    const startDiv = document.querySelector(`[data-row="${startNode.row}"][data-col="${startNode.col}"]`);
    startDiv.classList.add('path');
    startDiv.style.backgroundColor = 'rgba(0, 0, 255, 0.7)'; // Path color for start node
    
    debugText.innerText = 'Path found!';
    nextButton.disabled = true;
}



async function startAutomatic() {
    if (!startNode || !endNode) {
        alert('Please select both start and end nodes.');
        return;
    }

    stack.push(startNode);
    startNode.visited = true;
    isRunning = true; // Mark as running

    nextButton.disabled = true;
    startAutomaticButton.disabled = true;
    debugText.innerText = 'Automatic mode started. Please wait for the algorithm to finish.';

    while (stack.length > 0) {
        const current = stack.pop();
        visitedNodes.push(current);
        document.querySelector(`[data-row="${current.row}"][data-col="${current.col}"]`).classList.add('visited');

        if (current === endNode) {
            reconstructPath();
            return;
        }

        current.neighbors.forEach(neighbor => {
            if (!neighbor.visited && !neighbor.isWall) {
                neighbor.visited = true;
                neighbor.previous = current; // Track the previous node for path reconstruction
                stack.push(neighbor);
            }
        });
        markAsVisited(current);
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
