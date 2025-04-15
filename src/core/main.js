import { Game } from './src/core/game.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverUI = document.getElementById('gameOver');
const mainMenu = document.getElementById("mainMenu");
const startGameBtn = document.getElementById("startGameBtn");
const highScoreDisplay = document.getElementById("highScoreDisplay");
const restartBtn = document.getElementById("restartBtn");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

let savedHighScore = localStorage.getItem("highScore") || 0;
highScoreDisplay.textContent = "High Score: " + savedHighScore;

let game;

function gameOver(score) {
  let highScore = localStorage.getItem("highScore") || 0;
  if (score > highScore) {
    localStorage.setItem("highScore", score);
    highScoreDisplay.textContent = "High Score: " + score;
  }
  gameOverUI.style.display = "block";
}

startGameBtn.addEventListener("click", () => {
  mainMenu.style.display = "none";
  canvas.style.display = "block";
  gameOverUI.style.display = "none";
  game = new Game(canvas, ctx, gameOver);
  game.start();
});

restartBtn.addEventListener("click", () => {
  gameOverUI.style.display = "none";
  game = new Game(canvas, ctx, gameOver);
  game.start();
});