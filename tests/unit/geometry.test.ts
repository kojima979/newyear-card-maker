import { describe, expect, it } from "vitest";
import { getCanvasDimensions, mmToPx, pxToMm } from "@/lib/geometry";

describe("geometry", () => {
  it("はがきサイズ(100x148mm)を300dpiのピクセルへ変換できる", () => {
    expect(mmToPx(100)).toBe(1181);
    expect(mmToPx(148)).toBe(1748);
    expect(Math.round(pxToMm(1181))).toBe(100);
  });

  it("縦向き・横向きのキャンバス寸法を正しく返す", () => {
    const portrait = getCanvasDimensions("portrait");
    expect(portrait.width).toBe(1181);
    expect(portrait.height).toBe(1748);

    const landscape = getCanvasDimensions("landscape");
    expect(landscape.width).toBe(1748);
    expect(landscape.height).toBe(1181);
  });
});
