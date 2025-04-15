import { PowerUp } from './powerup.js';

export class GamePowerUps {
  constructor(game) {
    this.game = game;
    this.powerUps = [];
    this.magnetEndTime = 0;
    this.doubleEndTime = 0;
    this.shieldEndTime = 0;
  }

  update() {
    const { frame, speedMultiplier, player, canvas } = this.game;

    if (frame % 300 === 0 && this.powerUps.length < 5) {
      let x, attempts = 0;
      do {
        x = Math.random() * (canvas.width - 28);
        attempts++;
      } while (this.game.isOverlapping(x + 14, -14, 28, 28, [...this.game.entities.obstacles, ...this.game.entities.points, ...this.powerUps]) && attempts < 50);
      if (attempts < 50) {
        const type = Math.random() < 0.33 ? 'magnet' : Math.random() < 0.66 ? 'double' : 'shield';
        this.powerUps.push(new PowerUp(x, -14, type));
      }
    }

    this.powerUps.forEach(pu => {
      pu.update(speedMultiplier * 3);
      if (!pu.collected && pu.checkCollision(player)) {
        this.activatePowerUp(pu);
      }
    });
    this.powerUps = this.powerUps.filter(pu => !pu.collected);
  }

  draw(ctx) {
    this.powerUps.forEach(pu => pu.draw(ctx, false));
  }

  activatePowerUp(pu) {
    pu.collected = true;
    pu.activate(this.game.player);
    const now = Date.now();
    if (pu.type === 'magnet') {
      this.magnetEndTime = now + 12000;
    } else if (pu.type === 'double') {
      this.doubleEndTime = now + 12000;
    } else if (pu.type === 'shield') {
      this.shieldEndTime = now + 15000;
    }
  }
}