import { Game } from './game.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverUI = document.getElementById('gameOver');
const mainMenu = document.getElementById("mainMenu");
const startGameBtn = document.getElementById("startGameBtn");
const highScoreDisplay = document.getElementById("highScoreDisplay");
const restartBtn = document.getElementById("restartBtn");
const roadLineTop = document.querySelector('.road-line.top');
const roadLineBottom = document.querySelector('.road-line.bottom');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

let savedHighScore = localStorage.getItem("highScore") || 0;
highScoreDisplay.textContent = "High Score: " + savedHighScore;

let game;
let isReversed = false;

// Set animasi awal
roadLineTop.style.animation = "moveLeft 2s linear infinite";
roadLineBottom.style.animation = "moveRight 2s linear infinite";

function gameOver(score) {
  let highScore = localStorage.getItem("highScore") || 0;
  if (score > highScore) {
    localStorage.setItem("highScore", score);
    highScoreDisplay.textContent = "High Score: " + score;
  }
  gameOverUI.style.display = "block";
  restartBtn.style.display = "block";
}

startGameBtn.addEventListener("click", (event) => {
  event.stopPropagation(); // Hentikan propagasi agar tidak memicu pembalikan
  mainMenu.style.display = "none";
  canvas.style.display = "block";
  restartBtn.style.display = "none";
  game = new Game(canvas, ctx, gameOver);
  game.start();
});

restartBtn.addEventListener("click", () => {
  restartBtn.style.display = "none";
  gameOverUI.style.display = "none";
  game = new Game(canvas, ctx, gameOver);
  game.start();
});

// Deteksi klik/sentuhan di luar tombol "MAIN"
document.addEventListener("click", (event) => {
  if (mainMenu.style.display !== "none" && !startGameBtn.contains(event.target)) {
    isReversed = !isReversed;
    if (isReversed) {
      roadLineTop.style.animation = "moveLeftReverse 2s linear infinite";
      roadLineBottom.style.animation = "moveRightReverse 2s linear infinite";
    } else {
      roadLineTop.style.animation = "moveLeft 2s linear infinite";
      roadLineBottom.style.animation = "moveRight 2s linear infinite";
    }
  }
});

// Dukungan untuk sentuhan pada perangkat mobile
document.addEventListener("touchstart", (event) => {
  if (mainMenu.style.display !== "none" && !startGameBtn.contains(event.target)) {
    isReversed = !isReversed;
    if (isReversed) {
      roadLineTop.style.animation = "moveLeftReverse 2s linear infinite";
      roadLineBottom.style.animation = "moveRightReverse 2s linear infinite";
    } else {
      roadLineTop.style.animation = "moveLeft 2s linear infinite";
      roadLineBottom.style.animation = "moveRight 2s linear infinite";
    }
  }
});