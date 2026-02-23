const board = document.querySelector(".gameboard");
const statusEl = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");

let temparray = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
];

let turnPlayer = 0;
let gameOver = false;

function renderStatus() {
    if (gameOver) return;
    statusEl.textContent = `Turn: ${turnPlayer % 2 === 0 ? "X" : "O"}`;
}

function checkWin() {
    const lines = [
        [[0,0],[0,1],[0,2]],
        [[1,0],[1,1],[1,2]],
        [[2,0],[2,1],[2,2]],
        [[0,0],[1,0],[2,0]],
        [[0,1],[1,1],[2,1]],
        [[0,2],[1,2],[2,2]],
        [[0,0],[1,1],[2,2]],
        [[0,2],[1,1],[2,0]],
    ];

    for (const line of lines) {
        const [a,b,c] = line;
        const v1 = temparray[a[0]][a[1]];
        const v2 = temparray[b[0]][b[1]];
        const v3 = temparray[c[0]][c[1]];
        if (v1 && v1 === v2 && v1 === v3) return { winner: v1, line };
    }

    const isDraw = temparray.flat().every(cell => cell !== "");
    if (isDraw) return { draw: true };
    return null;
}

board.addEventListener("click", (e) => {
    const td = e.target.closest("td");
    if (!td || gameOver) return;
    if (td.textContent.trim() !== "") return;

    const id = td.id;
    const row = parseInt(id[0], 10);
    const col = parseInt(id[1], 10);
    const mark = turnPlayer % 2 === 0 ? "X" : "O";

    td.textContent = mark;
    temparray[row][col] = mark;

    const result = checkWin();
    if (result) {
        if (result.draw) {
            statusEl.textContent = "Draw!";
        } else {
            statusEl.textContent = `${result.winner} wins!`;
            result.line.forEach(([r,c]) => {
                const cell = document.getElementById(`${r}${c}`);
                if (cell) cell.classList.add("win");
            });
        }
        gameOver = true;
        return;
    }

    turnPlayer++;
    renderStatus();
});

resetBtn.addEventListener("click", resetGame);

function resetGame() {
    temparray = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ];
    turnPlayer = 0;
    gameOver = false;
    document.querySelectorAll("td").forEach(td => {
        td.textContent = "";
        td.classList.remove("win");
    });
    statusEl.textContent = "Turn: X";
}

renderStatus();
