export class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 8;
    this.collected = false;
  }

  update(speed) {
    this.y += speed;
  }

  draw(ctx) {
    if (this.collected) return;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'gold';
    ctx.fill();
    ctx.strokeStyle = 'orange';
    ctx.stroke();
  }

  checkCollision(player) {
    const dx = player.x + player.width / 2 - this.x;
    const dy = player.y + player.height / 2 - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.radius + player.width / 2;
  }
}