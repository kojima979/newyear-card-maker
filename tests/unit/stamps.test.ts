import { describe, expect, it } from "vitest";
import { ILLUSTRATION_ASSETS } from "@/data/illustrations";
import { getStampById, STAMP_DEFINITIONS, stampToDataUrl } from "@/data/stamps";

describe("stamps & illustrations", () => {
  it("引っ越しテーマ（ひつじ・富士山・神社・祝）のイラスト素材が大量に登録されている", () => {
    const movingStamps = STAMP_DEFINITIONS.filter((s) => s.category === "moving");
    expect(movingStamps.length).toBeGreaterThanOrEqual(15);

    const requiredIds = [
      "moving-sheep-box",
      "moving-fuji-home",
      "moving-shrine-torii",
      "moving-iwai-stamp",
    ];
    for (const id of requiredIds) {
      const stamp = getStampById(id);
      expect(stamp).toBeDefined();
      if (stamp) {
        const url = stampToDataUrl(stamp, stamp.defaultColor, stamp.defaultSecondaryColor);
        expect(url.startsWith("data:image/svg+xml")).toBe(true);
      }
    }

    expect(ILLUSTRATION_ASSETS.length).toBeGreaterThanOrEqual(2);
  });
});
