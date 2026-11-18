import type { ImageElement, ImageFilters, ImageMaskType } from "@/types/card";

/**
 * RGBA配列に対して明るさ・コントラスト・彩度・セピアを直接適用する（ctx.filter非対応ブラウザ対策）。
 */
export function applyFiltersToPixels(
  data: Uint8ClampedArray,
  filters: ImageFilters
): void {
  const hasFilter =
    filters.brightness !== 0 ||
    filters.contrast !== 0 ||
    filters.saturation !== 0 ||
    filters.sepia;
  if (!hasFilter) return;

  const brightOffset = filters.brightness * 2.2;
  const c = filters.contrast * 2.2;
  const contrastFactor = (259 * (c + 255)) / (255 * (259 - c));
  const satFactor = 1 + filters.saturation / 50;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i] ?? 0;
    let g = data[i + 1] ?? 0;
    let b = data[i + 2] ?? 0;

    // 明るさ
    if (brightOffset !== 0) {
      r += brightOffset;
      g += brightOffset;
      b += brightOffset;
    }

    // コントラスト
    if (filters.contrast !== 0) {
      r = contrastFactor * (r - 128) + 128;
      g = contrastFactor * (g - 128) + 128;
      b = contrastFactor * (b - 128) + 128;
    }

    // 彩度
    if (filters.saturation !== 0) {
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      r = lum + (r - lum) * satFactor;
      g = lum + (g - lum) * satFactor;
      b = lum + (b - lum) * satFactor;
    }

    // セピア（85%ブレンド）
    if (filters.sepia) {
      const sr = r * 0.393 + g * 0.769 + b * 0.189;
      const sg = r * 0.349 + g * 0.686 + b * 0.168;
      const sb = r * 0.272 + g * 0.534 + b * 0.131;
      r = r * 0.15 + sr * 0.85;
      g = g * 0.15 + sg * 0.85;
      b = b * 0.15 + sb * 0.85;
    }

    data[i] = r < 0 ? 0 : r > 255 ? 255 : r;
    data[i + 1] = g < 0 ? 0 : g > 255 ? 255 : g;
    data[i + 2] = b < 0 ? 0 : b > 255 ? 255 : b;
  }
}

/**
 * 要素のサイズとマスク種類に応じたクリップパスをCanvas2Dに描く。
 */
function traceMaskPath(
  ctx: CanvasRenderingContext2D,
  mask: ImageMaskType,
  x: number,
  y: number,
  w: number,
  h: number
): void {
  ctx.beginPath();
  if (mask === "circle") {
    const rx = w / 2;
    const ry = h / 2;
    ctx.ellipse(x + rx, y + ry, rx, ry, 0, 0, Math.PI * 2);
    ctx.closePath();
    return;
  }

  if (mask === "rounded") {
    const r = Math.min(w, h) * 0.12;
    ctx.roundRect(x, y, w, h, r);
    ctx.closePath();
    return;
  }

  if (mask === "diamond") {
    ctx.moveTo(x + w / 2, y);
    ctx.lineTo(x + w, y + h / 2);
    ctx.lineTo(x + w / 2, y + h);
    ctx.lineTo(x, y + h / 2);
    ctx.closePath();
    return;
  }

  if (mask === "plum") {
    const cx = x + w / 2;
    const cy = y + h / 2;
    const radius = Math.min(w, h) * 0.28;
    const offset = Math.min(w, h) * 0.22;
    for (let i = 0; i < 5; i++) {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const px = cx + Math.cos(angle) * offset;
      const py = cy + Math.sin(angle) * offset;
      ctx.moveTo(px + radius, py);
      ctx.arc(px, py, radius, 0, Math.PI * 2);
    }
    ctx.closePath();
    return;
  }

  if (mask === "sheep") {
    const cx = x + w / 2;
    const cy = y + h / 2;
    const bumps = 10;
    const baseR = Math.min(w, h) * 0.36;
    const bumpR = Math.min(w, h) * 0.14;
    for (let i = 0; i < bumps; i++) {
      const angle = (i * 2 * Math.PI) / bumps;
      const px = cx + Math.cos(angle) * baseR;
      const py = cy + Math.sin(angle) * baseR;
      ctx.moveTo(px + bumpR, py);
      ctx.arc(px, py, bumpR, 0, Math.PI * 2);
    }
    ctx.moveTo(cx + baseR, cy);
    ctx.arc(cx, cy, baseR, 0, Math.PI * 2);
    ctx.closePath();
    return;
  }

  ctx.rect(x, y, w, h);
  ctx.closePath();
}

/**
 * 決定論的な擬似乱数で和紙ちぎり・筆かすれ風の揺らぎパスを描く。
 */
function traceOrganicBorderPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  amplitude: number,
  step: number
): void {
  const wave = (index: number): number =>
    Math.sin(index * 1.7 + 0.5) * amplitude * 0.6 +
    Math.cos(index * 3.1) * amplitude * 0.4;

  ctx.beginPath();
  let idx = 0;
  ctx.moveTo(x, y);
  for (let px = x; px <= x + w; px += step) {
    ctx.lineTo(px, y + wave(idx++));
  }
  for (let py = y; py <= y + h; py += step) {
    ctx.lineTo(x + w + wave(idx++), py);
  }
  for (let px = x + w; px >= x; px -= step) {
    ctx.lineTo(px, y + h + wave(idx++));
  }
  for (let py = y + h; py >= y; py -= step) {
    ctx.lineTo(x + wave(idx++), py);
  }
  ctx.closePath();
}

/**
 * ImageElement のマスク・フチエフェクト・色調整フィルターを適用した
 * オフスクリーン Canvas を生成して返す。
 */
export function renderStyledImageCanvas(
  img: HTMLImageElement,
  element: ImageElement
): HTMLCanvasElement {
  const w = Math.max(40, Math.round(element.width));
  const h = Math.max(40, Math.round(element.height));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const { edgeEffect, frameColor, frameColorSecondary, frameWidth, mask, filters } = element;
  const pad = edgeEffect === "polaroid" ? Math.max(16, frameWidth) : Math.max(8, frameWidth);
  const bottomExtra = edgeEffect === "polaroid" ? pad * 2.2 : 0;

  const innerX = edgeEffect === "none" || edgeEffect === "feather" ? 0 : pad;
  const innerY = edgeEffect === "none" || edgeEffect === "feather" ? 0 : pad;
  const innerW = Math.max(20, w - innerX * 2);
  const innerH = Math.max(20, h - innerY * 2 - bottomExtra);

  // 背景枠の描画（ポラロイド・切手・和紙ちぎり・二重枠）
  if (edgeEffect === "polaroid") {
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.22)";
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 6;
    ctx.fillStyle = frameColor;
    ctx.fillRect(4, 4, w - 8, h - 8);
    ctx.restore();
    // アクセントライン
    ctx.fillStyle = frameColorSecondary;
    ctx.fillRect(innerX, h - bottomExtra + 8, innerW, 4);
  } else if (edgeEffect === "stamp") {
    ctx.save();
    ctx.fillStyle = frameColor;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "destination-out";
    const holeR = 7;
    const gap = 20;
    for (let px = gap / 2; px < w; px += gap) {
      ctx.beginPath();
      ctx.arc(px, 0, holeR, 0, Math.PI * 2);
      ctx.arc(px, h, holeR, 0, Math.PI * 2);
      ctx.fill();
    }
    for (let py = gap / 2; py < h; py += gap) {
      ctx.beginPath();
      ctx.arc(0, py, holeR, 0, Math.PI * 2);
      ctx.arc(w, py, holeR, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  } else if (edgeEffect === "washi-torn") {
    ctx.save();
    traceOrganicBorderPath(ctx, 6, 6, w - 12, h - 12, 5, 14);
    ctx.fillStyle = frameColor;
    ctx.fill();
    ctx.strokeStyle = frameColorSecondary;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
  } else if (edgeEffect === "double-frame") {
    ctx.save();
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, frameColor);
    grad.addColorStop(1, frameColorSecondary);
    ctx.strokeStyle = grad;
    ctx.lineWidth = Math.max(4, pad * 0.45);
    ctx.strokeRect(pad * 0.3, pad * 0.3, w - pad * 0.6, h - pad * 0.6);

    ctx.strokeStyle = frameColorSecondary;
    ctx.lineWidth = 2;
    ctx.strokeRect(pad * 0.78, pad * 0.78, w - pad * 1.56, h - pad * 1.56);
    ctx.restore();
  }

  // 写真本体をアスペクト比維持（cover）でクリップ描画
  ctx.save();
  if (edgeEffect === "washi-torn" || edgeEffect === "brush") {
    traceOrganicBorderPath(
      ctx,
      innerX + 2,
      innerY + 2,
      innerW - 4,
      innerH - 4,
      edgeEffect === "brush" ? 7 : 4,
      12
    );
    ctx.clip();
  } else {
    traceMaskPath(ctx, mask, innerX, innerY, innerW, innerH);
    ctx.clip();
  }

  const imgRatio = img.naturalWidth / Math.max(1, img.naturalHeight);
  const boxRatio = innerW / Math.max(1, innerH);
  let drawW = innerW;
  let drawH = innerH;
  let drawX = innerX;
  let drawY = innerY;

  if (imgRatio > boxRatio) {
    drawH = innerH;
    drawW = innerH * imgRatio;
    drawX = innerX - (drawW - innerW) / 2;
  } else {
    drawW = innerW;
    drawH = innerW / Math.max(0.01, imgRatio);
    drawY = innerY - (drawH - innerH) / 2;
  }

  const hasFilter =
    filters.brightness !== 0 ||
    filters.contrast !== 0 ||
    filters.saturation !== 0 ||
    filters.sepia;

  if (hasFilter) {
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = Math.max(1, Math.round(innerW));
    tempCanvas.height = Math.max(1, Math.round(innerH));
    const tempCtx = tempCanvas.getContext("2d");
    if (tempCtx) {
      tempCtx.drawImage(
        img,
        drawX - innerX,
        drawY - innerY,
        drawW,
        drawH
      );
      const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
      applyFiltersToPixels(imageData.data, filters);
      tempCtx.putImageData(imageData, 0, 0);
      ctx.drawImage(tempCanvas, innerX, innerY, innerW, innerH);
    } else {
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    }
  } else {
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }
  ctx.restore();

  // フェザーぼかし（輪郭をふんわり透明化）
  if (edgeEffect === "feather") {
    ctx.save();
    ctx.globalCompositeOperation = "destination-in";
    const featherSize = Math.max(18, frameWidth * 1.5);
    const rad = ctx.createRadialGradient(
      w / 2,
      h / 2,
      Math.max(10, Math.min(w, h) * 0.3 - featherSize * 0.4),
      w / 2,
      h / 2,
      Math.max(w, h) * 0.54
    );
    rad.addColorStop(0, "rgba(0,0,0,1)");
    rad.addColorStop(0.72, "rgba(0,0,0,0.92)");
    rad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  return canvas;
}
