import { Obstacle } from './obstacle.js';
import { Point } from './point.js';

export class GameEntities {
  constructor(game) {
    this.game = game;
    this.obstacles = [];
    this.points = [];
    this.bullets = [];
    this.destroyParticles = [];
  }

  update() {
    const { frame, speedMultiplier, bossMode, canvas } = this.game;

    if (frame % 60 === 0 && this.obstacles.length < 20) {
      let x, attempts = 0;
      do {
        x = Math.random() * (canvas.width - 32);
        attempts++;
      } while (this.game.isOverlapping(x + 16, 16, 32, 32, [...this.obstacles, ...this.points, ...this.game.powerUps.powerUps]) && attempts < 50);
      if (attempts < 50) {
        this.obstacles.push(new Obstacle(canvas, x));
      }
    }

    if (frame % 90 === 0 && this.points.length < 10) {
      let x, attempts = 0;
      do {
        x = Math.random() * (canvas.width - 16);
        attempts++;
      } while (this.game.isOverlapping(x + 8, -8, 16, 16, [...this.obstacles, ...this.points, ...this.game.powerUps.powerUps]) && attempts < 50);
      if (attempts < 50) {
        this.points.push(new Point(x, -8));
      }
    }

    const initialObstaclesCount = this.obstacles.length;
    this.obstacles.forEach(ob => ob.update(speedMultiplier, bossMode));
    this.obstacles = this.obstacles.filter(ob => !ob.offScreen());
    this.game.obstaclesPassed += initialObstaclesCount - this.obstacles.length;

    this.points.forEach(point => point.update(speedMultiplier * 3));
    this.points = this.points.filter(point => !point.collected && point.y <= canvas.height);
  }

  draw(ctx) {
    this.obstacles.forEach(ob => ob.draw(ctx));
    this.points.forEach(point => point.draw(ctx));
    this.bullets.forEach(bullet => {
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, bullet.radiusOuter, 0, Math.PI * 2);
      ctx.fillStyle = 'yellow';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, bullet.radiusInner, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
    });
    this.destroyParticles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  shootSpecialBullets() {
    if (this.bullets.length < 50) {
      const centerX = this.game.player.x + this.game.player.width / 2;
      const startY = this.game.player.y;
      this.bullets.push(
        { x: centerX, y: startY, radiusOuter: 6, radiusInner: 3, speed: -12, angle: -0.2 },
        { x: centerX, y: startY, radiusOuter: 6, radiusInner: 3, speed: -12, angle: 0 },
        { x: centerX, y: startY, radiusOuter: 6, radiusInner: 3, speed: -12, angle: 0.2 }
      );
    }
  }

  addDestroyParticles(x, y) {
    if (this.destroyParticles.length < 100) {
      for (let i = 0; i < 10; i++) {
        this.destroyParticles.push({
          x,
          y,
          radius: 2 + Math.random() * 3,
          color: `hsl(${Math.random() * 360}, 100%, 50%)`,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          alpha: 1,
        });
      }
    }
  }
}