#!/usr/bin/env node
// Terminal Snake game (Node.js)
// Run: `node cli.js` or `npm run play:terminal`

const w = 30;
const h = 16;
let snake = [{ x: Math.floor(w / 2), y: Math.floor(h / 2) }];
let dir = { x: 1, y: 0 };
let nextDir = { x: 1, y: 0 };
let food = null;
let score = 0;
let tick = 120; // ms
let running = true;
let interval = null;
const isTest = process.argv.includes('--test');
const maxTestTicks = 10;
let testTicks = 0;

function randCell() {
  while (true) {
    const p = { x: Math.floor(Math.random() * w), y: Math.floor(Math.random() * h) };
    if (!snake.some(s => s.x === p.x && s.y === p.y)) return p;
  }
}

function draw() {
  // move cursor to top-left and clear
  process.stdout.write('\x1b[2J');
  process.stdout.write('\x1b[H');
  // top border
  process.stdout.write('+' + '-'.repeat(w) + '+\n');
  for (let y = 0; y < h; y++) {
    let row = '|';
    for (let x = 0; x < w; x++) {
      if (food && food.x === x && food.y === y) row += '*';
      else if (snake.some((s, i) => s.x === x && s.y === y)) {
        const i = snake.findIndex(s => s.x === x && s.y === y);
        row += i === 0 ? 'O' : 'o';
      } else row += ' ';
    }
    row += '|\n';
    process.stdout.write(row);
  }
  process.stdout.write('+' + '-'.repeat(w) + '+\n');
  process.stdout.write('Score: ' + score + '\n');
  process.stdout.write('Use arrow keys or WASD. Press Q to quit.');
}

function isReverse(a, b) {
  return a.x === -b.x && a.y === -b.y;
}

function gameOver() {
  clearInterval(interval);
  running = false;
  process.stdout.write('\nGame Over! Score: ' + score + '\n');
  cleanupAndExit(0);
}

function cleanupAndExit(code = 0) {
  try {
    process.stdin.setRawMode(false);
  } catch (e) {}
  process.stdin.pause();
  process.exit(code);
}

function step() {
  if (!running) return;
  if (!isReverse(nextDir, dir)) dir = nextDir;
  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
  // wall collision
  if (head.x < 0 || head.x >= w || head.y < 0 || head.y >= h) {
    gameOver();
    return;
  }
  // self collision
  if (snake.some(s => s.x === head.x && s.y === head.y)) {
    gameOver();
    return;
  }
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    score += 1;
    food = randCell();
  } else {
    snake.pop();
  }
  draw();
  if (isTest) {
    testTicks += 1;
    if (testTicks >= maxTestTicks) {
      clearInterval(interval);
      cleanupAndExit(0);
    }
  }
}

// input handling
process.stdin.setEncoding('utf8');
if (!isTest) {
  try { process.stdin.setRawMode(true); } catch (e) {}
  process.stdin.resume();
  process.stdin.on('data', (key) => {
    if (key === '\u0003') { // ctrl+c
      cleanupAndExit(0);
    }
    // arrow keys are escape sequences
    if (key === '\u001b[A' || key === 'w' || key === 'W') nextDir = { x: 0, y: -1 };
    else if (key === '\u001b[B' || key === 's' || key === 'S') nextDir = { x: 0, y: 1 };
    else if (key === '\u001b[D' || key === 'a' || key === 'A') nextDir = { x: -1, y: 0 };
    else if (key === '\u001b[C' || key === 'd' || key === 'D') nextDir = { x: 1, y: 0 };
    else if (key === 'q' || key === 'Q') cleanupAndExit(0);
  });
}

// init
food = randCell();
score = 0;
draw();
interval = setInterval(step, tick);

// ensure exit on SIGINT
process.on('SIGINT', () => cleanupAndExit(0));
