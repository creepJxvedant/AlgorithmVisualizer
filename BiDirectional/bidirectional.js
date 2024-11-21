
const numRows = 20;
const numCols = 50;
let grid = [];
let startNode = null;
let endNode = null;
let isRunningAutomatic = false; 
let isMouseDown = false; 
let manualState = null;

const gridContainer = document.getElementById("grid-container");
const nextButton = document.getElementById("next-button");
const startManualButton = document.getElementById("start-manual");
const startAutomaticButton = document.getElementById("start-automatic");
const debugText = document.getElementById("debug-text");

gridContainer.addEventListener('mousedown', () => isMouseDown = true);
gridContainer.addEventListener('mouseup', () => isMouseDown = false);
gridContainer.addEventListener('mouseleave', () => isMouseDown = false);

function createGrid() {
    gridContainer.innerHTML = "";
    grid = [];
    startNode = null;
    endNode = null;

    gridContainer.style.gridTemplateColumns = `repeat(${numCols}, 18px)`;
    gridContainer.style.gridTemplateRows = `repeat(${numRows}, 18px)`;

    for (let row = 0; row < numRows; row++) {
        let gridRow = [];
        for (let col = 0; col < numCols; col++) {
            const cell = createCell(row, col);
            gridRow.push(cell);
            const cellDiv = createCellDiv(cell);
            gridContainer.appendChild(cellDiv);
        }
        grid.push(gridRow);
    }
}

// Create individual cell object
function createCell(row, col) {
    return {
        row,
        col,
        isWall: false,
        isStart: false,
        isEnd: false,
        distanceFromStart: Infinity,
        distanceFromEnd: Infinity,
        previousFromStart: null,
        previousFromEnd: null
    };
}

function createCellDiv(cell) {
    const div = document.createElement("div");
    div.classList.add("cell");
    div.dataset.row = cell.row;
    div.dataset.col = cell.col;
    div.addEventListener('click', () => handleCellClick(div, cell));
    div.addEventListener('mousemove', () => handleCellDrag(div, cell));
    return div;
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

function setEndNode(cell, div) {
    endNode = cell;
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
    resetState();
    createGrid();
    debugText.innerText = 'Click "Start Manual" or "Start Automatic" to begin.';
}


function startAutomatic() {
    if (!startNode || !endNode) {
        debugText.innerText = "Please set both start and end points.";
        return;
    }

    isRunningAutomatic = true;
    nextButton.disabled = true; // Disable the step button in automatic mode
    startAutomaticButton.disabled = true; // Disable the automatic button
    startManualButton.disabled = true; // Disable the manual button
    debugText.innerText = "Automatic mode started. The algorithm will run automatically.";

    runBiDirectionalDijkstra();
}

function runBiDirectionalDijkstra() {
    let pqStart = [startNode]; // Priority queue for the start side
    let pqEnd = [endNode]; // Priority queue for the end side
    startNode.distanceFromStart = 0;
    endNode.distanceFromEnd = 0;

    const visitedFromStart = new Set();
    const visitedFromEnd = new Set();

    const interval = setInterval(() => {
        if (pqStart.length === 0 || pqEnd.length === 0) {
            clearInterval(interval);
            startAutomaticButton.disabled = false; // Re-enable the start button
            debugText.innerText = "No path found.";
            return;
        }

       
        let currentStart = pqStart.shift();
        visitedFromStart.add(currentStart);

        if (visitedFromEnd.has(currentStart)) {
            reconstructPathFromMeetingPoint(currentStart, pqStart, pqEnd);
            clearInterval(interval);
            return;
        }

        markAsVisited(currentStart);
        expandNode(currentStart, pqStart, visitedFromStart, true);

        let currentEnd = pqEnd.shift();
        visitedFromEnd.add(currentEnd);

        if (visitedFromStart.has(currentEnd)) {
            reconstructPathFromMeetingPoint(currentEnd, pqStart, pqEnd);
            clearInterval(interval);
            return;
        }
        markAsVisited(currentEnd);
        expandNode(currentEnd, pqEnd, visitedFromEnd, false);

    }, 30);
}

function markAsVisited(current) {
    const cellDiv = document.querySelector(`[data-row="${current.row}"][data-col="${current.col}"]`);
    cellDiv.classList.add('visited');
    animateFollowingNodes(current);
}

function animateFollowingNodes(current) {
    const cellDiv = document.querySelector(`[data-row="${current.row}"][data-col="${current.col}"]`);
    
    cellDiv.style.transition = "background-color 0.4s ease, transform 0.4s ease";
    cellDiv.style.backgroundColor = 'rgba(255, 255, 0, 0.7)'; // Yellow flow color
    cellDiv.style.transform = "scale(1.1)"; // Slight enlargement for animation effect
    
    setTimeout(() => {
        cellDiv.style.transform = "scale(1)";
    }, 400);
}

function expandNode(current, pq, visited, fromStart) {
    let neighbors = getNeighbors(current);
    for (let neighbor of neighbors) {
        if (neighbor.isWall || visited.has(neighbor)) continue;

        let newDistance = current[fromStart ? "distanceFromStart" : "distanceFromEnd"] + 1;
        const div = document.querySelector(`[data-row="${neighbor.row}"][data-col="${neighbor.col}"]`);

        if (fromStart) {
            if (newDistance < neighbor.distanceFromStart) {
                neighbor.distanceFromStart = newDistance;
                neighbor.previousFromStart = current;
                pq.push(neighbor);
                pq.sort((a, b) => a.distanceFromStart - b.distanceFromStart);
                div.classList.add("visited");
            }
        } else {
            if (newDistance < neighbor.distanceFromEnd) {
                neighbor.distanceFromEnd = newDistance;
                neighbor.previousFromEnd = current;
                pq.push(neighbor);
                pq.sort((a, b) => a.distanceFromEnd - b.distanceFromEnd); 
                div.classList.add("visited");
            }
        }
    }
}



function startManual() {
    if (!startNode || !endNode) {
        debugText.innerText = "Please set both start and end points.";
        return;
    }

    startNode.distanceFromStart = 0;
    endNode.distanceFromEnd = 0;

    manualState = {
        pqStart: [startNode],
        pqEnd: [endNode],
        visitedFromStart: new Set(),
        visitedFromEnd: new Set(),
        meetingPoint: null,
        isCompleted: false,
    };

    startAutomaticButton.disabled = true;
    startManualButton.disabled = true;  
    nextButton.disabled = false;        
    debugText.innerText = "Manual mode started. Click 'Next' to proceed.";
}

function nextStep() {
    if (!manualState || manualState.isCompleted) return;

    const { pqStart, pqEnd, visitedFromStart, visitedFromEnd } = manualState;

    console.log("pqStart:", pqStart);
    console.log("pqEnd:", pqEnd);

    if (pqStart.length === 0 && pqEnd.length === 0) {
        debugText.innerText = "No path found.";
        manualState.isCompleted = true;
        nextButton.disabled = true; // Disable Step button
        return;
    }

    if (pqStart.length > 0) {
        let currentStart = pqStart.shift();
        visitedFromStart.add(currentStart);

        if (visitedFromEnd.has(currentStart)) {
            manualState.meetingPoint = currentStart;
            finalizeManualPath();
            return;
        }

        markAsVisited(currentStart);
        expandNode(currentStart, pqStart, visitedFromStart, true);
    }

    if (pqEnd.length > 0) {
        let currentEnd = pqEnd.shift();
        visitedFromEnd.add(currentEnd);

        if (visitedFromStart.has(currentEnd)) {
            manualState.meetingPoint = currentEnd;
            finalizeManualPath();
            return;
        }

        markAsVisited(currentEnd);
        expandNode(currentEnd, pqEnd, visitedFromEnd, false);
    }
}



function finalizeManualPath() {
    const { meetingPoint } = manualState;
    reconstructPathFromMeetingPoint(meetingPoint);
    debugText.innerText = "Path found!";
    nextButton.disabled = true; 
    manualState.isCompleted = true;
}

function resetState() {
    startNode = null;
    endNode = null;
    grid = [];
    isMouseDown = false;
    nextButton.disabled = true; // Disable Step button initially
    startAutomaticButton.disabled = false;
    startManualButton.disabled = false;
    manualState = null;
}



function reconstructPathFromMeetingPoint(meetingNode, pqStart, pqEnd) {
    let currentNode = meetingNode;
    let path = [];

    while (currentNode) {
        path.push(currentNode);
        currentNode = currentNode.previousFromStart || currentNode.previousFromEnd;
    }

    debugText.innerText = `Found a path with length: ${path.length}`;
    path.reverse(); // Reverse the path so that it goes from start to end
    for (const node of path) {
        const div = document.querySelector(`[data-row="${node.row}"][data-col="${node.col}"]`);
        div.classList.add("path");
    }
}

function reconstructPathFromMeetingPoint(meetingPoint) {
    let path = [];

    let current = meetingPoint;
    while (current !== startNode) {
        path.push(current);
        current = current.previousFromStart;
    }
    path.push(startNode);
    path.reverse();

    current = meetingPoint;
    while (current !== endNode) {
        path.push(current);
        current = current.previousFromEnd;
    }
    path.push(endNode);

    
    // Visualize the path step-by-step
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

function getNeighbors(cell) {
    const directions = [
        { row: -1, col: 0 }, // Up
        { row: 1, col: 0 },  // Down
        { row: 0, col: -1 }, // Left
        { row: 0, col: 1 },  // Right
    ];

    let neighbors = [];
    for (let dir of directions) {
        let newRow = cell.row + dir.row;
        let newCol = cell.col + dir.col;

        // Ensure the neighbor is within bounds
        if (newRow >= 0 && newRow < numRows && newCol >= 0 && newCol < numCols) {
            neighbors.push(grid[newRow][newCol]);
        }
    }
    return neighbors;
}



function generateMaze() {
   
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const cell = grid[row][col];
            const cellDiv = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            
            if (cell.isStart || cell.isEnd) continue;

        
            if (Math.random() < 0.3) { 
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
