const { ipcRenderer } = require('electron');

const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');
restartBtn.addEventListener('click', startGame);

let board = Array(9).fill(' ');
let playerSign, computerSign, currentPlayer;

// 


function createBoard() {
  boardEl.innerHTML = '';
  board.forEach((_, idx) => {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = idx;
    cell.addEventListener('click', handleCellClick);
    boardEl.appendChild(cell);
  });
}

function handleCellClick(e) {
  const index = e.target.dataset.index;
  if (board[index] !== ' ' || currentPlayer !== 'player') return;
  makeMove(index, playerSign);
}

function makeMove(index, sign) {
  board[index] = sign;
  updateBoard();
  if (checkWinner(sign)) {
    statusEl.textContent = sign === playerSign ? 'Ви перемогли!' : 'Ви програли!';
    disableBoard();
  } else if (board.every(cell => cell !== ' ')) {
    statusEl.textContent = 'Нічия!';
    disableBoard();
  } else {
    currentPlayer = currentPlayer === 'player' ? 'computer' : 'player';
    if (currentPlayer === 'computer') computerMove();
  }
}

function computerMove() {
  const freeCells = board.map((cell, i) => cell === ' ' ? i : null).filter(i => i !== null);
  const randomIndex = freeCells[Math.floor(Math.random() * freeCells.length)];
  setTimeout(() => makeMove(randomIndex, computerSign), 500);
}

function updateBoard() {
  document.querySelectorAll('.cell').forEach((cell, idx) => {
    cell.textContent = board[idx] !== ' ' ? board[idx] : '';
  });
}

function disableBoard() {
  document.querySelectorAll('.cell').forEach(cell => {
    cell.removeEventListener('click', handleCellClick);
  });
}

function checkWinner(sign) {
  const winCombinations = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  return winCombinations.some(combination =>
    combination.every(index => board[index] === sign)
  );
}

function startGame() {
  board = Array(9).fill(' ');
  if (Math.random() < 0.5) {
    playerSign = 'X';
    computerSign = '0';
    currentPlayer = 'player';
    statusEl.textContent = 'Ваш хід';
  } else {
    playerSign = '0';
    computerSign = 'X';
    currentPlayer = 'computer';
    statusEl.textContent = 'Хід комп\'ютера';
    setTimeout(computerMove, 500);
  }
  createBoard();
}

startGame();
