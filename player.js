export class Player {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = 40;
    this.height = 80;
    this.x = canvas.width / 2 - this.width / 2;
    this.y = canvas.height - this.height - 20;
    this.speed = 5;
    this.color = this.getRandomColor();
  }
  update(touchSide) {
    if (touchSide === 'left') this.x -= this.speed;
    else if (touchSide === 'right') this.x += this.speed;
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > this.canvas.width) this.x = this.canvas.width - this.width;
  }
  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  getRandomColor() {
    const colors = ['blue', 'green', 'yellow', 'purple'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}