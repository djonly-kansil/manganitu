import { GameUpdater } from './gameUpdater.js';
import { GameRenderer } from './gameRenderer.js';
import { GameEntities } from './gameEntities.js';
import { GamePowerUps } from './gamePowerUps.js';
import { GameUI } from './gameUI.js';
import { GameIndicatorBars } from './gameIndicatorBars.js'; // Tambah impor
import { Player } from './player.js';
import { Road } from './road.js';

export class Game {
  constructor(canvas, ctx, onGameOver) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.onGameOver = onGameOver;
    this.player = new Player(canvas);
    this.road = new Road(canvas);
    this.entities = new GameEntities(this);
    this.powerUps = new GamePowerUps(this);
    this.ui = new GameUI(this);
    this.indicatorBars = new GameIndicatorBars(this); // Tambah instance
    this.updater = new GameUpdater(this);
    this.renderer = new GameRenderer(this);
    this.running = false;
    this.touchSide = null;
    this.frame = 0;
    this.explosion = null;
    this.specialShotActive = false;
    this.specialShotDuration = 300;
    this.specialShotFrame = 0;
    this.pointCount = 0;
    this.maxPoints = 10;
    this.speedMultiplier = 1;
    this.bossMode = false;
    this.obstaclesPassed = 0;

    canvas.addEventListener('touchstart', (e) => {
      const x = e.touches[0].clientX;
      this.touchSide = x < canvas.width / 2 ? 'left' : 'right';
    });
    canvas.addEventListener('touchend', () => {
      this.touchSide = null;
    });
  }

  isOverlapping(x, y, width, height, existingItems) {
    for (let item of existingItems) {
      const itemX = item.x + (item.width ? item.width / 2 : item.radius || 0);
      const itemY = item.y + (item.height ? item.height / 2 : item.radius || 0);
      const dx = x - itemX;
      const dy = y - itemY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDistance = (width / 2) + (item.width ? item.width / 2 : item.radius || 14) + 10;
      if (distance < minDistance) return true;
    }
    return false;
  }

  start() {
    this.running = true;
    this.loop();
  }

  loop() {
    if (!this.running) return;
    this.frame++;
    this.updater.update();
    this.renderer.draw();
    requestAnimationFrame(() => this.loop());
  }
}