import { describe, expect, it } from "vitest";
import { getEtoByYear, getWareki, resolveYearPlaceholders } from "@/data/eto";

describe("eto & wareki", () => {
  it("2027年を未年・令和9年として判定できる", () => {
    const eto = getEtoByYear(2027);
    expect(eto.kanji).toBe("未");
    expect(eto.animal).toBe("ひつじ");

    const wareki = getWareki(2027);
    expect(wareki.label).toBe("令和9年");
    expect(wareki.kanjiLabel).toBe("令和九年");
  });

  it("プレースホルダーを選択年に応じて置換できる", () => {
    const text = "{{YEAR}}年 {{WAREKI_KANJI}} {{ETO}}年";
    expect(resolveYearPlaceholders(text, 2027)).toBe("2027年 令和九年 未年");
    expect(resolveYearPlaceholders(text, 2028)).toBe("2028年 令和十年 申年");
  });
});
