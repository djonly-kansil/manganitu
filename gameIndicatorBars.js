export class GameIndicatorBars {
  constructor(game) {
    this.game = game;
    this.magnetBarWidth = 0;
    this.doubleBarWidth = 0;
    this.shieldBarWidth = 0;
    this.pointBarWidth = 0;
  }

  update() {
    const { player, pointCount, maxPoints } = this.game;
    const now = Date.now();

    // Perbarui status power-up
    player.magnetActive = now < this.game.powerUps.magnetEndTime;
    player.doublePointActive = now < this.game.powerUps.doubleEndTime;
    player.shieldActive = now < this.game.powerUps.shieldEndTime;

    // Hitung lebar maksimum bar berdasarkan frame
    const frameWidth = this.game.canvas.width - 20; // Lebar frame besar
    const frameX = 10; // Margin awal
    const barSpacing = 10; // Jarak antar bar
    const totalSpacing = barSpacing * 3; // 3 spasi untuk 4 bar
    const barWidthMax = (frameWidth - frameX - totalSpacing - 10) / 4; // Sesuaikan dengan margin

    // Batasi lebar bar agar sesuai dengan frame
    this.magnetBarWidth = player.magnetActive
      ? Math.min(((this.game.powerUps.magnetEndTime - now) / 12000) * barWidthMax, barWidthMax)
      : 0;
    this.doubleBarWidth = player.doublePointActive
      ? Math.min(((this.game.powerUps.doubleEndTime - now) / 12000) * barWidthMax, barWidthMax)
      : 0;
    this.shieldBarWidth = player.shieldActive
      ? Math.min(((this.game.powerUps.shieldEndTime - now) / 15000) * barWidthMax, barWidthMax)
      : 0;
    this.pointBarWidth = Math.min((pointCount / maxPoints) * barWidthMax, barWidthMax);
  }

  draw(ctx) {
    const { canvas, specialShotActive, frame } = this.game;

    // Frame besar untuk semua bar
    const frameX = 10;
    const frameY = 40;
    const frameWidth = canvas.width - 20;
    const frameHeight = 25;
    ctx.fillStyle = 'rgba(50, 50, 50, 0.8)';
    ctx.fillRect(frameX, frameY, frameWidth, frameHeight);
    ctx.strokeStyle = 'lime';
    ctx.lineWidth = 1;
    ctx.strokeRect(frameX, frameY, frameWidth, frameHeight);

    // Gambar bar indikator
    const barHeight = 8;
    const barSpacing = 10;
    const totalSpacing = barSpacing * 3; // 3 spasi untuk 4 bar
    const barWidthMax = (frameWidth - frameX - totalSpacing - 10) / 4; // Konsisten dengan update()

    // Bar Magnet
    if (this.game.player.magnetActive) {
      ctx.fillStyle = 'deepskyblue';
      ctx.fillRect(frameX + 10, frameY + 8, this.magnetBarWidth, barHeight);
    }
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(frameX + 10, frameY + 8, barWidthMax, barHeight);

    // Bar Double Point
    if (this.game.player.doublePointActive) {
      ctx.fillStyle = 'gold';
      ctx.fillRect(frameX + 10 + barWidthMax + barSpacing, frameY + 8, this.doubleBarWidth, barHeight);
    }
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(frameX + 10 + barWidthMax + barSpacing, frameY + 8, barWidthMax, barHeight);

    // Bar Shield
    if (this.game.player.shieldActive) {
      const remainingTime = this.game.powerUps.shieldEndTime - Date.now();
      const blink = remainingTime <= 6000 && Math.floor(frame / 15) % 2 === 0;
      ctx.fillStyle = blink ? 'orange' : 'red';
      ctx.fillRect(frameX + 10 + (barWidthMax + barSpacing) * 2, frameY + 8, this.shieldBarWidth, barHeight);
    }
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(frameX + 10 + (barWidthMax + barSpacing) * 2, frameY + 8, barWidthMax, barHeight);

    // Bar Poin (Special Shot)
    ctx.fillStyle = specialShotActive ? 'purple' : 'lime';
    ctx.fillRect(frameX + 10 + (barWidthMax + barSpacing) * 3, frameY + 8, this.pointBarWidth, barHeight);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(frameX + 10 + (barWidthMax + barSpacing) * 3, frameY + 8, barWidthMax, barHeight);

    ctx.lineWidth = 1;
  }
}