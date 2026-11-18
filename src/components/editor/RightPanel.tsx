"use client";

import {
  ArrowDown,
  ArrowUp,
  Copy,
  Eye,
  EyeOff,
  Layers,
  Lock,
  Sparkles,
  Trash2,
  Unlock,
  Wand2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { FONT_OPTIONS } from "@/data/greetings";
import { JAPANESE_COLORS } from "@/data/japaneseColors";
import {
  extractDominantColorsFromImage,
  generateHarmonyPresets,
} from "@/lib/colorHarmony";
import { useEditorStore } from "@/stores/editorStore";
import type {
  ImageEdgeEffect,
  ImageElement,
  ImageMaskType,
} from "@/types/card";

const MASK_OPTIONS: readonly { id: ImageMaskType; label: string }[] = [
  { id: "none", label: "四角" },
  { id: "rounded", label: "角丸" },
  { id: "circle", label: "丸" },
  { id: "diamond", label: "ひし形" },
  { id: "plum", label: "梅型" },
  { id: "sheep", label: "ひつじ" },
];

const EDGE_EFFECT_OPTIONS: readonly { id: ImageEdgeEffect; label: string }[] = [
  { id: "none", label: "なし" },
  { id: "feather", label: "ぼかし溶け込み" },
  { id: "washi-torn", label: "和紙ちぎり" },
  { id: "brush", label: "筆かすれ" },
  { id: "polaroid", label: "ポラロイド" },
  { id: "stamp", label: "切手風" },
  { id: "double-frame", label: "二重金枠" },
];

function ImageHarmonySection({ element }: { element: ImageElement }) {
  const { updateElement } = useEditorStore();
  const [dominantColors, setDominantColors] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (!active) return;
      setDominantColors(extractDominantColorsFromImage(img, 3));
    };
    img.src = element.src;
    return () => {
      active = false;
    };
  }, [element.src]);

  const presets = useMemo(
    () => generateHarmonyPresets(dominantColors),
    [dominantColors]
  );

  return (
    <div className="space-y-2.5 p-3 rounded-xl bg-amber-50/70 border border-amber-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
          <Wand2 className="w-3.5 h-3.5 text-red-700" />
          おまかせ自動フチ＆配色
        </span>
        {dominantColors.length > 0 && (
          <div className="flex items-center gap-1" title="写真から抽出した代表色">
            {dominantColors.map((hex) => (
              <span
                key={hex}
                className="w-3.5 h-3.5 rounded-full border border-black/20"
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-1.5">
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() =>
              updateElement(element.id, {
                edgeEffect: preset.edgeEffect,
                frameColor: preset.frameColor,
                frameColorSecondary: preset.frameColorSecondary,
                frameWidth: preset.frameWidth,
              })
            }
            className="text-left p-2 rounded-lg bg-white hover:bg-red-50/60 border border-amber-200/80 hover:border-red-300 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-stone-800 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                {preset.label}
              </span>
              <span className="flex items-center gap-1">
                <span
                  className="w-3 h-3 rounded-full border border-black/15"
                  style={{ backgroundColor: preset.frameColor }}
                />
                <span
                  className="w-3 h-3 rounded-full border border-black/15"
                  style={{ backgroundColor: preset.frameColorSecondary }}
                />
              </span>
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">{preset.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export function RightPanel() {
  const {
    elements,
    selectedId,
    selectElement,
    updateElement,
    deleteElement,
    duplicateElement,
    reorderElement,
  } = useEditorStore();

  const selected = elements.find((el) => el.id === selectedId) ?? null;

  return (
    <aside className="w-full lg:w-84 bg-white border-l border-stone-200 flex flex-col shrink-0 max-h-[calc(100vh-112px)]">
      <div className="p-4 overflow-y-auto flex-1 space-y-5">
        {selected ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <h2 className="text-xs font-bold text-stone-800 truncate">
                選択中: {selected.name}
              </h2>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => duplicateElement(selected.id)}
                  className="p-1 rounded hover:bg-stone-100 text-stone-600 cursor-pointer"
                  title="複製"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteElement(selected.id)}
                  className="p-1 rounded hover:bg-red-50 text-red-600 cursor-pointer"
                  title="削除"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {selected.type === "text" && (
              <div className="space-y-3 text-xs">
                <label className="block space-y-1">
                  <span className="font-bold text-stone-700">テキスト内容</span>
                  <textarea
                    rows={4}
                    value={selected.text}
                    onChange={(e) =>
                      updateElement(selected.id, { text: e.target.value })
                    }
                    className="w-full rounded-lg border border-stone-300 p-2 text-xs focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                  <span className="text-[10px] text-stone-400 block">
                    ※ {"{{YEAR}}"}, {"{{WAREKI_KANJI}}"}, {"{{ETO}}"} は自動置換されます
                  </span>
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      updateElement(selected.id, { writingMode: "vertical" })
                    }
                    className={`py-1.5 rounded-lg border font-medium cursor-pointer ${
                      selected.writingMode === "vertical"
                        ? "border-red-700 bg-red-50 text-red-800 font-bold"
                        : "border-stone-200 text-stone-600"
                    }`}
                  >
                    縦書き
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updateElement(selected.id, { writingMode: "horizontal" })
                    }
                    className={`py-1.5 rounded-lg border font-medium cursor-pointer ${
                      selected.writingMode === "horizontal"
                        ? "border-red-700 bg-red-50 text-red-800 font-bold"
                        : "border-stone-200 text-stone-600"
                    }`}
                  >
                    横書き
                  </button>
                </div>

                {selected.writingMode === "vertical" && (
                  <label className="flex items-center gap-2 text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selected.tateChuYoko}
                      onChange={(e) =>
                        updateElement(selected.id, { tateChuYoko: e.target.checked })
                      }
                      className="accent-red-700"
                    />
                    <span>数字を縦中横で横並びにする</span>
                  </label>
                )}

                <label className="block space-y-1">
                  <span className="font-bold text-stone-700">フォント</span>
                  <select
                    value={selected.fontFamily}
                    onChange={(e) =>
                      updateElement(selected.id, { fontFamily: e.target.value })
                    }
                    className="w-full rounded-lg border border-stone-300 p-1.5 bg-white"
                  >
                    {FONT_OPTIONS.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <label className="space-y-1">
                    <span className="font-bold text-stone-700">
                      サイズ ({selected.fontSize}px)
                    </span>
                    <input
                      type="range"
                      min={18}
                      max={180}
                      value={selected.fontSize}
                      onChange={(e) =>
                        updateElement(selected.id, { fontSize: Number(e.target.value) })
                      }
                      className="w-full accent-red-700"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="font-bold text-stone-700">文字色</span>
                    <input
                      type="color"
                      value={selected.color}
                      onChange={(e) =>
                        updateElement(selected.id, { color: e.target.value })
                      }
                      className="w-full h-7 rounded border border-stone-300 cursor-pointer"
                    />
                  </label>
                </div>

                <div className="flex flex-wrap gap-1">
                  {JAPANESE_COLORS.slice(0, 12).map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => updateElement(selected.id, { color: c.hex })}
                      className="w-5 h-5 rounded-full border border-stone-300 cursor-pointer"
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <label className="space-y-1">
                    <span className="text-stone-600">
                      縁取り ({selected.strokeWidth}px)
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={16}
                      value={selected.strokeWidth}
                      onChange={(e) =>
                        updateElement(selected.id, {
                          strokeWidth: Number(e.target.value),
                        })
                      }
                      className="w-full accent-red-700"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-stone-600">縁取り色</span>
                    <input
                      type="color"
                      value={selected.strokeColor}
                      onChange={(e) =>
                        updateElement(selected.id, { strokeColor: e.target.value })
                      }
                      className="w-full h-7 rounded border border-stone-300 cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            )}

            {selected.type === "image" && (
              <div className="space-y-3.5 text-xs">
                <ImageHarmonySection element={selected} />

                <div className="space-y-1.5">
                  <span className="font-bold text-stone-700 block">切り抜き形</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {MASK_OPTIONS.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => updateElement(selected.id, { mask: m.id })}
                        className={`py-1.5 rounded-lg border cursor-pointer ${
                          selected.mask === m.id
                            ? "border-red-700 bg-red-50 text-red-800 font-bold"
                            : "border-stone-200 text-stone-600"
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="font-bold text-stone-700 block">
                    フチ・枠エフェクト
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {EDGE_EFFECT_OPTIONS.map((ef) => (
                      <button
                        key={ef.id}
                        type="button"
                        onClick={() =>
                          updateElement(selected.id, { edgeEffect: ef.id })
                        }
                        className={`py-1.5 px-2 rounded-lg border text-left cursor-pointer ${
                          selected.edgeEffect === ef.id
                            ? "border-red-700 bg-red-50 text-red-800 font-bold"
                            : "border-stone-200 text-stone-600"
                        }`}
                      >
                        {ef.label}
                      </button>
                    ))}
                  </div>
                </div>

                {selected.edgeEffect !== "none" && (
                  <div className="grid grid-cols-3 gap-2">
                    <label className="space-y-1">
                      <span className="text-stone-600">枠色1</span>
                      <input
                        type="color"
                        value={selected.frameColor}
                        onChange={(e) =>
                          updateElement(selected.id, { frameColor: e.target.value })
                        }
                        className="w-full h-7 rounded border border-stone-300 cursor-pointer"
                      />
                    </label>
                    <label className="space-y-1">
                      <span className="text-stone-600">枠色2</span>
                      <input
                        type="color"
                        value={selected.frameColorSecondary}
                        onChange={(e) =>
                          updateElement(selected.id, {
                            frameColorSecondary: e.target.value,
                          })
                        }
                        className="w-full h-7 rounded border border-stone-300 cursor-pointer"
                      />
                    </label>
                    <label className="space-y-1">
                      <span className="text-stone-600">太さ</span>
                      <input
                        type="range"
                        min={6}
                        max={40}
                        value={selected.frameWidth}
                        onChange={(e) =>
                          updateElement(selected.id, {
                            frameWidth: Number(e.target.value),
                          })
                        }
                        className="w-full accent-red-700 mt-1.5"
                      />
                    </label>
                  </div>
                )}

                <div className="space-y-2 pt-2 border-t border-stone-200">
                  <span className="font-bold text-stone-700 block">色味補正</span>
                  <label className="block">
                    <span className="text-stone-600">
                      明るさ ({selected.filters.brightness})
                    </span>
                    <input
                      type="range"
                      min={-50}
                      max={50}
                      value={selected.filters.brightness}
                      onChange={(e) =>
                        updateElement(selected.id, {
                          filters: {
                            ...selected.filters,
                            brightness: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full accent-red-700"
                    />
                  </label>
                  <label className="block">
                    <span className="text-stone-600">
                      コントラスト ({selected.filters.contrast})
                    </span>
                    <input
                      type="range"
                      min={-50}
                      max={50}
                      value={selected.filters.contrast}
                      onChange={(e) =>
                        updateElement(selected.id, {
                          filters: {
                            ...selected.filters,
                            contrast: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full accent-red-700"
                    />
                  </label>
                  <label className="block">
                    <span className="text-stone-600">
                      彩度 ({selected.filters.saturation})
                    </span>
                    <input
                      type="range"
                      min={-50}
                      max={50}
                      value={selected.filters.saturation}
                      onChange={(e) =>
                        updateElement(selected.id, {
                          filters: {
                            ...selected.filters,
                            saturation: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full accent-red-700"
                    />
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selected.filters.sepia}
                      onChange={(e) =>
                        updateElement(selected.id, {
                          filters: {
                            ...selected.filters,
                            sepia: e.target.checked,
                          },
                        })
                      }
                      className="accent-red-700"
                    />
                    <span>レトロセピア調にする</span>
                  </label>
                </div>
              </div>
            )}

            {selected.type === "stamp" && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <label className="space-y-1">
                    <span className="font-bold text-stone-700">メイン色</span>
                    <input
                      type="color"
                      value={selected.color}
                      onChange={(e) =>
                        updateElement(selected.id, { color: e.target.value })
                      }
                      className="w-full h-8 rounded border border-stone-300 cursor-pointer"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="font-bold text-stone-700">サブ色</span>
                    <input
                      type="color"
                      value={selected.secondaryColor}
                      onChange={(e) =>
                        updateElement(selected.id, { secondaryColor: e.target.value })
                      }
                      className="w-full h-8 rounded border border-stone-300 cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            )}

            <label className="block text-xs pt-2 border-t border-stone-200">
              <span className="text-stone-600">
                不透明度 ({Math.round(selected.opacity * 100)}%)
              </span>
              <input
                type="range"
                min={0.1}
                max={1}
                step={0.05}
                value={selected.opacity}
                onChange={(e) =>
                  updateElement(selected.id, { opacity: Number(e.target.value) })
                }
                className="w-full accent-red-700"
              />
            </label>
          </div>
        ) : (
          <div className="text-xs text-stone-500 bg-stone-50 rounded-xl p-4 text-center border border-stone-200">
            キャンバス上の文字・写真・スタンプをクリックすると、ここで細かく編集できます。
          </div>
        )}

        <div className="space-y-2 pt-3 border-t border-stone-200">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              レイヤー ({elements.length})
            </h3>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={!selected}
                onClick={() => selected && reorderElement(selected.id, "up")}
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-stone-200 bg-stone-50 hover:bg-stone-100 disabled:opacity-35 text-[11px] text-stone-700 cursor-pointer disabled:cursor-not-allowed"
                title="選択レイヤーを前面へ"
              >
                <ArrowUp className="w-3 h-3" />
                前へ
              </button>
              <button
                type="button"
                disabled={!selected}
                onClick={() => selected && reorderElement(selected.id, "down")}
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-stone-200 bg-stone-50 hover:bg-stone-100 disabled:opacity-35 text-[11px] text-stone-700 cursor-pointer disabled:cursor-not-allowed"
                title="選択レイヤーを背面へ"
              >
                <ArrowDown className="w-3 h-3" />
                奥へ
              </button>
            </div>
          </div>
          <div className="space-y-1">
            {[...elements].reverse().map((el, revIdx, arr) => (
              <div
                key={el.id}
                onClick={() => selectElement(el.id)}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer border ${
                  el.id === selectedId
                    ? "border-red-400 bg-red-50 text-red-900 font-bold"
                    : "border-transparent hover:bg-stone-100 text-stone-700"
                }`}
              >
                <span className="truncate flex-1">{el.name}</span>
                <div
                  className="flex items-center gap-0.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    disabled={revIdx === 0}
                    onClick={() => reorderElement(el.id, "up")}
                    className="p-1 text-stone-500 hover:text-stone-800 disabled:opacity-25 cursor-pointer disabled:cursor-not-allowed"
                    title="前面へ"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={revIdx === arr.length - 1}
                    onClick={() => reorderElement(el.id, "down")}
                    className="p-1 text-stone-500 hover:text-stone-800 disabled:opacity-25 cursor-pointer disabled:cursor-not-allowed"
                    title="背面へ"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updateElement(el.id, { visible: !el.visible }, false)
                    }
                    className="p-1 text-stone-500 hover:text-stone-800 cursor-pointer"
                    title="表示切替"
                  >
                    {el.visible ? (
                      <Eye className="w-3.5 h-3.5" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updateElement(el.id, { locked: !el.locked }, false)
                    }
                    className="p-1 text-stone-500 hover:text-stone-800 cursor-pointer"
                    title="ロック切替"
                  >
                    {el.locked ? (
                      <Lock className="w-3.5 h-3.5 text-amber-600" />
                    ) : (
                      <Unlock className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
