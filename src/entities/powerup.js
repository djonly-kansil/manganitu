export class PowerUp {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.radius = 14;
    this.type = type;
    this.collected = false;
    this.duration = this.type === 'shield' ? 15000 : 12000;
    this.startTime = null;
  }

  update(speed) {
    this.y += speed;
  }

  draw(ctx, active) {
    if (this.collected && !active) return;
    const color = this.type === 'magnet' ? 'deepskyblue' : 
                  this.type === 'double' ? 'gold' : 
                  'red';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }

  checkCollision(player) {
    const dx = player.x + player.width / 2 - this.x;
    const dy = player.y + player.height / 2 - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.radius + player.width / 2;
  }

  activate(player) {
    this.collected = true;
    this.startTime = Date.now();
    if (this.type === 'magnet') {
      player.magnetActive = true;
    } else if (this.type === 'double') {
      player.doublePointActive = true;
    } else if (this.type === 'shield') {
      player.shieldActive = true;
    }
  }
}