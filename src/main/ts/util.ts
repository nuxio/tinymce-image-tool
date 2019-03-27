interface DrawImageOptions {
  width: number;
  height: number;
  degree?: number;
}
interface ExportCanvas {
  blob: Blob;
  url: string;
}

let imageProxy: string = '';
let whiteList: Array<string> = [];

export function setImageProxy(proxy: string): void {
  imageProxy = proxy;
}

export function setWhiteList(list: Array<string> | string): void {
  whiteList = whiteList.concat(list);
}

export function fetchImageData(url: string): Promise<Blob> {
  return new Promise(function (resolve) {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.open('GET', url, true);
    xhr.send(null);
  });
}

export function dataURLtoBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new Blob([u8arr], { type: mime });
}

export function exportCanvas(
  canvas: HTMLCanvasElement,
  quality: number = 1
): ExportCanvas {
  const base64Data = canvas.toDataURL('image/png', quality);
  const blob = dataURLtoBlob(base64Data);
  const url = window.URL.createObjectURL(blob);

  return {
    blob,
    url
  };
}

export function createCanvas(
  width: number,
  height: number
): {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
} {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;

  return {
    canvas,
    ctx
  };
}

const drawImage = {
  rotate(
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement,
    options: DrawImageOptions
  ) {
    const { width, height, degree = 0 } = options;
    // 先把原点移动到中心
    ctx.translate(width / 2, height / 2);
    // 旋转
    ctx.rotate((degree * Math.PI) / 180);
    // 画图
    ctx.drawImage(image, -width / 2, -height / 2, width, height);
  },
  flipHorizontal(
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement,
    options: DrawImageOptions
  ) {
    const { width, height } = options;
    // 缩放
    ctx.scale(-1, 1);
    // 往右移动一个画布宽度
    ctx.translate(-width, 0);
    // 画图
    ctx.drawImage(image, 0, 0, width, height);
  },
  flipVertical(
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement,
    options: DrawImageOptions
  ) {
    const { width, height } = options;
    // 缩放
    ctx.scale(1, -1);
    // 往上移动一个画布高度
    ctx.translate(0, -height);
    // 画图
    ctx.drawImage(image, 0, 0, width, height);
  }
};

// 创建一个支持canvas导出的图片
const createImage = function (src: string) {
  const image = new Image();
  const a = document.createElement('a');
  a.href = src;
  if (a.origin !== window.location.origin) {
    image.crossOrigin = 'Anonymous';
    if (!whiteList.includes(a.origin)) {
      src = imageProxy + src;
    }
  }

  return {
    image,
    src
  };
};

export function processImage(
  image: HTMLImageElement,
  operation: string,
  options = {}
): void {
  const { image: newImage, src } = createImage(image.src);

  newImage.onload = function () {
    const width = newImage.naturalWidth || newImage.width;
    const height = newImage.naturalHeight || newImage.height;
    const { canvas, ctx } = createCanvas(width, height);

    drawImage[operation](ctx, newImage, { ...options, width, height });

    image.setAttribute('src', exportCanvas(canvas).url);
  };
  newImage.src = src;
}

export function getImageBlob(image: HTMLImageElement): Promise<ExportCanvas> {
  return new Promise(function (resolve) {
    const { image: newImage, src } = createImage(image.src);
    newImage.onload = function () {
      const { canvas, ctx } = createCanvas(
        newImage.naturalWidth,
        newImage.naturalHeight
      );
      ctx.drawImage(image, 0, 0);
      resolve(exportCanvas(canvas));
    };
    newImage.src = src;
  });
}
