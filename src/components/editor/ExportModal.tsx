"use client";

import type Konva from "konva";
import { Download, FileImage, FileText, X } from "lucide-react";
import { useState } from "react";
import { exportCardFromDataUrl, type ExportFormat } from "@/lib/exporter";
import { useEditorStore } from "@/stores/editorStore";

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  stageRef: React.RefObject<Konva.Stage | null>;
}

export function ExportModal({ open, onClose, stageRef }: ExportModalProps) {
  const { year, orientation, zoom, selectElement } = useEditorStore();
  const [format, setFormat] = useState<ExportFormat>("pdf");
  const [includeBleed, setIncludeBleed] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  if (!open) return null;

  const handleExport = () => {
    const stage = stageRef.current;
    if (!stage) return;

    setIsExporting(true);
    try {
      // 選択枠や印刷ガイドを出力に含めないよう一時退避
      selectElement(null);
      const guideLayer = stage.findOne(".guide-layer");
      const prevGuideVisible = guideLayer?.visible() ?? true;
      guideLayer?.visible(false);
      stage.batchDraw();

      const mimeType = format === "jpeg" ? "image/jpeg" : "image/png";
      const dataUrl = stage.toDataURL({
        pixelRatio: 1 / zoom,
        mimeType,
        quality: 0.95,
      });

      guideLayer?.visible(prevGuideVisible);
      stage.batchDraw();

      exportCardFromDataUrl(dataUrl, {
        format,
        includeBleed,
        jpegQuality: 0.95,
        fileName: `nengajo-${year}`,
        orientation,
      });
      onClose();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <h2 className="text-base font-bold text-stone-900">
            年賀状の書き出し（300dpi高精細）
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-stone-100 text-stone-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2.5">
          <span className="text-xs font-bold text-stone-700 block">
            出力フォーマット
          </span>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { id: "pdf", label: "印刷用PDF", icon: <FileText className="w-4 h-4" /> },
                { id: "png", label: "PNG画像", icon: <FileImage className="w-4 h-4" /> },
                { id: "jpeg", label: "JPEG画像", icon: <FileImage className="w-4 h-4" /> },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFormat(opt.id)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-bold cursor-pointer ${
                  format === opt.id
                    ? "border-red-700 bg-red-50 text-red-800"
                    : "border-stone-200 text-stone-600 hover:bg-stone-50"
                }`}
              >
                {opt.icon}
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {format === "pdf" && (
          <label className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={includeBleed}
              onChange={(e) => setIncludeBleed(e.target.checked)}
              className="mt-0.5 accent-red-700"
            />
            <div>
              <span className="font-bold text-stone-800 block">
                フチなし印刷用の塗り足しサイズ（106×154mm）で出力
              </span>
              <span className="text-stone-500">
                オフの場合は標準はがきサイズ（100×148mm）で出力されます。
              </span>
            </div>
          </label>
        )}

        <div className="text-[11px] text-stone-500 bg-emerald-50 border border-emerald-200 rounded-lg p-2.5">
          書き出し処理もすべてブラウザ内で完結するため、画像が外部へ送信されることはありません。
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-50 cursor-pointer"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {isExporting ? "生成中..." : "ダウンロード"}
          </button>
        </div>
      </div>
    </div>
  );
}
