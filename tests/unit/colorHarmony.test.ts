import { describe, expect, it } from "vitest";
import {
  findNearestJapaneseColor,
  generateHarmonyPresets,
  getComplementaryHex,
} from "@/lib/colorHarmony";

describe("colorHarmony", () => {
  it("最も近い日本の伝統色を見つけられる", () => {
    const nearest = findNearestJapaneseColor("#E53025");
    expect(nearest.name).toBe("朱色");
  });

  it("補色と自動配色プリセットを生成できる", () => {
    const comp = getComplementaryHex("#FF0000");
    expect(comp).toBe("#00FFFF");

    const presets = generateHarmonyPresets(["#165E83", "#D4AF37"]);
    expect(presets).toHaveLength(4);
    expect(presets[0]?.edgeEffect).toBe("washi-torn");
  });
});
