window.addEventListener('load', () => {
  const src = `./assets/cat.jpg`;
  const verticalCount = 30;
  const horizontalCount = 50;
  const image = new ImageScattered(src, horizontalCount, verticalCount);
});

const WHITE_SPACE = 50;

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
    this.setImageSources();
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

  setImageSources() {
    const sources = [];

    const unitWidth = this.iWidth / this.horizontalCount;
    const unitHeight = this.iHeight / this.verticalCount;

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    tempCanvas.width = this.iWidth;
    tempCanvas.height = this.iHeight;

    tempCtx.drawImage(this.image, 0, 0);

    for (let h = 0; h < this.horizontalCount; h++) {
      sources[h] = [];

      for (let v = 0; v < this.verticalCount; v++) {
        const sx = h * (this.iWidth / this.horizontalCount);
        const sy = v * (this.iHeight / this.verticalCount);

        const imageData = tempCtx.getImageData(sx, sy, unitWidth + 2, unitHeight + 2);

        sources[h].push(imageData);
      }
    }

    this.imageSources = [...sources];
  }

  initialImage() {
    const unitWidth = this.iWidth / this.horizontalCount - 4;
    const unitHeight = this.iHeight / this.verticalCount - 4;

    for (let h = 0; h < this.horizontalCount; h++) {
      for (let v = 0; v < this.verticalCount; v++) {
        const sx = h * (this.iWidth / this.horizontalCount);
        const sy = v * (this.iHeight / this.verticalCount);
        const dx = Math.round(h * (this.iWidth / this.horizontalCount) + WHITE_SPACE / 2) - 2;
        const dy = Math.round(v * (this.iHeight / this.verticalCount) + WHITE_SPACE / 2) - 2;

        const imageData = this.imageSources[h][v];

        this.ctx.putImageData(imageData, dx, dy, 0, 0, unitWidth, unitHeight);
      }
    }
  }

  drawImage() {}
}

class UnitImage {
  constructor(imageData) {
    this.imageData = imageData;
  }

  modifyImageData(opacity) {
    const imageData = image.data;

    for (let i = 3; i < imageData.length; i += 4) {
      imageData[i] = 255 / (100 / (opacity * 100));
    }

    const newImageData = new ImageData(imageData);

    this.imageData = newImageData;
  }

  getImageData() {
    return this.imageData;
  }
}
