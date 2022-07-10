window.addEventListener('load', () => {
  const src = `https://t3.ftcdn.net/jpg/02/95/94/94/360_F_295949484_8BrlWkTrPXTYzgMn3UebDl1O13PcVNMU.jpg`;
  const verticalCount = 30;
  const horizontalCount = 50;
  const image = new ImageScattered(src, horizontalCount, verticalCount);
});

class ImageScattered {
  constructor(src, horizontalCount, verticalCount) {
    this.horizontalCount = horizontalCount;
    this.verticalCount = verticalCount;

    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.image = new Image();
    this.image.src = src;

    this.image.addEventListener('load', this.handleLoadImage.bind(this));

    document.body.appendChild(this.canvas);
  }

  handleLoadImage() {
    this.initialImageValue();
    this.initialImage();
  }

  initialImageValue() {
    this.iWidth = this.image.width;
    this.iHeight = this.image.height;

    this.cWidth = this.iWidth + 50;
    this.cHeight = this.iHeight + 50;

    this.canvas.width = this.cWidth;
    this.canvas.height = this.cHeight;
  }

  initialImage() {
    const unitWidth = this.iWidth / this.horizontalCount;
    const unitHeight = this.iHeight / this.verticalCount;

    for (let h = 0; h < this.horizontalCount; h++) {
      for (let v = 0; v < this.verticalCount; v++) {
        const sx = h * (this.iWidth / this.horizontalCount);
        const sy = v * (this.iHeight / this.verticalCount);

        this.ctx.drawImage(this.image, sx, sy, unitWidth, unitHeight, sx + 25, sy + 25, unitWidth, unitHeight);

        this.ctx.beginPath();
        this.ctx.strokeStyle = '#000';
        this.ctx.strokeRect(sx + 25, sy + 25, unitWidth, unitHeight);
      }
    }
  }
}
