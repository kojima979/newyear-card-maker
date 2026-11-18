export interface JapaneseColor {
  name: string;
  reading: string;
  hex: string;
}

/**
 * 年賀状・和風デザインに適した日本の伝統色パレット
 */
export const JAPANESE_COLORS: readonly JapaneseColor[] = [
  { name: "朱色", reading: "しゅいろ", hex: "#E83929" },
  { name: "紅", reading: "くれない", hex: "#D7003A" },
  { name: "茜色", reading: "あかねいろ", hex: "#B7282E" },
  { name: "桜色", reading: "さくらいろ", hex: "#FEEEED" },
  { name: "桃色", reading: "ももいろ", hex: "#F09199" },
  { name: "山吹色", reading: "やまぶきいろ", hex: "#F8B500" },
  { name: "黄金", reading: "こがね", hex: "#E6B422" },
  { name: "萌黄", reading: "もえぎ", hex: "#AACF53" },
  { name: "松葉色", reading: "まつばいろ", hex: "#839B5C" },
  { name: "常磐色", reading: "ときわいろ", hex: "#007B43" },
  { name: "浅葱色", reading: "あさぎいろ", hex: "#00A3AF" },
  { name: "藍色", reading: "あいいろ", hex: "#165E83" },
  { name: "紺青", reading: "こんじょう", hex: "#192F60" },
  { name: "藤色", reading: "ふじいろ", hex: "#BBBCDE" },
  { name: "江戸紫", reading: "えどむらさき", hex: "#745399" },
  { name: "生成り", reading: "きなり", hex: "#FBF8F1" },
  { name: "鳥の子色", reading: "とりのこいろ", hex: "#FFF1CF" },
  { name: "墨色", reading: "すみいろ", hex: "#2B2B2B" },
] as const;

export const NEW_YEAR_GOLD = "#D4AF37";
