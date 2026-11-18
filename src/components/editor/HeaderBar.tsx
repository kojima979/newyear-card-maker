"use client";

import {
  Download,
  FileJson,
  Grid,
  Redo2,
  RotateCw,
  Scissors,
  Undo2,
  Upload,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { getEtoByYear, getWareki } from "@/data/eto";
import { useEditorStore } from "@/stores/editorStore";
import type { CardProject } from "@/types/card";
import { useRef } from "react";

interface HeaderBarProps {
  onOpenExport: () => void;
}

const YEAR_OPTIONS = [2026, 2027, 2028, 2029, 2030];

export function HeaderBar({ onOpenExport }: HeaderBarProps) {
  const {
    year,
    orientation,
    zoom,
    showGuides,
    showBleed,
    past,
    future,
    lastSavedAt,
    setYear,
    setOrientation,
    setZoom,
    toggleGuides,
    toggleBleed,
    undo,
    redo,
    exportProjectSnapshot,
    loadProject,
  } = useEditorStore();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const eto = getEtoByYear(year);
  const wareki = getWareki(year);

  const handleDownloadJson = () => {
    const snapshot = exportProjectSnapshot();
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `nengajo-${year}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as CardProject;
      if (parsed && Array.isArray(parsed.elements) && parsed.background) {
        loadProject(parsed);
      }
    } catch {
      // 不正なJSONは無視
    } finally {
      e.target.value = "";
    }
  };

  return (
    <header className="bg-white border-b border-stone-200 px-4 py-2.5 shadow-xs">
      <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-700 text-white font-serif font-bold text-base shadow-xs">
              賀
            </span>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-stone-900 leading-tight">
                最強の年賀状メーカー
              </h1>
              <p className="text-[11px] text-stone-500">
                {lastSavedAt
                  ? `端末内に自動保存済み (${new Date(lastSavedAt).toLocaleTimeString()})`
                  : "ブラウザ自動保存有効"}
              </p>
            </div>
          </div>

          <div className="h-6 w-px bg-stone-200 hidden sm:block" />

          <label className="flex items-center gap-1.5 text-xs font-medium text-stone-700 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
            <span>対象年:</span>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="bg-transparent font-bold text-red-800 focus:outline-none cursor-pointer"
            >
              {YEAR_OPTIONS.map((y) => {
                const info = getEtoByYear(y);
                return (
                  <option key={y} value={y}>
                    {y}年（{info.kanji}・{info.animal}）
                  </option>
                );
              })}
            </select>
            <span className="text-[11px] text-amber-800 hidden md:inline">
              {wareki.label} / {eto.emoji}
            </span>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex items-center rounded-lg border border-stone-200 bg-stone-50 p-0.5">
            <button
              type="button"
              onClick={undo}
              disabled={past.length === 0}
              className="p-1.5 rounded-md hover:bg-white disabled:opacity-35 text-stone-700 cursor-pointer disabled:cursor-not-allowed"
              title="元に戻す (Cmd/Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={future.length === 0}
              className="p-1.5 rounded-md hover:bg-white disabled:opacity-35 text-stone-700 cursor-pointer disabled:cursor-not-allowed"
              title="やり直す (Cmd/Ctrl+Shift+Z)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() =>
              setOrientation(orientation === "portrait" ? "landscape" : "portrait")
            }
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-xs font-medium text-stone-700 cursor-pointer"
            title="縦向き / 横向きを切り替え"
          >
            <RotateCw className="w-3.5 h-3.5" />
            {orientation === "portrait" ? "縦向き" : "横向き"}
          </button>

          <button
            type="button"
            onClick={toggleGuides}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium cursor-pointer ${
              showGuides
                ? "border-sky-300 bg-sky-50 text-sky-800"
                : "border-stone-200 bg-white text-stone-600"
            }`}
            title="安全マージンガイド"
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">ガイド</span>
          </button>

          <button
            type="button"
            onClick={toggleBleed}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium cursor-pointer ${
              showBleed
                ? "border-rose-300 bg-rose-50 text-rose-800"
                : "border-stone-200 bg-white text-stone-600"
            }`}
            title="塗り足し3mm表示"
          >
            <Scissors className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">塗り足し</span>
          </button>

          <div className="flex items-center rounded-lg border border-stone-200 bg-white px-1.5 py-1 gap-1 text-xs">
            <button
              type="button"
              onClick={() => setZoom(zoom - 0.05)}
              className="p-0.5 hover:bg-stone-100 rounded cursor-pointer"
              aria-label="縮小"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center font-mono text-[11px]">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom(zoom + 0.05)}
              className="p-0.5 hover:bg-stone-100 rounded cursor-pointer"
              aria-label="拡大"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleDownloadJson}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-xs font-medium text-stone-700 cursor-pointer"
            title="編集データをJSONで保存"
          >
            <FileJson className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">JSON保存</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-xs font-medium text-stone-700 cursor-pointer"
            title="JSONファイルを読み込む"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">読込</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImportJson}
            className="hidden"
          />

          <button
            type="button"
            onClick={onOpenExport}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs sm:text-sm font-bold shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            PDF・画像出力
          </button>
        </div>
      </div>
    </header>
  );
}
