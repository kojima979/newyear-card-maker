import { describe, expect, it } from "vitest";
import { applyFiltersToPixels } from "@/lib/imageEffects";

describe("imageEffects applyFiltersToPixels", () => {
  it("明るさ・コントラスト調整でピクセル値が変化する", () => {
    const data = new Uint8ClampedArray([100, 100, 100, 255]);
    applyFiltersToPixels(data, {
      brightness: 20,
      contrast: 0,
      saturation: 0,
      sepia: false,
    });
    expect(data[0]).toBeGreaterThan(100);
  });

  it("セピア有効時に赤系・黄系の暖かいトーンに変換される", () => {
    const data = new Uint8ClampedArray([80, 120, 200, 255]);
    applyFiltersToPixels(data, {
      brightness: 0,
      contrast: 0,
      saturation: 0,
      sepia: true,
    });
    // 青成分が減り、赤・緑成分が増える
    expect(data[0]).toBeGreaterThan(80);
    expect(data[2]).toBeLessThan(200);
  });
});
