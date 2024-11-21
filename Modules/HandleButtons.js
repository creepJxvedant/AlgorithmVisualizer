export function setStartNode(cell, div) {
    cell.isStart = true;
    div.classList.add('start');
}

export function setEndNode(cell, div) {
    cell.isEnd = true;
    div.classList.add('end');
}

export function toggleWall(cell, div) {
    cell.isWall = !cell.isWall;
    div.classList.toggle('wall', cell.isWall);
}


export function handleCellDrag(div, cell) {
    if (!cell.isStart && !cell.isEnd && !cell.isWall) {
        cell.isWall = true;
        div.classList.add('wall');
    }
}