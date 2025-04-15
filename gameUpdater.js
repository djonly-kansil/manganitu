import { detectCollision } from './utils.js';
import { Explosion } from './explosion.js';

export class GameUpdater {
  constructor(game) {
    this.game = game;
  }

  update() {
    const {
      player,
      road,
      entities,
      powerUps,
      ui,
      indicatorBars, // Tambah
      touchSide,
      frame,
      explosion,
      canvas,
      speedMultiplier,
      bossMode,
      specialShotActive,
      specialShotFrame,
      specialShotDuration,
      pointCount,
      maxPoints,
    } = this.game;

    if (explosion) {
      explosion.update();
      if (explosion.finished) {
        this.game.running = false;
        if (typeof this.game.onGameOver === 'function') {
          this.game.onGameOver(ui.score);
        }
      }
      return;
    }

    road.update();
    player.update(touchSide);
    entities.update();
    powerUps.update();
    ui.update();
    indicatorBars.update(); // Tambah pemanggilan

    if (specialShotActive) {
      this.game.specialShotFrame++;
      if (specialShotFrame % 15 === 0) {
        entities.shootSpecialBullets();
      }
      if (specialShotFrame >= specialShotDuration) {
        this.game.specialShotActive = false;
      }
    }

    if (pointCount >= maxPoints && !specialShotActive) {
      this.game.specialShotActive = true;
      this.game.specialShotFrame = 0;
      this.game.pointCount = 0;
      entities.shootSpecialBullets();
    }

    if (player.shieldActive && frame % 10 === 0 && entities.bullets.length < 50) {
      entities.bullets.push({
        x: player.x + player.width / 2,
        y: player.y,
        radiusOuter: 6,
        radiusInner: 3,
        speed: -8,
      });
    }

    entities.bullets.forEach(bullet => {
      bullet.y += bullet.speed;
      if (bullet.angle) {
        bullet.x += Math.sin(bullet.angle) * 10;
      }
    });
    entities.bullets = entities.bullets.filter(bullet => bullet.y > -bullet.radiusOuter);

    entities.bullets.forEach((bullet, bulletIndex) => {
      entities.obstacles.forEach((ob, obIndex) => {
        const dx = bullet.x - (ob.x + ob.width / 2);
        const dy = bullet.y - (ob.y + ob.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < bullet.radiusOuter + ob.width / 2) {
          entities.bullets.splice(bulletIndex, 1);
          entities.obstacles.splice(obIndex, 1);
          entities.addDestroyParticles(ob.x + ob.width / 2, ob.y + ob.height / 2);
        }
      });
    });

    entities.destroyParticles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.02;
      p.radius -= 0.1;
    });
    entities.destroyParticles = entities.destroyParticles.filter(p => p.alpha > 0 && p.radius > 0);

    for (let ob of entities.obstacles) {
      if (detectCollision(player, ob)) {
        this.game.explosion = new Explosion(player.x + player.width / 2, player.y + player.height / 2);
        return;
      }
    }

    if (player.magnetActive) {
      entities.points.forEach(point => {
        if (!point.collected) {
          const dx = player.x + player.width / 2 - point.x;
          const dy = player.y + player.height / 2 - point.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 200) {
            point.x += dx * 0.05;
            point.y += dy * 0.05;
          }
        }
      });
    }

    entities.points.forEach(point => {
      if (!point.collected && point.checkCollision(player)) {
        point.collected = true;
        this.game.pointCount++;
        ui.score += player.doublePointActive ? 2 : 1;
      }
    });

    road.speed = 3 * speedMultiplier;
    entities.obstacles.forEach(ob => {
      ob.speed = ob.baseSpeed * speedMultiplier;
    });
  }
}