export class Explosion {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.maxRadius = 50;
    this.growth = 2;
    this.alpha = 1;
    this.finished = false;
  }
  
  update() {
    this.radius += this.growth;
    this.alpha -= 0.01; // Ubah dari 0.03 menjadi 0.01 untuk durasi lebih lama
    if (this.radius >= this.maxRadius || this.alpha <= 0) {
      this.finished = true;
    }
  }
  
  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,165,0,${this.alpha})`;
    ctx.fill();
    ctx.restore();
  }
}