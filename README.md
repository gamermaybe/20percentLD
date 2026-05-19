# 20percentLD

Simple Snake game (JavaScript, HTML, CSS).

To run locally:

1. Open [index.html](index.html) directly in your browser (file://), or run a local static server.

Quick with npx (no install):

```bash
npx http-server -p 8000
# then open http://localhost:8000/
```

Or use npm scripts (recommended):

```bash
npm install        # install dev server (one-time)
npm start          # starts a static server on port 8000
# then open http://localhost:8000/
```

How to play:

- Press the Start / Restart button to begin the game.
- Use the arrow keys or WASD to move the snake.
- Eat the orange food squares to grow longer and increase your score.
- Avoid running into the walls or into the snake's own body.
- The game ends when the snake collides with the border or itself.

Files:
- [index.html](index.html)
- [style.css](style.css)
- [script.js](script.js)

Optional: publish to GitHub Pages by enabling Pages in your repo settings (serve the `main` branch or `gh-pages`).

Play in terminal (Node.js)

1. Install dependencies:

```bash
npm install
```

2. Run the terminal game:

```bash
npm run play:terminal
```

For CI/test use, you can run a short non-interactive session:

```bash
node cli.js --test
```
