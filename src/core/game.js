import { Player } from '../entities/player.js';
import { Obstacle } from '../entities/obstacle.js';
import { Road } from '../entities/road.js';
import { detectCollision } from './utils.js';
import { Explosion } from '../entities/explosion.js';
import { Point } from '../entities/point.js';
import { PowerUp } from '../entities/powerup.js';
import { Renderer } from '../ui/renderer.js';

export class Game {
  constructor(canvas, ctx, onGameOver) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.onGameOver = onGameOver;
    this.player = new Player(canvas);
    this.road = new Road(canvas);
    this.obstacles = [];
    this.points = [];
    this.powerUps = [];
    this.bullets = [];
    this.destroyParticles = [];
    this.score = 0;
    this.pointCount = 0;
    this.maxPoints = 10;
    this.specialShotActive = false;
    this.specialShotDuration = 300;
    this.specialShotFrame = 0;
    this.frame = 0;
    this.running = false;
    this.touchSide = null;
    this.level = 0;
    this.framesSinceLevelUp = 0;
    this.levelInterval = 600;
    this.bossMode = false;
    this.bossModeDuration = 900;
    this.levelUpMessageFrame = 0;
    this.showLevelUpMessage = false;
    this.speedMultiplier = 1;
    this.explosion = null;
    this.player.magnetActive = false;
    this.player.doublePointActive = false;
    this.player.shieldActive = false;
    this.magnetBarWidth = 0;
    this.doubleBarWidth = 0;
    this.shieldBarWidth = 0;
    this.pointBarWidth = 0;
    this.magnetEndTime = 0;
    this.doubleEndTime = 0;
    this.shieldEndTime = 0;
    this.obstaclesPassed = 0;
    this.renderer = new Renderer(this); // Inisialisasi renderer

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
    this.update();
    this.renderer.draw(); // Panggil renderer
    requestAnimationFrame(() => this.loop());
  }

  update() {
    if (this.explosion) {
      this.explosion.update();
      if (this.explosion.finished) {
        this.running = false;
        if (typeof this.onGameOver === 'function') {
          this.onGameOver(this.score);
        }
      }
      return;
    }

    this.road.update();
    this.player.update(this.touchSide);

    if (this.frame % 60 === 0 && this.obstacles.length < 20) {
      let x, attempts = 0;
      do {
        x = Math.random() * (this.canvas.width - 32);
        attempts++;
      } while (this.isOverlapping(x + 16, 16, 32, 32, [...this.obstacles, ...this.points, ...this.powerUps]) && attempts < 50);
      if (attempts < 50) {
        this.obstacles.push(new Obstacle(this.canvas, x));
      } else {
        x = 0;
        while (this.isOverlapping(x + 16, 16, 32, 32, [...this.obstacles, ...this.points, ...this.powerUps])) {
          x += 32;
          if (x + 32 > this.canvas.width) {
            x = this.canvas.width - 32;
            break;
          }
        }
        this.obstacles.push(new Obstacle(this.canvas, x));
      }
    }

    if (!this.specialShotActive && this.frame % 90 === 0 && this.points.length < 10) {
      let x, attempts = 0;
      do {
        x = Math.random() * (this.canvas.width - 16);
        attempts++;
      } while (this.isOverlapping(x + 8, -8, 16, 16, [...this.obstacles, ...this.points, ...this.powerUps]) && attempts < 50);
      if (attempts < 50) {
        this.points.push(new Point(x, -8));
      } else {
        x = 0;
        while (this.isOverlapping(x + 8, -8, 16, 16, [...this.obstacles, ...this.points, ...this.powerUps])) {
          x += 16;
          if (x + 16 > this.canvas.width) {
            x = this.canvas.width - 16;
            break;
          }
        }
        this.points.push(new Point(x, -8));
      }
    }

    if (this.frame % 300 === 0 && this.powerUps.length < 5) {
      let x, attempts = 0;
      do {
        x = Math.random() * (this.canvas.width - 28);
        attempts++;
      } while (this.isOverlapping(x + 14, -14, 28, 28, [...this.obstacles, ...this.points, ...this.powerUps]) && attempts < 50);
      if (attempts < 50) {
        const type = Math.random() < 0.33 ? 'magnet' : Math.random() < 0.66 ? 'double' : 'shield';
        this.powerUps.push(new PowerUp(x, -14, type));
      } else {
        x = 0;
        while (this.isOverlapping(x + 14, -14, 28, 28, [...this.obstacles, ...this.points, ...this.powerUps])) {
          x += 28;
          if (x + 28 > this.canvas.width) {
            x = this.canvas.width - 28;
            break;
          }
        }
        const type = Math.random() < 0.33 ? 'magnet' : Math.random() < 0.66 ? 'double' : 'shield';
        this.powerUps.push(new PowerUp(x, -14, type));
      }
    }

    if (this.player.shieldActive && this.frame % 10 === 0 && this.bullets.length < 50) {
      this.bullets.push({
        x: this.player.x + this.player.width / 2,
        y: this.player.y,
        radiusOuter: 6,
        radiusInner: 3,
        speed: -8
      });
    }

    if (this.pointCount >= this.maxPoints && !this.specialShotActive) {
      this.specialShotActive = true;
      this.specialShotFrame = 0;
      this.pointCount = 0;
      this.shootSpecialBullets();
    }

    if (this.specialShotActive) {
      this.specialShotFrame++;
      if (this.specialShotFrame % 15 === 0) {
        this.shootSpecialBullets();
      }
      if (this.specialShotFrame >= this.specialShotDuration) {
        this.specialShotActive = false;
      }
    }

    this.obstacles.forEach(ob => ob.update(this.speedMultiplier, this.bossMode));
    const initialObstaclesCount = this.obstacles.length;
    this.obstacles = this.obstacles.filter(ob => !ob.offScreen());
    this.obstaclesPassed += initialObstaclesCount - this.obstacles.length;

    this.points.forEach(point => point.update(this.speedMultiplier * 3));
    this.points = this.points.filter(point => !point.collected && point.y <= this.canvas.height);

    const now = Date.now();
    this.player.magnetActive = now < this.magnetEndTime;
    this.player.doublePointActive = now < this.doubleEndTime;
    this.player.shieldActive = now < this.shieldEndTime;

    const barWidthMax = (this.canvas.width - 50) / 4;
    this.magnetBarWidth = this.player.magnetActive ? Math.min(((this.magnetEndTime - now) / 12000) * barWidthMax, barWidthMax) : 0;
    this.doubleBarWidth = this.player.doublePointActive ? Math.min(((this.doubleEndTime - now) / 12000) * barWidthMax, barWidthMax) : 0;
    this.shieldBarWidth = this.player.shieldActive ? Math.min(((this.shieldEndTime - now) / 15000) * barWidthMax, barWidthMax) : 0;
    this.pointBarWidth = Math.min((this.pointCount / this.maxPoints) * barWidthMax, barWidthMax);

    this.powerUps.forEach(pu => {
      pu.update(this.speedMultiplier * 3);
      if (!pu.collected && pu.checkCollision(this.player)) {
        this.activatePowerUp(pu);
      }
    });
    this.powerUps = this.powerUps.filter(pu => !pu.collected);

    this.bullets.forEach(bullet => {
      bullet.y += bullet.speed;
      if (bullet.angle) {
        bullet.x += Math.sin(bullet.angle) * 10;
      }
    });
    this.bullets = this.bullets.filter(bullet => bullet.y > -bullet.radiusOuter);

    this.bullets.forEach((bullet, bulletIndex) => {
      this.obstacles.forEach((ob, obIndex) => {
        const dx = bullet.x - (ob.x + ob.width / 2);
        const dy = bullet.y - (ob.y + ob.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < bullet.radiusOuter + ob.width / 2) {
          this.bullets.splice(bulletIndex, 1);
          this.obstacles.splice(obIndex, 1);
          if (this.destroyParticles.length < 100) {
            for (let i = 0; i < 10; i++) {
              this.destroyParticles.push({
                x: ob.x + ob.width / 2,
                y: ob.y + ob.height / 2,
                radius: 2 + Math.random() * 3,
                color: `hsl(${Math.random() * 360}, 100%, 50%)`,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                alpha: 1,
              });
            }
          }
        }
      });
    });

    this.destroyParticles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.02;
      p.radius -= 0.1;
    });
    this.destroyParticles = this.destroyParticles.filter(p => p.alpha > 0 && p.radius > 0);

    for (let ob of this.obstacles) {
      if (detectCollision(this.player, ob)) {
        this.explosion = new Explosion(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2);
        return;
      }
    }

    if (this.player.magnetActive) {
      this.points.forEach(point => {
        if (!point.collected) {
          const dx = this.player.x + this.player.width / 2 - point.x;
          const dy = this.player.y + this.player.height / 2 - point.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 200) {
            point.x += dx * 0.05;
            point.y += dy * 0.05;
          }
        }
      });
    }

    this.points.forEach(point => {
      if (!point.collected && point.checkCollision(this.player)) {
        point.collected = true;
        this.pointCount++;
        this.score += this.player.doublePointActive ? 2 : 1;
      }
    });

    this.score++;
    this.framesSinceLevelUp++;

    if (!this.bossMode && this.framesSinceLevelUp >= this.levelInterval) {
      this.level++;
      this.framesSinceLevelUp = 0;
      this.showLevelUpMessage = true;
      this.levelUpMessageFrame = 0;
      if (this.level % 10 === 0) {
        this.bossMode = true;
        this.speedMultiplier = 1 + (this.level - 1) * 0.2;
      } else {
        this.speedMultiplier = 1 + this.level * 0.2;
      }
    }

    if (this.bossMode && this.framesSinceLevelUp >= this.bossModeDuration) {
      this.bossMode = false;
      this.framesSinceLevelUp = 0;
      this.level++;
      this.showLevelUpMessage = true;
      this.levelUpMessageFrame = 0;
      this.speedMultiplier = 1 + this.level * 0.2;
    }

    if (this.showLevelUpMessage) {
      this.levelUpMessageFrame++;
      if (this.levelUpMessageFrame >= 120) {
        this.showLevelUpMessage = false;
      }
    }

    this.road.speed = 3 * this.speedMultiplier;
    this.obstacles.forEach(ob => {
      ob.speed = ob.baseSpeed * this.speedMultiplier;
    });
  }

  shootSpecialBullets() {
    if (this.bullets.length < 50) {
      const centerX = this.player.x + this.player.width / 2;
      const startY = this.player.y;
      this.bullets.push(
        { x: centerX, y: startY, radiusOuter: 6, radiusInner: 3, speed: -12, angle: -0.2 },
        { x: centerX, y: startY, radiusOuter: 6, radiusInner: 3, speed: -12, angle: 0 },
        { x: centerX, y: startY, radiusOuter: 6, radiusInner: 3, speed: -12, angle: 0.2 }
      );
    }
  }

  activatePowerUp(pu) {
    pu.collected = true;
    pu.activate(this.player);
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