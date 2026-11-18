"use client";

import type Konva from "konva";
import dynamic from "next/dynamic";
import { Component, type ErrorInfo, type ReactNode, useEffect, useRef, useState } from "react";
import { ExportModal } from "@/components/editor/ExportModal";
import { HeaderBar } from "@/components/editor/HeaderBar";
import { LeftSidebar } from "@/components/editor/LeftSidebar";
import { LocalPrivacyBanner } from "@/components/editor/LocalPrivacyBanner";
import { RightPanel } from "@/components/editor/RightPanel";
import { loadProjectFromLocal, saveProjectToLocal } from "@/lib/storage";
import { useEditorStore } from "@/stores/editorStore";

const CanvasStage = dynamic(
  () => import("@/components/editor/CanvasStage").then((m) => m.CanvasStage),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center bg-stone-200/80 text-sm text-stone-600 min-h-[540px]">
        キャンバスを読み込み中...
      </div>
    ),
  }
);

class CanvasErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): { error: Error } {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("CanvasStage render error:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center bg-stone-200/80 p-6 text-center min-h-[540px] gap-3">
          <p className="text-sm font-bold text-red-700">
            キャンバスの表示中にエラーが発生しました
          </p>
          <p className="text-xs text-stone-600 max-w-md break-all">
            {this.state.error.message}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-red-700 text-white text-xs font-bold cursor-pointer"
          >
            ページを再読み込み
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function HomePage() {
  const stageRef = useRef<Konva.Stage | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const {
    year,
    title,
    orientation,
    background,
    elements,
    selectedId,
    loadProject,
    exportProjectSnapshot,
    markSaved,
    undo,
    redo,
    deleteElement,
    updateElement,
  } = useEditorStore();

  // 初回ロード時にIndexedDBから自動保存データを復元
  useEffect(() => {
    let active = true;
    loadProjectFromLocal()
      .then((saved) => {
        if (active && saved) {
          loadProject(saved);
        }
      })
      .finally(() => {
        if (active) setHydrated(true);
      });
    return () => {
      active = false;
    };
  }, [loadProject]);

  // 変更をデバウンスしてIndexedDBへ自動保存
  useEffect(() => {
    if (!hydrated) return;
    const timer = window.setTimeout(() => {
      const snapshot = exportProjectSnapshot();
      saveProjectToLocal(snapshot).then(() => {
        markSaved(Date.now());
      });
    }, 600);
    return () => window.clearTimeout(timer);
  }, [
    hydrated,
    year,
    title,
    orientation,
    background,
    elements,
    exportProjectSnapshot,
    markSaved,
  ]);

  // キーボードショートカット
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT")
      ) {
        return;
      }

      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
        return;
      }

      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        e.preventDefault();
        deleteElement(selectedId);
        return;
      }

      if (selectedId && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        const current = elements.find((el) => el.id === selectedId);
        if (!current || current.locked) return;
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        const dx = e.key === "ArrowLeft" ? -step : e.key === "ArrowRight" ? step : 0;
        const dy = e.key === "ArrowUp" ? -step : e.key === "ArrowDown" ? step : 0;
        updateElement(selectedId, { x: current.x + dx, y: current.y + dy });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, elements, undo, redo, deleteElement, updateElement]);

  return (
    <div className="min-h-screen flex flex-col bg-stone-100">
      <LocalPrivacyBanner />
      <HeaderBar onOpenExport={() => setExportOpen(true)} />
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <LeftSidebar />
        <CanvasErrorBoundary>
          <CanvasStage stageRef={stageRef} />
        </CanvasErrorBoundary>
        <RightPanel />
      </main>
      <ExportModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        stageRef={stageRef}
      />
    </div>
  );
}
