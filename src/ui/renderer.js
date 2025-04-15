export class Renderer {
  constructor(game) {
    this.game = game;
    this.ctx = game.ctx;
    this.canvas = game.canvas;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.game.road.draw(this.ctx);
    this.game.player.draw(this.ctx);
    this.game.obstacles.forEach(ob => ob.draw(this.ctx));
    this.game.points.forEach(point => point.draw(this.ctx));
    this.game.powerUps.forEach(pu => pu.draw(this.ctx, false));

    this.game.bullets.forEach(bullet => {
      this.ctx.beginPath();
      this.ctx.arc(bullet.x, bullet.y, bullet.radiusOuter, 0, Math.PI * 2);
      this.ctx.fillStyle = 'yellow';
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.arc(bullet.x, bullet.y, bullet.radiusInner, 0, Math.PI * 2);
      this.ctx.fillStyle = 'white';
      this.ctx.fill();
    });

    this.game.destroyParticles.forEach(p => {
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fill();
    });
    this.ctx.globalAlpha = 1;

    if (this.game.explosion) {
      this.game.explosion.draw(this.ctx);
      this.ctx.fillStyle = 'rgba(50, 50, 50, 0.8)';
      this.ctx.fillRect(this.canvas.width / 2 - 150, this.canvas.height / 2 - 60, 300, 120);
      this.ctx.strokeStyle = 'lime';
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(this.canvas.width / 2 - 150, this.canvas.height / 2 - 60, 300, 120);

      this.ctx.fillStyle = 'white';
      this.ctx.font = '36px "Digital-7"';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(`GAME OVER`, this.canvas.width / 2, this.canvas.height / 2 - 20);

      this.ctx.font = '16px Arial';
      this.ctx.fillText(`SKOR KAMU: ${this.game.score}`, this.canvas.width / 2, this.canvas.height / 2 + 10);

      const highScore = localStorage.getItem('highScore') || 0;
      this.ctx.font = '16px Arial';
      this.ctx.fillText(`HIGH SCORE: ${Math.max(highScore, this.game.score)}`, this.canvas.width / 2, this.canvas.height / 2 + 40);
      this.ctx.textAlign = 'left';
    }

    this.ctx.fillStyle = 'rgba(50, 50, 50, 0.8)';
    this.ctx.fillRect(10, 10, 120, 25);
    this.ctx.strokeStyle = 'lime';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(10, 10, 120, 25);
    this.ctx.fillStyle = 'white';
    this.ctx.strokeStyle = 'lime';
    this.ctx.lineWidth = 0.5;
    this.ctx.font = '18px Arial';
    this.ctx.textAlign = 'center';
    let obstacleText = this.game.obstaclesPassed > 9999 ? "9999+" : `Mobil: ${this.game.obstaclesPassed}`;
    this.ctx.strokeText(obstacleText, 70, 23);
    this.ctx.fillText(obstacleText, 70, 23);

    this.ctx.fillStyle = 'rgba(50, 50, 50, 0.8)';
    this.ctx.fillRect(this.canvas.width / 2 - 60, 10, 120, 25);
    this.ctx.strokeStyle = 'lime';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(this.canvas.width / 2 - 60, 10, 120, 25);
    this.ctx.fillStyle = 'white';
    this.ctx.strokeStyle = 'lime';
    this.ctx.lineWidth = 0.5;
    this.ctx.font = '22px "Digital-7"';
    this.ctx.textAlign = 'center';
    let scoreText = this.game.score > 999999 ? "999999+" : `${this.game.score}`;
    this.ctx.strokeText(scoreText, this.canvas.width / 2, 23);
    this.ctx.fillText(scoreText, this.canvas.width / 2, 23);

    this.ctx.fillStyle = 'rgba(50, 50, 50, 0.8)';
    this.ctx.fillRect(this.canvas.width - 130, 10, 120, 25);
    this.ctx.strokeStyle = 'lime';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(this.canvas.width - 130, 10, 120, 25);
    this.ctx.fillStyle = 'white';
    this.ctx.strokeStyle = 'lime';
    this.ctx.lineWidth = 0.5;
    this.ctx.font = '18px Arial';
    this.ctx.textAlign = 'center';
    let speedValue = Math.round(this.game.speedMultiplier * 10);
    let speedText = speedValue > 9999 ? "9999+" : `${speedValue} km/h`;
    this.ctx.strokeText(speedText, this.canvas.width - 70, 23);
    this.ctx.fillText(speedText, this.canvas.width - 70, 23);
    this.ctx.textAlign = 'left';

    if (this.game.showLevelUpMessage) {
      this.ctx.fillStyle = 'white';
      this.ctx.font = '36px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(this.game.bossMode ? `Boss Level ${this.game.level}` : `Level ${this.game.level}`, this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.textAlign = 'left';
    }

    const frameX = 10;
    const frameY = 40;
    const frameWidth = this.canvas.width - 20;
    const frameHeight = 25;
    this.ctx.fillStyle = 'rgba(50, 50, 50, 0.8)';
    this.ctx.fillRect(frameX, frameY, frameWidth, frameHeight);
    this.ctx.strokeStyle = 'lime';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(frameX, frameY, frameWidth, frameHeight);

    const barWidthMax = (frameWidth - 50) / 4;
    const barHeight = 8;
    const barSpacing = 10;

    if (this.game.player.magnetActive) {
      this.ctx.fillStyle = 'deepskyblue';
      this.ctx.fillRect(frameX + 10, frameY + 8, this.game.magnetBarWidth, barHeight);
      this.ctx.strokeStyle = 'white';
      this.ctx.lineWidth = 0.5;
      this.ctx.strokeRect(frameX + 10, frameY + 8, barWidthMax, barHeight);
      this.ctx.lineWidth = 1;
    }

    if (this.game.player.doublePointActive) {
      this.ctx.fillStyle = 'gold';
      this.ctx.fillRect(frameX + 10 + barWidthMax + barSpacing, frameY + 8, this.game.doubleBarWidth, barHeight);
      this.ctx.strokeStyle = 'white';
      this.ctx.lineWidth = 0.5;
      this.ctx.strokeRect(frameX + 10 + barWidthMax + barSpacing, frameY + 8, barWidthMax, barHeight);
      this.ctx.lineWidth = 1;
    }

    if (this.game.player.shieldActive) {
      const remainingTime = this.game.shieldEndTime - Date.now();
      const blink = remainingTime <= 6000 && Math.floor(this.game.frame / 15) % 2 === 0;
      this.ctx.fillStyle = blink ? 'orange' : 'red';
      this.ctx.fillRect(frameX + 10 + (barWidthMax + barSpacing) * 2, frameY + 8, this.game.shieldBarWidth, barHeight);
      this.ctx.strokeStyle = 'white';
      this.ctx.lineWidth = 0.5;
      this.ctx.strokeRect(frameX + 10 + (barWidthMax + barSpacing) * 2, frameY + 8, barWidthMax, barHeight);
      this.ctx.lineWidth = 1;
    }

    this.ctx.fillStyle = this.game.specialShotActive ? 'purple' : 'lime';
    this.ctx.fillRect(frameX + 10 + (barWidthMax + barSpacing) * 3, frameY + 8, this.game.pointBarWidth, barHeight);
    this.ctx.strokeStyle = 'white';
    this.ctx.lineWidth = 0.5;
    this.ctx.strokeRect(frameX + 10 + (barWidthMax + barSpacing) * 3, frameY + 8, barWidthMax, barHeight);
    this.ctx.lineWidth = 1;
  }
}