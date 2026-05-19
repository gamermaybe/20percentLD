// Simple Snake game in JavaScript
// Grid-based implementation using an HTML5 canvas

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Size of one grid cell in pixels
const CELL = 20;

// Compute number of columns/rows from canvas size
const COLS = canvas.width / CELL;
const ROWS = canvas.height / CELL;

// Game state variables
let snake;      // array of {x,y} cells (head at index 0)
let dir;        // current movement direction {x, y}
let nextDir;    // buffered direction from user input
let food;       // {x,y} position of food
let score;      // integer score
let loopId;     // interval id for game loop
const TICK = 100; // ms per game tick

// Initialize (or reset) the game state
function init() {
  snake = [ { x: Math.floor(COLS/2), y: Math.floor(ROWS/2) } ];
  dir = { x: 0, y: 0 };
  nextDir = { x: 0, y: 0 };
  food = randomCell();
  score = 0;
  document.getElementById('score').textContent = 'Score: 0';
}

// Start or restart the game loop
function start() {
  stop(); // clear any existing loop
  init();
  // Start game ticks
  loopId = setInterval(tick, TICK);
}

// Stop the game loop
function stop() {
  if (loopId) {
    clearInterval(loopId);
    loopId = null;
  }
}

// Return a random cell position not occupied by the snake
function randomCell() {
  while (true) {
    const pos = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS)
    };
    // ensure food doesn't appear on the snake
    if (!snake.some(s => s.x === pos.x && s.y === pos.y)) return pos;
  }
}

// Handle single game tick: move, eat, check collisions, draw
function tick() {
  // Apply buffered direction if it is valid (no reverse)
  if (!isReverse(nextDir, dir)) {
    dir = nextDir;
  }

  // If dir is zero, game is paused until user moves
  if (dir.x === 0 && dir.y === 0) {
    draw();
    return;
  }

  // Compute new head position
  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

  // Check wall collision -> game over
  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
    gameOver();
    return;
  }

  // Check self-collision -> game over
  if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
    gameOver();
    return;
  }

  // Add head to front of snake
  snake.unshift(head);

  // Check food
  if (head.x === food.x && head.y === food.y) {
    score += 1;
    document.getElementById('score').textContent = 'Score: ' + score;
    food = randomCell();
  } else {
    // remove tail if no food eaten (keep length constant)
    snake.pop();
  }

  draw();
}

// Draw the whole scene: background, snake, food
function draw() {
  // Clear canvas
  ctx.fillStyle = '#071025';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw food
  ctx.fillStyle = '#f97316';
  drawCell(food.x, food.y);

  // Draw snake (head brighter)
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? '#34d399' : '#10b981';
    drawCell(snake[i].x, snake[i].y);
  }
}

// Draw a single cell at grid coordinates
function drawCell(cx, cy) {
  ctx.fillRect(cx * CELL + 1, cy * CELL + 1, CELL - 2, CELL - 2);
}

// Simple game over handler
function gameOver() {
  stop();
  // Show a brief alert and allow restart
  setTimeout(() => { alert('Game Over! Score: ' + score); }, 10);
}

// Check whether newDir is the reverse of oldDir
function isReverse(newDir, oldDir) {
  return newDir.x === -oldDir.x && newDir.y === -oldDir.y;
}

// Keyboard input (arrow keys + WASD)
window.addEventListener('keydown', (e) => {
  const key = e.key;
  let nd = null;
  if (key === 'ArrowUp' || key === 'w' || key === 'W') nd = { x: 0, y: -1 };
  if (key === 'ArrowDown' || key === 's' || key === 'S') nd = { x: 0, y: 1 };
  if (key === 'ArrowLeft' || key === 'a' || key === 'A') nd = { x: -1, y: 0 };
  if (key === 'ArrowRight' || key === 'd' || key === 'D') nd = { x: 1, y: 0 };
  if (nd) {
    // Buffer the direction; it will be validated at the next tick
    // Prevent the page from scrolling when arrows are pressed
    e.preventDefault();
    // Do not allow reversing into yourself in the same frame
    if (!isReverse(nd, dir)) nextDir = nd;
  }
});

// Start/restart button
document.getElementById('startBtn').addEventListener('click', () => start());

// Initialize and draw initial frame
init();
draw();
