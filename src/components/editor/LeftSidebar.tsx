"use client";

import { ImagePlus, LayoutTemplate, Palette, Sparkles, Type } from "lucide-react";
import { useState } from "react";
import { resolveYearPlaceholders } from "@/data/eto";
import { GREETING_PRESETS } from "@/data/greetings";
import { JAPANESE_COLORS, NEW_YEAR_GOLD } from "@/data/japaneseColors";
import { ILLUSTRATION_ASSETS, withBasePath } from "@/data/illustrations";
import { STAMP_DEFINITIONS, stampToDataUrl } from "@/data/stamps";
import { CARD_TEMPLATES } from "@/data/templates";
import {
  extractDominantColorsFromImage,
  generateHarmonyPresets,
} from "@/lib/colorHarmony";
import { getCanvasDimensions } from "@/lib/geometry";
import { useEditorStore } from "@/stores/editorStore";
import type { BackgroundPattern, ImageEdgeEffect } from "@/types/card";
import type { TemplateCategory } from "@/types/template";

type SidebarTab = "templates" | "photo" | "text" | "stamps" | "background";

const TAB_ITEMS: readonly { id: SidebarTab; label: string; icon: React.ReactNode }[] = [
  { id: "templates", label: "テンプレ", icon: <LayoutTemplate className="w-4 h-4" /> },
  { id: "photo", label: "写真", icon: <ImagePlus className="w-4 h-4" /> },
  { id: "text", label: "文字・賀詞", icon: <Type className="w-4 h-4" /> },
  { id: "stamps", label: "スタンプ", icon: <Sparkles className="w-4 h-4" /> },
  { id: "background", label: "背景", icon: <Palette className="w-4 h-4" /> },
];

const PATTERN_OPTIONS: readonly { id: BackgroundPattern; label: string }[] = [
  { id: "none", label: "なし" },
  { id: "washi", label: "和紙" },
  { id: "ichimatsu", label: "市松" },
  { id: "asanoha", label: "麻の葉" },
  { id: "seigaiha", label: "青海波" },
];

export function LeftSidebar() {
  const [activeTab, setActiveTab] = useState<SidebarTab>("templates");
  const [templateCategory, setTemplateCategory] = useState<TemplateCategory>("all");
  const [stampCategory, setStampCategory] = useState<"all" | "moving" | "eto-2027" | "other">("all");
  const [autoStyleOnUpload, setAutoStyleOnUpload] = useState(true);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const {
    year,
    orientation,
    background,
    applyTemplate,
    addTextElement,
    addImageElement,
    addStampElement,
    setBackground,
  } = useEditorStore();

  const dims = getCanvasDimensions(orientation);

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      if (typeof dataUrl !== "string") return;

      const img = new window.Image();
      img.onload = () => {
        const targetW = Math.min(dims.width * 0.65, 680);
        const ratio = img.naturalHeight / Math.max(1, img.naturalWidth);
        const targetH = Math.round(targetW * ratio);

        let edgeEffect: ImageEdgeEffect = "none";
        let frameColor = "#FFFDF9";
        let frameColorSecondary = NEW_YEAR_GOLD;
        let frameWidth = 14;

        if (autoStyleOnUpload) {
          const dominant = extractDominantColorsFromImage(img);
          const presets = generateHarmonyPresets(dominant);
          const best = presets[0];
          if (best) {
            edgeEffect = best.edgeEffect;
            frameColor = best.frameColor;
            frameColorSecondary = best.frameColorSecondary;
            frameWidth = best.frameWidth;
          }
        }

        addImageElement({
          name: file.name.slice(0, 20),
          src: dataUrl,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          x: Math.round((dims.width - targetW) / 2),
          y: Math.round((dims.height - targetH) / 2),
          width: Math.round(targetW),
          height: Math.round(targetH),
          rotation: 0,
          opacity: 1,
          visible: true,
          locked: false,
          mask: "none",
          edgeEffect,
          frameColor,
          frameColorSecondary,
          frameWidth,
          filters: {
            brightness: 0,
            contrast: 0,
            saturation: 0,
            sepia: false,
          },
        });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const filteredTemplates =
    templateCategory === "all"
      ? CARD_TEMPLATES
      : CARD_TEMPLATES.filter((t) => t.category === templateCategory);

  return (
    <aside className="w-full lg:w-80 bg-white border-r border-stone-200 flex flex-col shrink-0 max-h-[calc(100vh-112px)]">
      <div className="grid grid-cols-5 border-b border-stone-200 bg-stone-50">
        {TAB_ITEMS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 py-2.5 px-1 text-[11px] font-medium border-b-2 transition-colors cursor-pointer ${
                active
                  ? "border-red-700 text-red-800 bg-white font-bold"
                  : "border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-100/70"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-4 overflow-y-auto flex-1 space-y-4">
        {activeTab === "templates" && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  ["all", "すべて"],
                  ["japanese", "和モダン"],
                  ["photo", "写真向け"],
                  ["business", "フォーマル"],
                  ["casual", "カジュアル"],
                ] as const
              ).map(([cat, label]) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setTemplateCategory(cat)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer ${
                    templateCategory === cat
                      ? "bg-red-700 text-white"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="space-y-2.5">
              {filteredTemplates.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => applyTemplate(tpl)}
                  className="w-full text-left p-3 rounded-xl border border-stone-200 hover:border-red-400 hover:bg-red-50/30 transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm text-stone-900 group-hover:text-red-800">
                      {resolveYearPlaceholders(tpl.name, year)}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-stone-100 text-stone-600 shrink-0">
                      {tpl.orientation === "portrait" ? "縦" : "横"}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    {tpl.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === "photo" && (
          <div className="space-y-4">
            <label className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/80 border border-amber-200 cursor-pointer">
              <input
                type="checkbox"
                checked={autoStyleOnUpload}
                onChange={(e) => setAutoStyleOnUpload(e.target.checked)}
                className="mt-0.5 accent-red-700"
              />
              <div className="text-xs">
                <p className="font-bold text-amber-950">
                  おまかせ自動フチ＆和風色付けを有効にする
                </p>
                <p className="text-amber-800 mt-0.5">
                  写真の色味をブラウザ内で自動解析し、相性の良い和色フチを自動で付けます。
                </p>
              </div>
            </label>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingOver(true);
              }}
              onDragLeave={() => setIsDraggingOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingOver(false);
                const file = e.dataTransfer.files[0];
                if (file) handleImageFile(file);
              }}
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                isDraggingOver
                  ? "border-red-500 bg-red-50"
                  : "border-stone-300 bg-stone-50 hover:border-stone-400"
              }`}
            >
              <ImagePlus className="w-8 h-8 mx-auto text-stone-400 mb-2" />
              <p className="text-sm font-bold text-stone-700">
                写真をここにドラッグ＆ドロップ
              </p>
              <p className="text-xs text-stone-500 mt-1 mb-3">
                JPEG / PNG / WebP（サーバー送信なし）
              </p>
              <label className="inline-block px-4 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs font-bold cursor-pointer">
                端末から写真を選ぶ
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageFile(file);
                    e.target.value = "";
                  }}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}

        {activeTab === "text" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  addTextElement({
                    name: "縦書き文字",
                    text: "謹賀新年",
                    writingMode: "vertical",
                  })
                }
                className="py-2.5 px-3 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold cursor-pointer"
              >
                ＋ 縦書き追加
              </button>
              <button
                type="button"
                onClick={() =>
                  addTextElement({
                    name: "横書き文字",
                    text: "HAPPY NEW YEAR",
                    writingMode: "horizontal",
                    fontSize: 64,
                  })
                }
                className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold cursor-pointer"
              >
                ＋ 横書き追加
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                賀詞・挨拶文プリセット
              </h3>
              {GREETING_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() =>
                    addTextElement({
                      name: preset.label,
                      text: preset.text,
                      writingMode: preset.recommendedWritingMode,
                      fontSize: preset.category === "gashi" ? 86 : 36,
                      fontWeight: preset.category === "gashi" ? "bold" : "normal",
                      width: preset.category === "gashi" ? 320 : 620,
                      height: preset.category === "gashi" ? 540 : 440,
                    })
                  }
                  className="w-full text-left p-2.5 rounded-lg border border-stone-200 hover:border-red-300 hover:bg-red-50/40 text-xs cursor-pointer"
                >
                  <div className="font-bold text-stone-800">{preset.label}</div>
                  <div className="text-stone-500 truncate mt-0.5">
                    {resolveYearPlaceholders(preset.text, year).replaceAll("\n", " ")}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === "stamps" && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  ["all", "すべて"],
                  ["moving", "引っ越し"],
                  ["eto-2027", "2027未年"],
                  ["other", "縁起・装飾"],
                ] as const
              ).map(([cat, label]) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setStampCategory(cat)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer ${
                    stampCategory === cat
                      ? "bg-red-700 text-white"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {(stampCategory === "all" || stampCategory === "moving") && (
              <div className="space-y-2">
                <h3 className="text-[11px] font-bold text-stone-500">
                  水彩イラスト素材（フチぼかし・色補正対応）
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {ILLUSTRATION_ASSETS.map((asset) => {
                    const src = withBasePath(asset.srcPath);
                    return (
                      <button
                        key={asset.id}
                        type="button"
                        onClick={() =>
                          addImageElement({
                            name: asset.name,
                            src,
                            naturalWidth: asset.defaultWidth,
                            naturalHeight: asset.defaultHeight,
                            x: Math.round((dims.width - asset.defaultWidth) / 2),
                            y: Math.round((dims.height - asset.defaultHeight) / 2),
                            width: asset.defaultWidth,
                            height: asset.defaultHeight,
                            rotation: 0,
                            opacity: 1,
                            visible: true,
                            locked: false,
                            mask: "rounded",
                            edgeEffect: "feather",
                            frameColor: "#FFFDF9",
                            frameColorSecondary: NEW_YEAR_GOLD,
                            frameWidth: 20,
                            filters: {
                              brightness: 0,
                              contrast: 0,
                              saturation: 0,
                              sepia: false,
                            },
                          })
                        }
                        className="p-2 rounded-xl border border-stone-200 hover:border-red-400 hover:bg-red-50/30 flex flex-col items-center gap-1.5 cursor-pointer"
                      >
                        <img
                          src={src}
                          alt={asset.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <span className="text-[11px] font-medium text-stone-700 text-center leading-tight">
                          {asset.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <h3 className="text-[11px] font-bold text-stone-500">
                和風スタンプ（色変更可能）
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {STAMP_DEFINITIONS.filter((stamp) => {
                  if (stampCategory === "all") return true;
                  if (stampCategory === "other") {
                    return (
                      stamp.category === "lucky" ||
                      stamp.category === "flower" ||
                      stamp.category === "deco"
                    );
                  }
                  return stamp.category === stampCategory;
                }).map((stamp) => {
                  const previewUrl = stampToDataUrl(
                    stamp,
                    stamp.defaultColor,
                    stamp.defaultSecondaryColor
                  );
                  return (
                    <button
                      key={stamp.id}
                      type="button"
                      onClick={() =>
                        addStampElement({
                          name: stamp.name,
                          stampId: stamp.id,
                          color: stamp.defaultColor,
                          secondaryColor: stamp.defaultSecondaryColor,
                          x: Math.round((dims.width - stamp.defaultWidth) / 2),
                          y: Math.round((dims.height - stamp.defaultHeight) / 2),
                          width: stamp.defaultWidth,
                          height: stamp.defaultHeight,
                          rotation: 0,
                          opacity: 1,
                          visible: true,
                          locked: false,
                        })
                      }
                      className="p-2.5 rounded-xl border border-stone-200 hover:border-red-400 hover:bg-red-50/30 flex flex-col items-center gap-1.5 cursor-pointer"
                    >
                      <img
                        src={previewUrl}
                        alt={stamp.name}
                        className="w-16 h-16 object-contain"
                      />
                      <span className="text-[11px] font-medium text-stone-700 text-center leading-tight">
                        {stamp.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === "background" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 block">塗りタイプ</label>
              <div className="grid grid-cols-2 gap-2">
                {(["solid", "gradient"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setBackground({ type: t })}
                    className={`py-1.5 rounded-lg border text-xs font-medium cursor-pointer ${
                      background.type === t
                        ? "border-red-700 bg-red-50 text-red-800 font-bold"
                        : "border-stone-200 text-stone-600"
                    }`}
                  >
                    {t === "solid" ? "単色" : "グラデーション"}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs font-medium text-stone-700 space-y-1">
                <span>メイン色</span>
                <input
                  type="color"
                  value={background.color}
                  onChange={(e) => setBackground({ color: e.target.value })}
                  className="w-full h-9 rounded border border-stone-300 cursor-pointer"
                />
              </label>
              {background.type === "gradient" && (
                <label className="text-xs font-medium text-stone-700 space-y-1">
                  <span>サブ色</span>
                  <input
                    type="color"
                    value={background.secondaryColor}
                    onChange={(e) => setBackground({ secondaryColor: e.target.value })}
                    className="w-full h-9 rounded border border-stone-300 cursor-pointer"
                  />
                </label>
              )}
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold text-stone-700 block">
                日本の伝統色クイック選択
              </span>
              <div className="flex flex-wrap gap-1.5">
                {JAPANESE_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setBackground({ color: c.hex })}
                    className="w-6 h-6 rounded-full border border-stone-300 shadow-2xs cursor-pointer"
                    style={{ backgroundColor: c.hex }}
                    title={`${c.name}（${c.reading}）`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-stone-200">
              <span className="text-xs font-bold text-stone-700 block">和柄テクスチャ</span>
              <div className="grid grid-cols-3 gap-1.5">
                {PATTERN_OPTIONS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setBackground({ pattern: p.id })}
                    className={`py-1.5 px-2 rounded-lg border text-xs cursor-pointer ${
                      background.pattern === p.id
                        ? "border-red-700 bg-red-50 text-red-800 font-bold"
                        : "border-stone-200 text-stone-600"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {background.pattern !== "none" && (
                <label className="block text-xs text-stone-600 space-y-1 pt-1">
                  <span>柄の濃さ ({Math.round(background.patternOpacity * 100)}%)</span>
                  <input
                    type="range"
                    min={0.05}
                    max={0.8}
                    step={0.05}
                    value={background.patternOpacity}
                    onChange={(e) =>
                      setBackground({ patternOpacity: Number(e.target.value) })
                    }
                    className="w-full accent-red-700"
                  />
                </label>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
