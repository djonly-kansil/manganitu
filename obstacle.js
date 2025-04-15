export class Obstacle {
  constructor(canvas, x) {
    this.canvas = canvas;
    this.width = 40;
    this.height = 80;
    this.x = x || Math.random() * (canvas.width - this.width);
    this.y = -this.height;
    this.baseSpeed = 3;
    this.speed = this.baseSpeed;
    this.color = this.getRandomColor();
    this.moveAngle = 0;
  }

  update(multiplier, isBossMode) {
    this.y += this.speed;
    if (isBossMode) { // Hanya bergerak di mode boss
      this.moveAngle += 0.05;
      this.x += Math.sin(this.moveAngle) * 3; // Jarak gerak lebih jauh (dari 2 ke 3)
      if (this.x < 0) this.x = 0;
      if (this.x + this.width > this.canvas.width) this.x = this.canvas.width - this.width;
    }
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  offScreen() {
    return this.y > this.canvas.height;
  }

  getRandomColor() {
    const colors = ['red', 'orange', 'magenta', 'cyan'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}