export class GameUI {
  constructor(game) {
    this.game = game;
    this.score = 0;
    this.level = 0;
    this.framesSinceLevelUp = 0;
    this.levelInterval = 600;
    this.bossModeDuration = 900;
    this.showLevelUpMessage = false;
    this.levelUpMessageFrame = 0;

    // Konfigurasi penghitung (posisi, ukuran, font, dll.)
    this.counterConfig = {
      obstacle: {
        x: 10, // Posisi X untuk penghitung mobil
        y: 10, // Posisi Y
        width: 108, // Lebar frame
        height: 25, // Tinggi frame
        fontSize: '18px', // Ukuran font
        fontFamily: 'Arial', // Jenis font
      },
      score: {
        x: game.canvas.width / 2 - 60, // Posisi X (tengah layar)
        y: 8, // Posisi Y
        width: 120,
        height: 32,
        fontSize: '30px',
        fontFamily: '"Digital-7"',
      },
      speed: {
        x: game.canvas.width - 130, // Posisi X (kanan layar)
        y: 10, // Posisi Y
        width: 108,
        height: 25,
        fontSize: '18px',
        fontFamily: 'Arial',
      },
      level: {
        x: game.canvas.width / 2, // Posisi X (tengah layar)
        y: game.canvas.height / 2, // Posisi Y (tengah layar)
        fontSize: '36px',
        fontFamily: 'Arial',
      },
    };
  }

  update() {
    const { frame, bossMode } = this.game;
    this.score++;
    this.framesSinceLevelUp++;

    if (!bossMode && this.framesSinceLevelUp >= this.levelInterval) {
      this.level++;
      this.framesSinceLevelUp = 0;
      this.showLevelUpMessage = true;
      this.levelUpMessageFrame = 0;
      if (this.level % 10 === 0) {
        this.game.bossMode = true;
        this.game.speedMultiplier = 1 + (this.level - 1) * 0.2;
      } else {
        this.game.speedMultiplier = 1 + this.level * 0.2;
      }
    }

    if (bossMode && this.framesSinceLevelUp >= this.bossModeDuration) {
      this.game.bossMode = false;
      this.framesSinceLevelUp = 0;
      this.level++;
      this.showLevelUpMessage = true;
      this.levelUpMessageFrame = 0;
      this.game.speedMultiplier = 1 + this.level * 0.2;
    }

    if (this.showLevelUpMessage) {
      this.levelUpMessageFrame++;
      if (this.levelUpMessageFrame >= 120) {
        this.showLevelUpMessage = false;
      }
    }

    // Perbarui posisi X untuk skor dan kecepatan saat canvas berubah ukuran
    this.counterConfig.score.x = this.game.canvas.width / 2 - this.counterConfig.score.width / 2;
    this.counterConfig.speed.x = this.game.canvas.width - this.counterConfig.speed.width - 10;
    this.counterConfig.level.x = this.game.canvas.width / 2;
    this.counterConfig.level.y = this.game.canvas.height / 2;
  }

  draw(ctx) {
    const { canvas, bossMode, obstaclesPassed, speedMultiplier } = this.game;

    // Penghitung obstacle (mobil)
    const obstacleCfg = this.counterConfig.obstacle;
    ctx.fillStyle = 'rgba(50, 50, 50, 0.8)';
    ctx.fillRect(obstacleCfg.x, obstacleCfg.y, obstacleCfg.width, obstacleCfg.height);
    ctx.strokeStyle = 'lime';
    ctx.lineWidth = 1;
    ctx.strokeRect(obstacleCfg.x, obstacleCfg.y, obstacleCfg.width, obstacleCfg.height);
    ctx.fillStyle = 'white';
    ctx.font = `${obstacleCfg.fontSize} ${obstacleCfg.fontFamily}`;
    ctx.textAlign = 'center';
    let obstacleText = obstaclesPassed > 999 ? "999+" : `Mobil: ${obstaclesPassed}`;
    ctx.fillText(obstacleText, obstacleCfg.x + obstacleCfg.width / 2, obstacleCfg.y + obstacleCfg.height - 7);

    // Penghitung skor
    const scoreCfg = this.counterConfig.score;
    ctx.fillStyle = 'rgba(50, 10, 50, 0.8)';
    ctx.fillRect(scoreCfg.x, scoreCfg.y, scoreCfg.width, scoreCfg.height);
    ctx.strokeStyle = 'lime';
    ctx.strokeRect(scoreCfg.x, scoreCfg.y, scoreCfg.width, scoreCfg.height);
    ctx.fillStyle = 'white';
    ctx.font = `${scoreCfg.fontSize} ${scoreCfg.fontFamily}`;
    let scoreText = this.score > 999999 ? "999999+" : `${this.score}`;
    ctx.fillText(scoreText, scoreCfg.x + scoreCfg.width / 2, scoreCfg.y + scoreCfg.height - 7);

    // Penghitung kecepatan
    const speedCfg = this.counterConfig.speed;
    ctx.fillStyle = 'rgba(50, 50, 50, 0.8)';
    ctx.fillRect(speedCfg.x, speedCfg.y, speedCfg.width, speedCfg.height);
    ctx.strokeStyle = 'lime';
    ctx.strokeRect(speedCfg.x, speedCfg.y, speedCfg.width, speedCfg.height);
    ctx.fillStyle = 'white';
    ctx.font = `${speedCfg.fontSize} ${speedCfg.fontFamily}`;
    let speedValue = Math.round(speedMultiplier * 10);
    let speedText = speedValue > 999 ? "999+" : `${speedValue} km/h`;
    ctx.fillText(speedText, speedCfg.x + speedCfg.width / 2, speedCfg.y + speedCfg.height - 7);

    // Pesan level
    if (this.showLevelUpMessage) {
      const levelCfg = this.counterConfig.level;
      ctx.fillStyle = 'white';
      ctx.font = `${levelCfg.fontSize} ${levelCfg.fontFamily}`;
      ctx.textAlign = 'center';
      ctx.fillText(bossMode ? `Boss Level ${this.level}` : `Level ${this.level}`, levelCfg.x, levelCfg.y);
    }

    ctx.textAlign = 'left';
  }
}