export class Road {
  constructor(canvas) {
    this.canvas = canvas;
    this.lineY = 0;
    this.speed = 3;
  }
  update() {
    this.lineY += this.speed;
    if (this.lineY >= 40) this.lineY = 0;
  }
  draw(ctx) {
    ctx.fillStyle = 'gray';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 4;
    for (let y = this.lineY; y < this.canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(this.canvas.width / 2, y);
      ctx.lineTo(this.canvas.width / 2, y + 20);
      ctx.stroke();
    }
  }
}