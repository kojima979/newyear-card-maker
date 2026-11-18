export interface VerticalGlyph {
  char: string;
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  isTateChuYoko: boolean;
}

const ROTATE_CHARS = new Set([
  "ー",
  "―",
  "─",
  "〜",
  "～",
  "（",
  "）",
  "(",
  ")",
  "「",
  "」",
  "『",
  "』",
  "【",
  "】",
  "〈",
  "〉",
  "《",
  "》",
  "[",
  "]",
  "{",
  "}",
  "-",
  "－",
]);

const SMALL_PUNCTUATION = new Set(["、", "。", "，", "．"]);

/**
 * 縦書きテキストの各グリフ（または縦中横グループ）の配置座標を計算する。
 * 右側の列から左側の列へ流れる日本語標準の縦書きレイアウトを返す。
 */
export function layoutVerticalText(params: {
  text: string;
  boxWidth: number;
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
  tateChuYoko: boolean;
}): VerticalGlyph[] {
  const { text, boxWidth, fontSize, letterSpacing, lineHeight, tateChuYoko } = params;
  const lines = text.split("\n");
  const colStep = fontSize * lineHeight;
  const charStep = fontSize + letterSpacing;

  // 右端を基準に左へ列を並べる
  const startX = Math.max(fontSize / 2, boxWidth - colStep / 2);
  const glyphs: VerticalGlyph[] = [];

  lines.forEach((line, colIndex) => {
    const colX = startX - colIndex * colStep;
    let cursorY = fontSize * 0.5;
    let i = 0;

    while (i < line.length) {
      const ch = line[i] ?? "";

      // 縦中横: 2〜4桁の半角英数字が連続している場合は1行内に横並びで収める
      if (tateChuYoko && /[0-9A-Za-z]/.test(ch)) {
        let j = i;
        while (j < line.length && /[0-9A-Za-z]/.test(line[j] ?? "") && j - i < 4) {
          j += 1;
        }
        const token = line.slice(i, j);
        if (token.length >= 2 && token.length <= 4) {
          const scale = token.length === 2 ? 0.72 : token.length === 3 ? 0.56 : 0.44;
          glyphs.push({
            char: token,
            x: colX,
            y: cursorY,
            rotation: 0,
            scaleX: scale,
            scaleY: scale,
            isTateChuYoko: true,
          });
          cursorY += charStep;
          i = j;
          continue;
        }
      }

      if (SMALL_PUNCTUATION.has(ch)) {
        glyphs.push({
          char: ch,
          x: colX + fontSize * 0.28,
          y: cursorY - fontSize * 0.28,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
          isTateChuYoko: false,
        });
      } else if (ROTATE_CHARS.has(ch)) {
        glyphs.push({
          char: ch,
          x: colX,
          y: cursorY,
          rotation: 90,
          scaleX: 1,
          scaleY: 1,
          isTateChuYoko: false,
        });
      } else {
        glyphs.push({
          char: ch,
          x: colX,
          y: cursorY,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
          isTateChuYoko: false,
        });
      }

      cursorY += charStep;
      i += 1;
    }
  });

  return glyphs;
}
