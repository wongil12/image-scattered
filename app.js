window.addEventListener('load', () => {
  const src = `./assets/cat.jpg`;
  const verticalCount = 30;
  const horizontalCount = 50;
  const image = new ImageScattered(src, horizontalCount, verticalCount);

  document.getElementById('spread').addEventListener('click', () => {
    console.time('asdf');
    image.startAction();
    console.timeEnd('asdf');
  });
});

const WHITE_SPACE = 50;

class ImageScattered {
  constructor(src, horizontalCount, verticalCount) {
    this.opacity = 1;

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

    const unitWidth = Math.round(this.iWidth / this.horizontalCount);
    const unitHeight = Math.round(this.iHeight / this.verticalCount);

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    tempCanvas.width = this.iWidth;
    tempCanvas.height = this.iHeight;

    tempCtx.drawImage(this.image, 0, 0);

    for (let h = 0; h < this.horizontalCount; h++) {
      for (let v = 0; v < this.verticalCount; v++) {
        const sx = Math.round(h * (this.iWidth / this.horizontalCount));
        const sy = Math.round(v * (this.iHeight / this.verticalCount));

        const dx = Math.round(h * (this.iWidth / this.horizontalCount) + WHITE_SPACE / 2);
        const dy = Math.round(v * (this.iHeight / this.verticalCount) + WHITE_SPACE / 2);

        const imageData = tempCtx.getImageData(sx, sy, unitWidth, unitHeight);

        const unitImage = new UnitImage(imageData);

        unitImage.setImageSize({ width: unitWidth, height: unitHeight });

        unitImage.setImagePosition({ x: dx, y: dy });

        sources.push(unitImage);
      }
    }

    this.imageSources = [...sources];
  }

  initialImage() {
    this.imageSources.forEach((unitImage) => {
      this.ctx.putImageData(
        unitImage.getImageData(),
        unitImage.position.x,
        unitImage.position.y,
        0,
        0,
        unitImage.size.width,
        unitImage.size.height,
      );
    });
  }

  startAction() {
    this.ctx.clearRect(0, 0, this.cWidth, this.cHeight);

    this.imageSources.forEach((imageData) => {
      imageData.modifyImageData(this.opacity);
      imageData.drawImage(this.ctx);
    });

    this.opacity -= 0.01;

    if (this.opacity > 0) {
      requestAnimationFrame(() => this.startAction());
    }
  }

  drawImage() {}
}

class UnitImage {
  constructor(imageData) {
    this.imageData = imageData;
    this.size = {
      width: 0,
      height: 0,
    };
    this.position = {
      x: 0,
      y: 0,
    };
  }

  modifyImageData(opacity) {
    const imageData = this.imageData.data;

    for (let i = 3; i < imageData.length; i += 4) {
      imageData[i] = 255 / (100 / (opacity * 100));
    }

    const newImageData = new ImageData(imageData, this.imageData.width, this.imageData.height);

    this.imageData = newImageData;
  }

  setImageSize(size) {
    this.size = {
      ...size,
    };
  }

  setImagePosition(position) {
    this.position = {
      ...position,
    };
  }

  drawImage(ctx) {
    ctx.putImageData(this.imageData, this.position.x, this.position.y, 0, 0, this.size.width, this.size.height);
  }

  getImageData() {
    return this.imageData;
  }
}
