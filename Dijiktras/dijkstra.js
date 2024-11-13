const numRows = 10;
const numCols = 10;
let grid = [];
let startNode = null;
let endNode = null;
let openSet = [];
let closedSet = [];
let path = [];
let isSorting = false;
let currentStep = 0;
let isAutomatic = false; // For auto mode control

const gridContainer = document.getElementById("grid-container");
const nextButton = document.getElementById("next-button");
const startAutomaticButton = document.getElementById("start-automatic");
const debugText = document.getElementById("debug-text");


function createGrid() {
    grid = [];
    for (let row = 0; row < numRows; row++) {
        let gridRow = [];
        for (let col = 0; col < numCols; col++) {
            const cell = {
                row,
                col,
                isStart: false,
                isEnd: false,
                f: Infinity,
                g: Infinity,
                h: Infinity,
                neighbors: [],
                previous: null,
                visited: false
            };
            gridRow.push(cell);
            const div = document.createElement('div');
            div.classList.add('cell');
            div.dataset.row = row;
            div.dataset.col = col;
            gridContainer.appendChild(div);

            div.addEventListener('click', () => {
                if (!startNode) {
                    startNode = cell;
                    div.classList.add('start');
                } else if (!endNode) {
                    endNode = cell;
                    div.classList.add('end');
                }
            });
        }
        grid.push(gridRow);
    }

    
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

function resetGrid() {
    gridContainer.innerHTML = '';
    createGrid();
    startNode = null;
    endNode = null;
    openSet = [];
    closedSet = [];
    path = [];
    currentStep = 0;
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

// The next step in Dijkstra's algorithm (for manual mode)
function nextStep() {
    if (openSet.length === 0) {
        debugText.innerText = 'No path found.';
        return;
    }

    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift();
    current.visited = true;


    if (current === endNode) {
        let temp = current;
        while (temp.previous) {
            path.unshift(temp);
            temp = temp.previous;
        }

        path.forEach(node => {
            const cell = grid[node.row][node.col];
            document.querySelector(`[data-row="${node.row}"][data-col="${node.col}"]`).classList.add('path');
        });
        debugText.innerText = 'Path found!';
        nextButton.disabled = true;
        return;
    }

    
    current.neighbors.forEach(neighbor => {
        if (!neighbor.visited) {
            const tempG = current.g + 1;
            if (tempG < neighbor.g) {
                neighbor.previous = current;
                neighbor.g = tempG;
                neighbor.f = neighbor.g + heuristic(neighbor, endNode);
                openSet.push(neighbor);
            }
        }
    });

    
    const currentCell = document.querySelector(`[data-row="${current.row}"][data-col="${current.col}"]`);
    currentCell.classList.add('visited');
    
    debugText.innerText = `Visiting node at (${current.row}, ${current.col})`;
}

// Start automatic Dijkstra's algorithm
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

        debugText.innerText = `Visiting node at -----> (${current.row}, ${current.col})`;


        // If we reach the end node, reconstruct the path
        if (current === endNode) {
            let temp = current;
            while (temp.previous) {
                path.unshift(temp);
                temp = temp.previous;
                
            }
        
            path.forEach(node => {
                const cell = grid[node.row][node.col];
             
                document.querySelector(`[data-row="${node.row}"][data-col="${node.col}"]`).classList.add('path');
            });
           
            debugText.innerText =`Path found!`;
            
            return;
        }

        // Update neighbors
        current.neighbors.forEach(neighbor => {
            if (!neighbor.visited) {
                const tempG = current.g + 1;
                if (tempG < neighbor.g) {
                    neighbor.previous = current;
                    neighbor.g = tempG;
                    neighbor.f = neighbor.g + heuristic(neighbor, endNode);
                    openSet.push(neighbor);
                }
            }
        });

        // Mark the current node as visited
                const currentCell = document.querySelector(`[data-row="${current.row}"][data-col="${current.col}"]`);
        currentCell.classList.add('visited');
        
        await new Promise(resolve => setTimeout(resolve, 300));
    }

    debugText.innerText = 'No path found.';
}

createGrid();
