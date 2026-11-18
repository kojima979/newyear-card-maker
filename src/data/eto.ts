export interface EtoInfo {
  key: string;
  kanji: string;
  reading: string;
  animal: string;
  emoji: string;
}

const ETO_LIST: readonly EtoInfo[] = [
  { key: "ne", kanji: "子", reading: "ね", animal: "ねずみ", emoji: "🐭" },
  { key: "ushi", kanji: "丑", reading: "うし", animal: "うし", emoji: "🐮" },
  { key: "tora", kanji: "寅", reading: "とら", animal: "とら", emoji: "🐯" },
  { key: "u", kanji: "卯", reading: "う", animal: "うさぎ", emoji: "🐰" },
  { key: "tatsu", kanji: "辰", reading: "たつ", animal: "たつ", emoji: "🐲" },
  { key: "mi", kanji: "巳", reading: "み", animal: "へび", emoji: "🐍" },
  { key: "uma", kanji: "午", reading: "うま", animal: "うま", emoji: "🐴" },
  { key: "hitsuji", kanji: "未", reading: "ひつじ", animal: "ひつじ", emoji: "🐑" },
  { key: "saru", kanji: "申", reading: "さる", animal: "さる", emoji: "🐵" },
  { key: "tori", kanji: "酉", reading: "とり", animal: "とり", emoji: "🐔" },
  { key: "inu", kanji: "戌", reading: "いぬ", animal: "いぬ", emoji: "🐶" },
  { key: "i", kanji: "亥", reading: "い", animal: "いのしし", emoji: "🐗" },
] as const;

export const DEFAULT_YEAR = 2027;

/**
 * 西暦年から干支情報を取得する（2020年=子年を基準）。
 */
export function getEtoByYear(year: number): EtoInfo {
  const index = (((year - 2020) % 12) + 12) % 12;
  return ETO_LIST[index] ?? ETO_LIST[7];
}

export function getAllEto(): readonly EtoInfo[] {
  return ETO_LIST;
}

const KANJI_DIGITS = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"] as const;

/**
 * 1〜99の数値を漢数字に変換する（和暦表記用）。
 */
function toSimpleKanjiNumber(num: number): string {
  if (num === 1) return "元";
  if (num < 10) return KANJI_DIGITS[num] ?? String(num);
  const tens = Math.floor(num / 10);
  const ones = num % 10;
  const tensStr = tens === 1 ? "十" : `${KANJI_DIGITS[tens] ?? ""}十`;
  const onesStr = ones === 0 ? "" : (KANJI_DIGITS[ones] ?? "");
  return `${tensStr}${onesStr}`;
}

/**
 * 西暦年を和暦表記（令和〇年）へ変換する。
 */
export function getWareki(year: number): { label: string; kanjiLabel: string } {
  if (year >= 2019) {
    const reiwaYear = year - 2018;
    const numStr = reiwaYear === 1 ? "元" : String(reiwaYear);
    return {
      label: `令和${numStr}年`,
      kanjiLabel: `令和${toSimpleKanjiNumber(reiwaYear)}年`,
    };
  }
  return {
    label: `${year}年`,
    kanjiLabel: `${year}年`,
  };
}

/**
 * テキスト内の年号・干支プレースホルダーを選択年に応じて置換する。
 */
export function resolveYearPlaceholders(text: string, year: number): string {
  const eto = getEtoByYear(year);
  const wareki = getWareki(year);

  return text
    .replaceAll("{{YEAR}}", String(year))
    .replaceAll("{{WAREKI}}", wareki.label)
    .replaceAll("{{WAREKI_KANJI}}", wareki.kanjiLabel)
    .replaceAll("{{ETO}}", eto.kanji)
    .replaceAll("{{ETO_ANIMAL}}", eto.animal);
}
