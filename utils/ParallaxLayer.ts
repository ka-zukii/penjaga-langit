export class ParallaxLayer {
  img: HTMLImageElement;
  x: number = 0;
  speed: number;
  y: number;
  height: number;

  constructor(src: string, speed: number, y: number, height: number) {
    this.img = new Image();
    this.img.src = src;
    this.speed = speed;
    this.y = y;
    this.height = height;
  }

  update(width: number) {
    this.x -= this.speed;
    if (this.x <= -width) {
      this.x = 0;
    }
  }

  draw(ctx: CanvasRenderingContext2D, width: number) {
    if (this.img.complete && this.img.naturalWidth !== 0) {
      ctx.drawImage(this.img, this.x, this.y, width, this.height);
      ctx.drawImage(this.img, this.x + width, this.y, width, this.height);
    }
  }
}
