const board = document.getElementById("board");
const statusText = document.getElementById("status");

let cells = [];
let gameState = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = false;
let mode = "player";

const winningConditions = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function setMode(selectedMode) {
  mode = selectedMode;
  resetGame();
}

function createBoard() {
  board.innerHTML = "";
  cells = [];

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleCellClick);
    board.appendChild(cell);
    cells.push(cell);
  }
}

function handleCellClick(e) {
  const index = e.target.dataset.index;

  if (gameState[index] !== "" || !gameActive) return;

  makeMove(index, currentPlayer);

  if (mode === "computer" && gameActive && currentPlayer === "O") {
    setTimeout(computerMove, 500);
  }
}

function makeMove(index, player) {
  gameState[index] = player;
  cells[index].textContent = player;

  checkResult();

  currentPlayer = currentPlayer === "X" ? "O" : "X";

  if (gameActive) {
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
  }
}

function computerMove() {
  let emptyCells = gameState
    .map((val, i) => val === "" ? i : null)
    .filter(v => v !== null);

  if (emptyCells.length === 0) return;

  const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  makeMove(randomIndex, "O");
}

function checkResult() {
  let roundWon = false;
  let winningCombo = [];

  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];
    if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
      roundWon = true;
      winningCombo = [a, b, c];
      break;
    }
  }

  if (roundWon) {
    statusText.textContent = `Player ${currentPlayer} Wins!`;
    gameActive = false;

    winningCombo.forEach(index => {
      cells[index].classList.add("winning");
    });

    return;
  }

  if (!gameState.includes("")) {
    statusText.textContent = "It's a Draw!";
    gameActive = false;
  }
}

function resetGame() {
  gameState = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  statusText.textContent = `Player ${currentPlayer}'s Turn`;
  createBoard();
}

createBoard();