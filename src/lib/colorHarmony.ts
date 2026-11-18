import { JAPANESE_COLORS, NEW_YEAR_GOLD, type JapaneseColor } from "@/data/japaneseColors";
import type { ImageEdgeEffect } from "@/types/card";

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface HarmonyPreset {
  id: string;
  label: string;
  description: string;
  edgeEffect: ImageEdgeEffect;
  frameColor: string;
  frameColorSecondary: string;
  frameWidth: number;
}

export function hexToRgb(hex: string): RgbColor {
  const cleaned = hex.replace("#", "");
  const full =
    cleaned.length === 3
      ? cleaned
          .split("")
          .map((c) => c + c)
          .join("")
      : cleaned;
  const num = Number.parseInt(full, 16);
  if (Number.isNaN(num)) {
    return { r: 232, g: 57, b: 41 };
  }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHex({ r, g, b }: RgbColor): string {
  const toHex = (n: number): string =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * 補色（色相を180度回転した近似色）を返す。
 */
export function getComplementaryHex(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const sum = max + min;
  return rgbToHex({
    r: sum - r,
    g: sum - g,
    b: sum - b,
  });
}

/**
 * 指定された色にもっとも近い日本の伝統色を返す。
 */
export function findNearestJapaneseColor(hex: string): JapaneseColor {
  const target = hexToRgb(hex);
  let best = JAPANESE_COLORS[0];
  let bestDist = Number.POSITIVE_INFINITY;

  for (const candidate of JAPANESE_COLORS) {
    const c = hexToRgb(candidate.hex);
    const dist =
      (target.r - c.r) ** 2 + (target.g - c.g) ** 2 + (target.b - c.b) ** 2;
    if (dist < bestDist) {
      bestDist = dist;
      best = candidate;
    }
  }
  return best;
}

/**
 * 画像（HTMLImageElement）から代表色（ドミナントカラー最大3色）を抽出する。
 * ブラウザ上の縮小オフスクリーンCanvasで高速に処理する。
 */
export function extractDominantColorsFromImage(
  img: HTMLImageElement,
  maxColors: number = 3
): string[] {
  const sampleSize = 48;
  const canvas = document.createElement("canvas");
  canvas.width = sampleSize;
  canvas.height = sampleSize;
  const ctx = canvas.getContext("2d");
  if (!ctx) return ["#E83929", "#D4AF37", "#165E83"];

  ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
  const { data } = ctx.getImageData(0, 0, sampleSize, sampleSize);

  const buckets = new Map<string, { count: number; r: number; g: number; b: number }>();

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] ?? 0;
    const g = data[i + 1] ?? 0;
    const b = data[i + 2] ?? 0;
    const a = data[i + 3] ?? 0;
    if (a < 128) continue;

    // 32刻みで量子化して色バケットを作成
    const qr = Math.floor(r / 32) * 32;
    const qg = Math.floor(g / 32) * 32;
    const qb = Math.floor(b / 32) * 32;
    const key = `${qr},${qg},${qb}`;

    const existing = buckets.get(key);
    if (existing) {
      existing.count += 1;
      existing.r += r;
      existing.g += g;
      existing.b += b;
    } else {
      buckets.set(key, { count: 1, r, g, b });
    }
  }

  const sorted = Array.from(buckets.values()).sort((a, b) => b.count - a.count);
  const result: string[] = [];

  for (const bucket of sorted) {
    const hex = rgbToHex({
      r: bucket.r / bucket.count,
      g: bucket.g / bucket.count,
      b: bucket.b / bucket.count,
    });
    // 近すぎる色の重複を避ける
    const isDuplicate = result.some((existingHex) => {
      const a = hexToRgb(existingHex);
      const b = hexToRgb(hex);
      const dist = Math.hypot(a.r - b.r, a.g - b.g, a.b - b.b);
      return dist < 55;
    });
    if (!isDuplicate) {
      result.push(hex);
    }
    if (result.length >= maxColors) break;
  }

  return result.length > 0 ? result : ["#E83929", "#D4AF37", "#165E83"];
}

/**
 * 抽出した代表色をもとに、年賀状向けの自動フチ＆カラー配色プリセットを生成する。
 */
export function generateHarmonyPresets(dominantColors: readonly string[]): HarmonyPreset[] {
  const primary = dominantColors[0] ?? "#E83929";
  const secondary = dominantColors[1] ?? NEW_YEAR_GOLD;
  const waColor = findNearestJapaneseColor(primary);
  const complement = getComplementaryHex(primary);

  return [
    {
      id: "harmony-wa",
      label: `和風調和（${waColor.name}）`,
      description: "写真の色味を日本の伝統色に調和させた和紙ちぎり枠",
      edgeEffect: "washi-torn",
      frameColor: waColor.hex,
      frameColorSecondary: NEW_YEAR_GOLD,
      frameWidth: 16,
    },
    {
      id: "harmony-feather",
      label: "ふんわり溶け込み",
      description: "写真のフチを柔らかくぼかして背景になじませる",
      edgeEffect: "feather",
      frameColor: primary,
      frameColorSecondary: secondary,
      frameWidth: 24,
    },
    {
      id: "harmony-gold",
      label: "お正月二重金枠",
      description: "写真になじむ色と金色の二重フレームで晴れやかに",
      edgeEffect: "double-frame",
      frameColor: primary,
      frameColorSecondary: NEW_YEAR_GOLD,
      frameWidth: 18,
    },
    {
      id: "harmony-accent",
      label: "引き立てポラロイド",
      description: "補色アクセントを効かせたチェキ・ポラロイド風",
      edgeEffect: "polaroid",
      frameColor: "#FFFDF9",
      frameColorSecondary: complement,
      frameWidth: 22,
    },
  ];
}
