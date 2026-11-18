"use client";

import { ChevronDown, ChevronUp, HardDrive, Info, ShieldCheck, X } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "nengajo-privacy-banner-minimized";

export function LocalPrivacyBanner() {
  const [showDetail, setShowDetail] = useState(false);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === "true") {
        setMinimized(true);
      }
    } catch {
      // localStorage無効時は無視
    }
  }, []);

  const toggleMinimized = () => {
    setMinimized((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // localStorage無効時は無視
      }
      return next;
    });
  };

  return (
    <>
      <div
        className={`bg-emerald-900 text-emerald-50 border-b border-emerald-700/70 px-4 transition-all ${
          minimized ? "py-0.5 text-xs" : "py-2 text-xs sm:text-sm"
        }`}
      >
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-2">
          {minimized ? (
            <>
              <div
                className="flex items-center text-emerald-300"
                title="完全ローカル処理（サーバー送信なし）"
              >
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              </div>
              <button
                type="button"
                onClick={toggleMinimized}
                className="inline-flex items-center justify-center rounded bg-emerald-800/80 hover:bg-emerald-700 p-0.5 text-emerald-100 border border-emerald-600/40 cursor-pointer"
                aria-label="お知らせを展開"
                title="ローカル処理のお知らせを展開"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2.5 font-medium">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-700/90 px-2.5 py-0.5 text-emerald-100 font-semibold border border-emerald-500/40 shrink-0">
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  完全ローカル処理
                </span>
                <span>
                  <strong className="text-white underline decoration-emerald-400/70 underline-offset-2">
                    お写真・デザインデータはサーバーに一切アップロードされません。
                  </strong>
                  すべての画像加工・自動保存はお使いのブラウザ内（端末ローカル）だけで完結します。
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowDetail(true)}
                  className="inline-flex items-center gap-1 text-emerald-200 hover:text-white underline underline-offset-2 shrink-0 cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5" />
                  仕組みを確認
                </button>
                <button
                  type="button"
                  onClick={toggleMinimized}
                  className="inline-flex items-center gap-1 rounded-md bg-emerald-800 hover:bg-emerald-700 px-2 py-0.5 text-xs text-emerald-100 border border-emerald-600/50 cursor-pointer"
                  aria-label="お知らせを最小化"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                  最小化
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {showDetail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowDetail(false)}
        >
          <div
            className="bg-white text-stone-800 rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
                <HardDrive className="w-5 h-5" />
                プライバシーとデータ保存について
              </div>
              <button
                type="button"
                onClick={() => setShowDetail(false)}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-500 cursor-pointer"
                aria-label="閉じる"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <ul className="space-y-2.5 text-sm text-stone-700 leading-relaxed">
              <li>
                • <strong>通信なし：</strong>
                このアプリは静的サイト（GitHub Pages）として動作しており、写真や文字を外部サーバーへ送信する機能は一切ありません。
              </li>
              <li>
                • <strong>端末内に自動保存：</strong>
                編集中のデータはブラウザ内部のストレージ（IndexedDB）に自動保存されるため、ページを閉じても続きから再開できます。
              </li>
              <li>
                • <strong>ご注意ください：</strong>
                ブラウザの履歴・サイトデータを削除すると保存内容も消えます。大切なデータは「JSON保存」または「PDF/画像書き出し」で端末へ保存してください。
              </li>
            </ul>
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowDetail(false)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-medium cursor-pointer"
              >
                わかりました
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
