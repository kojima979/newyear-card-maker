export interface StampDefinition {
  id: string;
  name: string;
  category: "eto-2027" | "lucky" | "flower" | "deco" | "moving";
  defaultWidth: number;
  defaultHeight: number;
  defaultColor: string;
  defaultSecondaryColor: string;
  renderSvg: (primary: string, secondary: string) => string;
}

export const STAMP_DEFINITIONS: readonly StampDefinition[] = [
  {
    id: "sheep-cute",
    name: "もこもこひつじ（2027未）",
    category: "eto-2027",
    defaultWidth: 320,
    defaultHeight: 280,
    defaultColor: "#FFFDF9",
    defaultSecondaryColor: "#D9A87E",
    renderSvg: (primary, secondary) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 200">
        <!-- 足 -->
        <rect x="78" y="148" width="14" height="34" rx="7" fill="${secondary}"/>
        <rect x="102" y="152" width="14" height="32" rx="7" fill="${secondary}"/>
        <rect x="136" y="152" width="14" height="32" rx="7" fill="${secondary}"/>
        <rect x="158" y="148" width="14" height="34" rx="7" fill="${secondary}"/>
        <!-- もこもこ体 -->
        <g fill="${primary}" stroke="${secondary}" stroke-width="4">
          <circle cx="80" cy="105" r="34"/>
          <circle cx="120" cy="90" r="38"/>
          <circle cx="160" cy="108" r="34"/>
          <circle cx="100" cy="132" r="32"/>
          <circle cx="144" cy="132" r="32"/>
          <circle cx="122" cy="115" r="36" stroke="none"/>
        </g>
        <!-- 耳 -->
        <ellipse cx="48" cy="96" rx="18" ry="10" transform="rotate(-25 48 96)" fill="${secondary}"/>
        <ellipse cx="102" cy="96" rx="18" ry="10" transform="rotate(25 102 96)" fill="${secondary}"/>
        <!-- 顔 -->
        <ellipse cx="75" cy="106" rx="28" ry="26" fill="${secondary}"/>
        <!-- 頭のもこもこ -->
        <circle cx="64" cy="82" r="13" fill="${primary}"/>
        <circle cx="78" cy="79" r="14" fill="${primary}"/>
        <circle cx="91" cy="84" r="12" fill="${primary}"/>
        <!-- 目と口 -->
        <circle cx="65" cy="105" r="3.8" fill="#2B2B2B"/>
        <circle cx="85" cy="105" r="3.8" fill="#2B2B2B"/>
        <ellipse cx="58" cy="113" rx="5" ry="3" fill="#F09199" opacity="0.7"/>
        <ellipse cx="92" cy="113" rx="5" ry="3" fill="#F09199" opacity="0.7"/>
        <path d="M 70 116 Q 75 121 80 116" fill="none" stroke="#2B2B2B" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
    `,
  },
  {
    id: "sheep-wa",
    name: "和風ひつじ紋（2027未）",
    category: "eto-2027",
    defaultWidth: 260,
    defaultHeight: 260,
    defaultColor: "#E83929",
    defaultSecondaryColor: "#D4AF37",
    renderSvg: (primary, secondary) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="88" fill="none" stroke="${secondary}" stroke-width="6"/>
        <circle cx="100" cy="100" r="78" fill="none" stroke="${primary}" stroke-width="2" stroke-dasharray="6 4"/>
        <path d="M 68 122 C 55 122 48 106 58 95 C 55 78 72 65 88 73 C 96 60 116 62 122 76 C 140 74 152 92 142 108 C 148 122 132 135 118 128 C 106 138 82 136 68 122 Z" fill="${primary}" opacity="0.9"/>
        <ellipse cx="78" cy="102" rx="18" ry="16" fill="#FBF8F1"/>
        <circle cx="72" cy="100" r="2.5" fill="#2B2B2B"/>
        <circle cx="84" cy="100" r="2.5" fill="#2B2B2B"/>
        <path d="M 74 108 Q 78 111 82 108" fill="none" stroke="#2B2B2B" stroke-width="2" stroke-linecap="round"/>
        <text x="100" y="162" text-anchor="middle" font-size="24" font-family="serif" font-weight="bold" fill="${secondary}">未</text>
      </svg>
    `,
  },
  {
    id: "fuji-sunrise",
    name: "初日の出と富士山",
    category: "lucky",
    defaultWidth: 420,
    defaultHeight: 260,
    defaultColor: "#165E83",
    defaultSecondaryColor: "#E83929",
    renderSvg: (primary, secondary) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200">
        <circle cx="220" cy="72" r="36" fill="${secondary}"/>
        <path d="M 20 180 L 115 58 L 155 58 L 250 180 Z" fill="${primary}"/>
        <path d="M 115 58 L 155 58 L 175 84 L 156 76 L 143 92 L 132 76 L 118 90 L 106 76 L 95 84 Z" fill="#FFFFFF"/>
        <path d="M 10 175 Q 60 162 105 174 Q 155 186 210 172 Q 260 160 310 176" fill="none" stroke="#D4AF37" stroke-width="4" stroke-linecap="round"/>
      </svg>
    `,
  },
  {
    id: "plum-blossom",
    name: "紅白の梅",
    category: "flower",
    defaultWidth: 180,
    defaultHeight: 180,
    defaultColor: "#D7003A",
    defaultSecondaryColor: "#F8B500",
    renderSvg: (primary, secondary) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
        <g transform="translate(80,80)">
          <circle cx="0" cy="-34" r="24" fill="${primary}"/>
          <circle cx="32" cy="-10" r="24" fill="${primary}"/>
          <circle cx="20" cy="28" r="24" fill="${primary}"/>
          <circle cx="-20" cy="28" r="24" fill="${primary}"/>
          <circle cx="-32" cy="-10" r="24" fill="${primary}"/>
          <circle cx="0" cy="0" r="11" fill="${secondary}"/>
          <g stroke="${secondary}" stroke-width="2">
            <line x1="0" y1="0" x2="0" y2="-22"/>
            <line x1="0" y1="0" x2="20" y2="-7"/>
            <line x1="0" y1="0" x2="13" y2="18"/>
            <line x1="0" y1="0" x2="-13" y2="18"/>
            <line x1="0" y1="0" x2="-20" y2="-7"/>
          </g>
        </g>
      </svg>
    `,
  },
  {
    id: "hanko-kotobuki",
    name: "落款印「寿」",
    category: "lucky",
    defaultWidth: 110,
    defaultHeight: 110,
    defaultColor: "#E83929",
    defaultSecondaryColor: "#FFFFFF",
    renderSvg: (primary, secondary) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect x="8" y="8" width="84" height="84" rx="10" fill="${primary}"/>
        <rect x="14" y="14" width="72" height="72" rx="6" fill="none" stroke="${secondary}" stroke-width="2.5"/>
        <text x="50" y="68" text-anchor="middle" font-size="52" font-family="serif" font-weight="bold" fill="${secondary}">寿</text>
      </svg>
    `,
  },
  {
    id: "mizuhiki-ribbon",
    name: "お正月水引飾り",
    category: "deco",
    defaultWidth: 240,
    defaultHeight: 140,
    defaultColor: "#E83929",
    defaultSecondaryColor: "#D4AF37",
    renderSvg: (primary, secondary) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 140">
        <path d="M 20 80 Q 70 40 120 70 Q 170 100 220 60" fill="none" stroke="${primary}" stroke-width="7" stroke-linecap="round"/>
        <path d="M 20 65 Q 70 100 120 70 Q 170 40 220 75" fill="none" stroke="${secondary}" stroke-width="6" stroke-linecap="round"/>
        <circle cx="120" cy="70" r="22" fill="none" stroke="${primary}" stroke-width="5"/>
        <circle cx="120" cy="70" r="14" fill="none" stroke="${secondary}" stroke-width="4"/>
        <circle cx="120" cy="70" r="7" fill="${primary}"/>
      </svg>
    `,
  },
  {
    id: "moving-house",
    name: "新しいおうち（新居）",
    category: "moving",
    defaultWidth: 260,
    defaultHeight: 240,
    defaultColor: "#E83929",
    defaultSecondaryColor: "#F8B500",
    renderSvg: (primary, secondary) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 200">
        <!-- 煙突とハート煙 -->
        <rect x="148" y="38" width="18" height="36" rx="3" fill="${secondary}"/>
        <circle cx="157" cy="24" r="7" fill="${primary}" opacity="0.75"/>
        <circle cx="166" cy="14" r="5" fill="${primary}" opacity="0.55"/>
        <!-- 本体 -->
        <rect x="52" y="92" width="116" height="82" rx="6" fill="#FFFDF9" stroke="${secondary}" stroke-width="4"/>
        <!-- 屋根 -->
        <path d="M 32 100 L 110 34 L 188 100 Z" fill="${primary}" stroke="${primary}" stroke-width="6" stroke-linejoin="round"/>
        <!-- ドア -->
        <rect x="94" y="122" width="32" height="52" rx="16" fill="${secondary}"/>
        <circle cx="118" cy="148" r="3" fill="#FFFDF9"/>
        <!-- 窓 -->
        <rect x="64" y="114" width="22" height="22" rx="4" fill="#E0F2FE" stroke="${secondary}" stroke-width="3"/>
        <rect x="134" y="114" width="22" height="22" rx="4" fill="#E0F2FE" stroke="${secondary}" stroke-width="3"/>
        <!-- 芝生ライン -->
        <path d="M 24 176 Q 110 168 196 176" fill="none" stroke="#839B5C" stroke-width="5" stroke-linecap="round"/>
      </svg>
    `,
  },
  {
    id: "moving-truck",
    name: "お引越しトラック",
    category: "moving",
    defaultWidth: 300,
    defaultHeight: 200,
    defaultColor: "#165E83",
    defaultSecondaryColor: "#E83929",
    renderSvg: (primary, secondary) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 170">
        <!-- 荷台 -->
        <rect x="24" y="42" width="136" height="82" rx="8" fill="${primary}"/>
        <!-- 荷台の飾りリボン/ライン -->
        <rect x="24" y="94" width="136" height="10" fill="${secondary}"/>
        <!-- 荷台文字風 -->
        <text x="92" y="78" text-anchor="middle" font-size="20" font-weight="bold" font-family="sans-serif" fill="#FFFFFF">MOVING!</text>
        <!-- 運転席 -->
        <path d="M 164 68 L 210 68 L 234 94 L 234 124 L 164 124 Z" fill="${secondary}" stroke="${secondary}" stroke-width="4" stroke-linejoin="round"/>
        <!-- 窓 -->
        <path d="M 174 76 L 204 76 L 220 94 L 174 94 Z" fill="#E0F2FE"/>
        <!-- タイヤ -->
        <circle cx="68" cy="130" r="18" fill="#2B2B2B"/>
        <circle cx="68" cy="130" r="8" fill="#E5E7EB"/>
        <circle cx="200" cy="130" r="18" fill="#2B2B2B"/>
        <circle cx="200" cy="130" r="8" fill="#E5E7EB"/>
        <!-- 地面 -->
        <line x1="12" y1="150" x2="248" y2="150" stroke="#D1D5DB" stroke-width="4" stroke-linecap="round"/>
      </svg>
    `,
  },
  {
    id: "moving-boxes",
    name: "段ボールと新生活",
    category: "moving",
    defaultWidth: 220,
    defaultHeight: 200,
    defaultColor: "#D9A87E",
    defaultSecondaryColor: "#839B5C",
    renderSvg: (primary, secondary) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 180">
        <!-- 下の大きい箱 -->
        <rect x="30" y="92" width="96" height="68" rx="4" fill="${primary}" stroke="#9A6B42" stroke-width="3"/>
        <line x1="30" y1="112" x2="126" y2="112" stroke="#9A6B42" stroke-width="2.5"/>
        <rect x="66" y="92" width="24" height="22" fill="#FDE68A" opacity="0.85"/>
        <!-- 上の小さい箱 -->
        <rect x="56" y="38" width="76" height="54" rx="4" fill="${primary}" stroke="#9A6B42" stroke-width="3"/>
        <rect x="84" y="38" width="20" height="18" fill="#FDE68A" opacity="0.85"/>
        <!-- 観葉植物 -->
        <path d="M 142 126 L 172 126 L 166 160 L 148 160 Z" fill="#E83929"/>
        <path d="M 157 126 Q 140 94 128 102 Q 142 118 157 126 Z" fill="${secondary}"/>
        <path d="M 157 126 Q 157 82 157 76 Q 170 96 157 126 Z" fill="${secondary}"/>
        <path d="M 157 126 Q 178 94 186 106 Q 172 118 157 126 Z" fill="${secondary}"/>
      </svg>
    `,
  },
  {
    id: "moving-badge",
    name: "転居しましたスタンプ",
    category: "moving",
    defaultWidth: 220,
    defaultHeight: 120,
    defaultColor: "#E83929",
    defaultSecondaryColor: "#D4AF37",
    renderSvg: (primary, secondary) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 120">
        <rect x="8" y="12" width="224" height="96" rx="18" fill="#FFFDF9" stroke="${primary}" stroke-width="6"/>
        <rect x="16" y="20" width="208" height="80" rx="12" fill="none" stroke="${secondary}" stroke-width="2.5" stroke-dasharray="6 4"/>
        <text x="120" y="58" text-anchor="middle" font-size="26" font-weight="bold" font-family="serif" fill="${primary}">転居しました</text>
        <text x="120" y="86" text-anchor="middle" font-size="16" font-weight="bold" font-family="sans-serif" letter-spacing="3" fill="${secondary}">WE MOVED!</text>
      </svg>
    `,
  },
  {
    id: "moving-sheep-box",
    name: "引っ越しひつじ（荷物運び）",
    category: "moving",
    defaultWidth: 260,
    defaultHeight: 240,
    defaultColor: "#FFFDF9",
    defaultSecondaryColor: "#D9A87E",
    renderSvg: (primary, secondary) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 220">
        <!-- ひつじ体 -->
        <rect x="78" y="156" width="12" height="32" rx="6" fill="${secondary}"/>
        <rect x="118" y="156" width="12" height="32" rx="6" fill="${secondary}"/>
        <g fill="${primary}" stroke="${secondary}" stroke-width="3.5">
          <circle cx="80" cy="116" r="30"/>
          <circle cx="116" cy="108" r="34"/>
          <circle cx="102" cy="138" r="28"/>
        </g>
        <!-- 顔 -->
        <ellipse cx="64" cy="112" rx="22" ry="20" fill="${secondary}"/>
        <circle cx="56" cy="110" r="3" fill="#2B2B2B"/>
        <circle cx="70" cy="110" r="3" fill="#2B2B2B"/>
        <path d="M 60 119 Q 64 123 68 119" fill="none" stroke="#2B2B2B" stroke-width="2" stroke-linecap="round"/>
        <!-- 抱えた段ボール -->
        <rect x="126" y="106" width="76" height="58" rx="6" fill="#E6B88A" stroke="#9A6B42" stroke-width="3"/>
        <rect x="152" y="106" width="24" height="18" fill="#FDE68A"/>
        <line x1="126" y1="126" x2="202" y2="126" stroke="#9A6B42" stroke-width="2"/>
        <!-- ハート -->
        <path d="M 164 80 C 164 72 152 72 152 80 C 152 88 164 95 164 95 C 164 95 176 88 176 80 C 176 72 164 72 164 80 Z" fill="#E83929"/>
      </svg>
    `,
  },
  {
    id: "moving-sheep-home",
    name: "引っ越しひつじ（新居挨拶）",
    category: "moving",
    defaultWidth: 280,
    defaultHeight: 240,
    defaultColor: "#E83929",
    defaultSecondaryColor: "#D9A87E",
    renderSvg: (primary, secondary) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 220">
        <!-- 家 -->
        <rect x="108" y="88" width="114" height="86" rx="6" fill="#FFFDF9" stroke="${secondary}" stroke-width="4"/>
        <path d="M 92 94 L 165 36 L 238 94 Z" fill="${primary}" stroke="${primary}" stroke-width="5" stroke-linejoin="round"/>
        <rect x="148" y="124" width="32" height="50" rx="14" fill="${secondary}"/>
        <!-- ひつじ -->
        <rect x="50" y="152" width="10" height="24" rx="5" fill="${secondary}"/>
        <rect x="74" y="152" width="10" height="24" rx="5" fill="${secondary}"/>
        <circle cx="67" cy="126" r="26" fill="#FFFDF9" stroke="${secondary}" stroke-width="3.5"/>
        <ellipse cx="67" cy="120" rx="16" ry="15" fill="${secondary}"/>
        <circle cx="61" cy="118" r="2.5" fill="#2B2B2B"/>
        <circle cx="73" cy="118" r="2.5" fill="#2B2B2B"/>
        <path d="M 63 126 Q 67 129 71 126" fill="none" stroke="#2B2B2B" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `,
  },
  {
    id: "moving-fuji-home",
    name: "引っ越し・富士山と新居",
    category: "moving",
    defaultWidth: 320,
    defaultHeight: 230,
    defaultColor: "#165E83",
    defaultSecondaryColor: "#E83929",
    renderSvg: (primary, secondary) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 210">
        <circle cx="230" cy="54" r="28" fill="#F8B500"/>
        <path d="M 16 170 L 106 54 L 146 54 L 236 170 Z" fill="${primary}"/>
        <path d="M 106 54 L 146 54 L 164 78 L 146 70 L 134 86 L 122 72 L 108 86 L 96 72 L 86 78 Z" fill="#FFFFFF"/>
        <!-- 新居 -->
        <rect x="176" y="114" width="76" height="58" rx="4" fill="#FFFDF9" stroke="#D9A87E" stroke-width="3"/>
        <path d="M 166 118 L 214 80 L 262 118 Z" fill="${secondary}"/>
        <rect x="204" y="140" width="20" height="32" rx="10" fill="#D9A87E"/>
        <path d="M 12 174 Q 150 164 288 174" fill="none" stroke="#839B5C" stroke-width="5" stroke-linecap="round"/>
      </svg>
    `,
  },
  {
    id: "moving-fuji-sunrise",
    name: "引っ越し・富士とトラック",
    category: "moving",
    defaultWidth: 320,
    defaultHeight: 220,
    defaultColor: "#165E83",
    defaultSecondaryColor: "#E83929",
    renderSvg: (primary, secondary) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200">
        <circle cx="72" cy="52" r="24" fill="${secondary}"/>
        <path d="M 30 150 L 116 48 L 154 48 L 240 150 Z" fill="${primary}" opacity="0.88"/>
        <path d="M 116 48 L 154 48 L 168 68 L 148 62 L 136 74 L 122 62 L 104 68 Z" fill="#FFFFFF"/>
        <!-- トラック -->
        <rect x="112" y="106" width="84" height="48" rx="6" fill="#FFFDF9" stroke="${primary}" stroke-width="3.5"/>
        <path d="M 198 118 L 228 118 L 242 134 L 242 154 L 198 154 Z" fill="${secondary}"/>
        <circle cx="138" cy="158" r="11" fill="#2B2B2B"/>
        <circle cx="222" cy="158" r="11" fill="#2B2B2B"/>
      </svg>
    `,
  },
  {
    id: "moving-shrine-torii",
    name: "引っ越し・神社と鳥居と新居",
    category: "moving",
    defaultWidth: 300,
    defaultHeight: 230,
    defaultColor: "#E83929",
    defaultSecondaryColor: "#839B5C",
    renderSvg: (primary, secondary) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 210">
        <!-- 鳥居 -->
        <path d="M 34 52 Q 96 64 158 52" fill="none" stroke="${primary}" stroke-width="11" stroke-linecap="round"/>
        <rect x="44" y="72" width="104" height="9" rx="3" fill="${primary}"/>
        <rect x="60" y="56" width="12" height="114" fill="${primary}"/>
        <rect x="120" y="56" width="12" height="114" fill="${primary}"/>
        <!-- 参道の奥に新居 -->
        <rect x="174" y="114" width="68" height="54" rx="4" fill="#FFFDF9" stroke="#D9A87E" stroke-width="3"/>
        <path d="M 164 118 L 208 84 L 252 118 Z" fill="#D4AF37"/>
        <rect x="198" y="138" width="20" height="30" rx="8" fill="#D9A87E"/>
        <!-- 梅の木 -->
        <circle cx="38" cy="138" r="18" fill="${secondary}" opacity="0.85"/>
        <circle cx="252" cy="144" r="16" fill="${secondary}" opacity="0.85"/>
      </svg>
    `,
  },
  {
    id: "moving-shrine-ema",
    name: "引っ越し・神社絵馬とお守り",
    category: "moving",
    defaultWidth: 230,
    defaultHeight: 220,
    defaultColor: "#E83929",
    defaultSecondaryColor: "#D4AF37",
    renderSvg: (primary, secondary) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 210">
        <!-- 紐 -->
        <path d="M 110 14 Q 90 36 110 46 Q 130 36 110 14" fill="none" stroke="${primary}" stroke-width="5"/>
        <!-- 絵馬 -->
        <path d="M 30 78 L 110 42 L 190 78 L 182 174 L 38 174 Z" fill="#FDE68A" stroke="#B45309" stroke-width="4" stroke-linejoin="round"/>
        <!-- 絵馬の中の家と鳥居マーク -->
        <rect x="78" y="112" width="64" height="44" rx="4" fill="#FFFDF9" stroke="${secondary}" stroke-width="3"/>
        <path d="M 68 116 L 110 86 L 152 116 Z" fill="${primary}"/>
        <circle cx="110" cy="64" r="5" fill="#B45309"/>
      </svg>
    `,
  },
  {
    id: "moving-shrine-kadomatsu",
    name: "引っ越し・鳥居と門松",
    category: "moving",
    defaultWidth: 260,
    defaultHeight: 220,
    defaultColor: "#E83929",
    defaultSecondaryColor: "#007B43",
    renderSvg: (primary, secondary) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 200">
        <!-- 鳥居 -->
        <path d="M 48 44 Q 120 56 192 44" fill="none" stroke="${primary}" stroke-width="10" stroke-linecap="round"/>
        <rect x="60" y="64" width="120" height="8" rx="3" fill="${primary}"/>
        <rect x="78" y="48" width="11" height="122" fill="${primary}"/>
        <rect x="151" y="48" width="11" height="122" fill="${primary}"/>
        <!-- 門松 -->
        <rect x="36" y="116" width="12" height="54" rx="4" fill="${secondary}"/>
        <rect x="50" y="106" width="12" height="64" rx="4" fill="${secondary}"/>
        <rect x="178" y="106" width="12" height="64" rx="4" fill="${secondary}"/>
        <rect x="192" y="116" width="12" height="54" rx="4" fill="${secondary}"/>
        <rect x="32" y="146" width="34" height="26" rx="4" fill="#D4AF37"/>
        <rect x="174" y="146" width="34" height="26" rx="4" fill="#D4AF37"/>
      </svg>
    `,
  },
  {
    id: "moving-iwai-mizuhiki",
    name: "祝・引っ越し（水引と新居）",
    category: "moving",
    defaultWidth: 260,
    defaultHeight: 220,
    defaultColor: "#E83929",
    defaultSecondaryColor: "#D4AF37",
    renderSvg: (primary, secondary) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 200">
        <!-- 水引の輪 -->
        <circle cx="120" cy="100" r="82" fill="none" stroke="${primary}" stroke-width="5"/>
        <circle cx="120" cy="100" r="72" fill="none" stroke="${secondary}" stroke-width="3"/>
        <!-- 中央の家 -->
        <rect x="82" y="96" width="76" height="54" rx="4" fill="#FFFDF9" stroke="${secondary}" stroke-width="3"/>
        <path d="M 70 100 L 120 62 L 170 100 Z" fill="${primary}"/>
        <rect x="110" y="122" width="20" height="28" rx="8" fill="${secondary}"/>
      </svg>
    `,
  },
  {
    id: "moving-iwai-fan",
    name: "祝・引っ越し（金扇と梅）",
    category: "moving",
    defaultWidth: 280,
    defaultHeight: 200,
    defaultColor: "#D4AF37",
    defaultSecondaryColor: "#E83929",
    renderSvg: (primary, secondary) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 180">
        <!-- 扇 -->
        <path d="M 130 156 L 26 68 A 140 140 0 0 1 234 68 Z" fill="${primary}" opacity="0.9"/>
        <path d="M 130 156 L 62 100 A 86 86 0 0 1 198 100 Z" fill="#FFFDF9"/>
        <text x="130" y="114" text-anchor="middle" font-size="28" font-weight="bold" font-family="serif" fill="${secondary}">祝・転居</text>
      </svg>
    `,
  },
  {
    id: "moving-iwai-stamp",
    name: "祝・引っ越し（朱印ロゴ）",
    category: "moving",
    defaultWidth: 180,
    defaultHeight: 180,
    defaultColor: "#E83929",
    defaultSecondaryColor: "#FFFFFF",
    renderSvg: (primary, secondary) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r="70" fill="${primary}"/>
        <circle cx="80" cy="80" r="60" fill="none" stroke="${secondary}" stroke-width="3" stroke-dasharray="6 4"/>
        <text x="80" y="70" text-anchor="middle" font-size="30" font-weight="bold" font-family="serif" fill="${secondary}">祝</text>
        <text x="80" y="108" text-anchor="middle" font-size="26" font-weight="bold" font-family="serif" fill="${secondary}">引っ越し</text>
      </svg>
    `,
  },
  {
    id: "moving-iwai-key",
    name: "祝・引っ越し（新居の鍵）",
    category: "moving",
    defaultWidth: 240,
    defaultHeight: 180,
    defaultColor: "#D4AF37",
    defaultSecondaryColor: "#E83929",
    renderSvg: (primary, secondary) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 170">
        <!-- 鍵 -->
        <circle cx="72" cy="85" r="32" fill="none" stroke="${primary}" stroke-width="12"/>
        <rect x="102" y="79" width="104" height="12" rx="6" fill="${primary}"/>
        <rect x="166" y="91" width="12" height="22" rx="3" fill="${primary}"/>
        <rect x="188" y="91" width="12" height="16" rx="3" fill="${primary}"/>
        <!-- お祝いリボン -->
        <path d="M 96 68 Q 118 40 132 62 Q 118 80 96 68 Z" fill="${secondary}"/>
        <path d="M 96 68 Q 74 40 60 62 Q 74 80 96 68 Z" fill="${secondary}"/>
        <circle cx="96" cy="68" r="8" fill="${secondary}"/>
      </svg>
    `,
  },
] as const;

export function getStampById(id: string): StampDefinition | undefined {
  return STAMP_DEFINITIONS.find((s) => s.id === id);
}

export function stampToDataUrl(stamp: StampDefinition, primary: string, secondary: string): string {
  const svg = stamp.renderSvg(primary, secondary).trim();
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
