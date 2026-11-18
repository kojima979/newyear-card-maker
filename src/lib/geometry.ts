import type { CardOrientation } from "@/types/card";

export const POSTCARD_MM = {
  width: 100,
  height: 148,
  bleed: 3,
  safeMargin: 6,
} as const;

export const EXPORT_DPI = 300;
const MM_PER_INCH = 25.4;

/**
 * ミリメートルを300dpi基準のピクセルへ変換する。
 */
export function mmToPx(mm: number, dpi: number = EXPORT_DPI): number {
  return Math.round((mm / MM_PER_INCH) * dpi);
}

/**
 * 300dpi基準のピクセルをミリメートルへ変換する。
 */
export function pxToMm(px: number, dpi: number = EXPORT_DPI): number {
  return (px / dpi) * MM_PER_INCH;
}

export interface CanvasDimensions {
  width: number;
  height: number;
  bleedPx: number;
  safeMarginPx: number;
}

/**
 * 向きに応じたはがきキャンバス寸法（300dpi基準）を返す。
 */
export function getCanvasDimensions(orientation: CardOrientation): CanvasDimensions {
  const portraitW = mmToPx(POSTCARD_MM.width); // 1181
  const portraitH = mmToPx(POSTCARD_MM.height); // 1748
  const bleedPx = mmToPx(POSTCARD_MM.bleed); // 35
  const safeMarginPx = mmToPx(POSTCARD_MM.safeMargin); // 71

  if (orientation === "landscape") {
    return {
      width: portraitH,
      height: portraitW,
      bleedPx,
      safeMarginPx,
    };
  }

  return {
    width: portraitW,
    height: portraitH,
    bleedPx,
    safeMarginPx,
  };
}

/**
 * 値を指定範囲にクランプする。
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
