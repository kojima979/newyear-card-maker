import { describe, expect, it } from "vitest";
import { layoutVerticalText } from "@/lib/verticalText";

describe("verticalText", () => {
  it("縦書きで右列から左列へ順番に配置される", () => {
    const glyphs = layoutVerticalText({
      text: "あ\nい",
      boxWidth: 300,
      fontSize: 40,
      letterSpacing: 4,
      lineHeight: 1.5,
      tateChuYoko: true,
    });
    expect(glyphs).toHaveLength(2);
    expect(glyphs[0]?.char).toBe("あ");
    expect(glyphs[1]?.char).toBe("い");
    expect((glyphs[0]?.x ?? 0) > (glyphs[1]?.x ?? 0)).toBe(true);
  });

  it("縦中横ON時に2027などの数字が1トークンにまとまる", () => {
    const glyphs = layoutVerticalText({
      text: "2027年",
      boxWidth: 200,
      fontSize: 40,
      letterSpacing: 4,
      lineHeight: 1.5,
      tateChuYoko: true,
    });
    expect(glyphs).toHaveLength(2);
    expect(glyphs[0]?.char).toBe("2027");
    expect(glyphs[0]?.isTateChuYoko).toBe(true);
    expect(glyphs[1]?.char).toBe("年");
  });

  it("長音符などが90度回転する", () => {
    const glyphs = layoutVerticalText({
      text: "ー",
      boxWidth: 200,
      fontSize: 40,
      letterSpacing: 4,
      lineHeight: 1.5,
      tateChuYoko: true,
    });
    expect(glyphs[0]?.rotation).toBe(90);
  });
});
