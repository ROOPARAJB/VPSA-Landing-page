const screens = {
  landing: document.getElementById('landing'),
  game: document.getElementById('game')
};

function showScreen(name){
  Object.entries(screens).forEach(([key, el]) => {
    if (key === name) {
      el.hidden = false;
      requestAnimationFrame(() => el.classList.add('active'));
    } else {
      el.classList.remove('active');
      setTimeout(() => {
        if (!el.classList.contains('active')) el.hidden = true;
      }, 600);
    }
  });
}

const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const winLineEl = document.getElementById('winLine');
const winPathEl = winLineEl.querySelector('path');
const wrapEl = document.querySelector('.board-wrap');

const WINS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

const LINE_PATHS = {
  '0,1,2': 'M20,50 L262,50',
  '3,4,5': 'M20,144 L262,144',
  '6,7,8': 'M20,238 L262,238',
  '0,3,6': 'M50,20 L50,262',
  '1,4,7': 'M144,20 L144,262',
  '2,5,8': 'M238,20 L238,262',
  '0,4,8': 'M20,20 L262,262',
  '2,4,6': 'M262,20 L20,262'
};

let board = [];
let cells = [];
let player = '○';
let over = false;

function startGame(){
  board = Array(9).fill('');
  player = '○';
  over = false;
  boardEl.innerHTML = '';
  cells = [];
  winLineEl.classList.remove('show');
  winPathEl.removeAttribute('d');
  statusEl.classList.remove('win');
  statusEl.textContent = player + ' Turn';
  wrapEl.classList.remove('shake');

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.addEventListener('click', () => handleMove(i, cell));
    boardEl.appendChild(cell);
    cells.push(cell);
  }
}

function handleMove(i, cellEl){
  if (over || board[i]) return;

  board[i] = player;
  cellEl.textContent = player;
  cellEl.classList.add('filled', 'pop', player === '○' ? 'o' : 'x');

  const win = findWin();
  if (win) {
    over = true;
    win.forEach(idx => cells[idx].classList.add('win-cell'));
    drawWinLine(win);
    statusEl.textContent = player + ' Wins';
    statusEl.classList.add('win');
    return;
  }

  if (board.every(Boolean)) {
    over = true;
    statusEl.textContent = 'Draw';
    wrapEl.classList.add('shake');
    setTimeout(() => wrapEl.classList.remove('shake'), 400);
    return;
  }

  player = player === '○' ? '✕' : '○';
  statusEl.textContent = player + ' Turn';
}

function findWin(){
  return WINS.find(([a, b, c]) => board[a] && board[a] === board[b] && board[b] === board[c]) || null;
}

function drawWinLine(combo){
  const d = LINE_PATHS[combo.join(',')];
  if (!d) return;
  winPathEl.setAttribute('d', d);
  requestAnimationFrame(() => winLineEl.classList.add('show'));
}

document.getElementById('play').addEventListener('click', () => {
  startGame();
  showScreen('game');
});

document.getElementById('back').addEventListener('click', () => {
  showScreen('landing');
});

document.getElementById('reset').addEventListener('click', () => {
  startGame();
});

startGame();
