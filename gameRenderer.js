export class GameRenderer {
  constructor(game) {
    this.game = game;
  }

  draw() {
    const { ctx, canvas, road, player, entities, powerUps, ui, indicatorBars, explosion } = this.game;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    road.draw(ctx);
    player.draw(ctx);
    entities.draw(ctx);
    powerUps.draw(ctx);
    ui.draw(ctx);
    indicatorBars.draw(ctx); // Tambah pemanggilan

    if (explosion) {
      explosion.draw(ctx);
      ctx.fillStyle = 'rgba(50, 50, 50, 0.8)';
      ctx.fillRect(canvas.width / 2 - 150, canvas.height / 2 - 60, 300, 120);
      ctx.strokeStyle = 'lime';
      ctx.lineWidth = 1;
      ctx.strokeRect(canvas.width / 2 - 150, canvas.height / 2 - 60, 300, 120);

      ctx.fillStyle = 'white';
      ctx.font = '36px "Digital-7"';
      ctx.textAlign = 'center';
      ctx.fillText(`GAME OVER`, canvas.width / 2, canvas.height / 2 - 20);

      ctx.font = '16px Arial';
      ctx.fillText(`SKOR KAMU: ${ui.score}`, canvas.width / 2, canvas.height / 2 + 10);

      const highScore = localStorage.getItem('highScore') || 0;
      ctx.fillText(`HIGH SCORE: ${Math.max(highScore, ui.score)}`, canvas.width / 2, canvas.height / 2 + 40);
      ctx.textAlign = 'left';
    }
  }
}