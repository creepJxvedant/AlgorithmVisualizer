let board = Array(9).fill(null).map(() => Array(9).fill(0));
const boardContainer = document.getElementById("board-container");
const debugText = document.getElementById("debug-text");

function renderBoard() {
    boardContainer.innerHTML = "";
    board.forEach((row, r) => {
        row.forEach((num, c) => {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            if ((Math.floor(r / 3) + Math.floor(c / 3)) % 2 === 0) {
                cell.setAttribute("data-block", "true");
            }
            cell.innerText = num || "";
            cell.contentEditable = num === 0 ? "true" : "false";
            cell.addEventListener("input", (e) => handleInput(e, r, c));
            boardContainer.appendChild(cell);
        });
    });
}

function handleInput(e, row, col) {
    const value = parseInt(e.target.innerText, 10);
    board[row][col] = isNaN(value) ? 0 : value;
}

function isValid(num, row, col) {
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num || board[i][col] === num || 
            board[3 * Math.floor(row / 3) + Math.floor(i / 3)][3 * Math.floor(col / 3) + i % 3] === num) {
            return false;
        }
    }
    return true;
}

async function solveSudoku(auto = true) {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (board[r][c] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isValid(num, r, c)) {
                        board[r][c] = num;
                        renderBoard();
                        if (auto) await new Promise((res) => setTimeout(res, 200));
                        if (await solveSudoku(auto)) return true;
                        board[r][c] = 0;
                        renderBoard();
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function stepSolve() {
    solveSudoku(false);
}

function resetBoard() {
    board = Array(9).fill(null).map(() => Array(9).fill(0));
    renderBoard();
    debugText.innerText = "";
}

renderBoard();
