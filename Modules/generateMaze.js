export function ModulegenerateMaze(numRows,numCols,grid){
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const cell = grid[row][col];
            const cellDiv = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            
            if (cell.isStart || cell.isEnd) continue;

            if (Math.random() < 0.3) { // Adjust probability (0.3 for ~30% walls)
                cell.isWall = true;
                cellDiv.classList.add('wall');
            } else {
                cell.isWall = false;
                cellDiv.classList.remove('wall');
            }
        }
    }
}