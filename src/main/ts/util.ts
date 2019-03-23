export function fetchImageData(url: string): Promise<Blob> {
  return new Promise(function(resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    xhr.onload = function(e) {
      const blob = xhr.response;
      blob && resolve(blob);
    };
    xhr.open("GET", url, true);
    xhr.send(null);
  });
}

export function dataURLtoBlob(dataurl: string): Blob {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  let u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new Blob([u8arr], { type: mime });
}

export function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  return canvas;
}

export function getObjectUrl(
  canvas: HTMLCanvasElement,
  quality: number = 1
): string {
  const base64Data = canvas.toDataURL("image/jpeg", quality);
  const blob = dataURLtoBlob(base64Data);
  const url = window.URL.createObjectURL(blob);

  return url;
}

export function rotate(image: HTMLImageElement, degree: number): void {
  const { width, height, naturalWidth, naturalHeight } = image;
  const canvas = createCanvas(width || naturalWidth, height || naturalHeight);
  const ctx = canvas.getContext("2d");

  // 先把原点移动到中心
  ctx.translate(width / 2, height / 2);
  // 旋转
  ctx.rotate((degree * Math.PI) / 180);
  // 画图
  ctx.drawImage(image, -width / 2, -height / 2, width, height);

  image.setAttribute("src", getObjectUrl(canvas));
}

export function flipHorizontal(image: HTMLImageElement): void {
  const { width, height, naturalWidth, naturalHeight } = image;
  const canvas = createCanvas(width || naturalWidth, height || naturalHeight);
  const ctx = canvas.getContext("2d");

  // 缩放
  ctx.scale(-1, 1);
  // 往右移动一个画布宽度
  ctx.translate(-width, 0);
  // 画图
  ctx.drawImage(image, 0, 0, width, height);

  image.setAttribute("src", getObjectUrl(canvas));
}

export function flipVertical(image: HTMLImageElement): void {
  const { width, height, naturalWidth, naturalHeight } = image;
  const canvas = createCanvas(width || naturalWidth, height || naturalHeight);
  const ctx = canvas.getContext("2d");

  // 缩放
  ctx.scale(1, -1);
  // 往上移动一个画布高度
  ctx.translate(0, -height);
  // 画图
  ctx.drawImage(image, 0, 0, width, height);

  image.setAttribute("src", getObjectUrl(canvas));
}
