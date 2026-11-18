export interface GreetingPreset {
  id: string;
  label: string;
  category: "gashi" | "message";
  text: string;
  recommendedWritingMode: "vertical" | "horizontal";
}

export const GREETING_PRESETS: readonly GreetingPreset[] = [
  {
    id: "gashi-kinga",
    label: "謹賀新年",
    category: "gashi",
    text: "謹賀新年",
    recommendedWritingMode: "vertical",
  },
  {
    id: "gashi-geishun",
    label: "迎春",
    category: "gashi",
    text: "迎春",
    recommendedWritingMode: "vertical",
  },
  {
    id: "gashi-kotobuki",
    label: "寿",
    category: "gashi",
    text: "寿",
    recommendedWritingMode: "vertical",
  },
  {
    id: "gashi-akemashite",
    label: "あけましておめでとうございます",
    category: "gashi",
    text: "あけましておめでとうございます",
    recommendedWritingMode: "vertical",
  },
  {
    id: "gashi-happy",
    label: "HAPPY NEW YEAR",
    category: "gashi",
    text: "HAPPY NEW YEAR",
    recommendedWritingMode: "horizontal",
  },
  {
    id: "msg-standard",
    label: "定番の挨拶（丁寧）",
    category: "message",
    text: "旧年中は大変お世話になりました。\n本年も変わらぬお付き合いのほど\nよろしくお願い申し上げます。\n皆様のご健康とご多幸を心よりお祈りいたします。\n\n{{WAREKI_KANJI}} 元旦",
    recommendedWritingMode: "vertical",
  },
  {
    id: "msg-casual",
    label: "友人・カジュアル",
    category: "message",
    text: "今年も笑顔あふれる一年になりますように！\nまたゆっくりお会いできるのを楽しみにしています。\n本年もよろしくお願いします。\n\n{{YEAR}}.1.1",
    recommendedWritingMode: "horizontal",
  },
  {
    id: "msg-family",
    label: "家族・写真付き向け",
    category: "message",
    text: "おかげさまで家族みんな元気に過ごしています。\n{{YEAR}}年も素敵な一年となりますよう\n心よりお祈り申し上げます。\n\n{{WAREKI}} 元旦",
    recommendedWritingMode: "vertical",
  },
  {
    id: "msg-moving-formal",
    label: "引っ越し報告（丁寧）",
    category: "message",
    text: "旧年中は大変お世話になりました。\nこのたび下記へ転居いたしました。\nお近くにお越しの際はぜひお立ち寄りください。\n本年もよろしくお願い申し上げます。\n\n〒000-0000\n○○県○○市○○1-2-3\n{{WAREKI_KANJI}} 元旦",
    recommendedWritingMode: "vertical",
  },
  {
    id: "msg-moving-casual",
    label: "引っ越し報告（カジュアル）",
    category: "message",
    text: "あけましておめでとうございます！\nこのたび新しいお家に引っ越しました♪\n落ち着いたらぜひ遊びに来てね！\n\n新住所：〒000-0000 ○○市○○1-2-3\n{{YEAR}}.1.1",
    recommendedWritingMode: "horizontal",
  },
] as const;

export const FONT_OPTIONS = [
  { label: "明朝体（Noto Serif JP）", value: "'Noto Serif JP', serif" },
  { label: "ゴシック体（Noto Sans JP）", value: "'Noto Sans JP', sans-serif" },
  { label: "毛筆・楷書風（Yuji Syuku）", value: "'Yuji Syuku', serif" },
  { label: "手書き風（Zen Kurenaido）", value: "'Zen Kurenaido', sans-serif" },
  { label: "装飾明朝（Kaisei Decol）", value: "'Kaisei Decol', serif" },
] as const;
