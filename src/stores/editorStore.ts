import { create } from "zustand";
import { DEFAULT_YEAR, resolveYearPlaceholders } from "@/data/eto";
import { CARD_TEMPLATES } from "@/data/templates";
import type {
  CardBackground,
  CardElement,
  CardOrientation,
  CardProject,
  ImageElement,
  StampElement,
  TextElement,
} from "@/types/card";
import type { CardTemplate } from "@/types/template";

interface HistorySnapshot {
  orientation: CardOrientation;
  background: CardBackground;
  elements: CardElement[];
}

interface EditorState {
  year: number;
  title: string;
  orientation: CardOrientation;
  background: CardBackground;
  elements: CardElement[];
  selectedId: string | null;
  zoom: number;
  showGuides: boolean;
  showBleed: boolean;
  past: HistorySnapshot[];
  future: HistorySnapshot[];
  lastSavedAt: number | null;

  setYear: (year: number) => void;
  setTitle: (title: string) => void;
  setOrientation: (orientation: CardOrientation) => void;
  setBackground: (patch: Partial<CardBackground>) => void;
  selectElement: (id: string | null) => void;
  setZoom: (zoom: number) => void;
  toggleGuides: () => void;
  toggleBleed: () => void;

  addTextElement: (partial?: Partial<TextElement>) => string;
  addImageElement: (partial: Omit<ImageElement, "id" | "type">) => string;
  addStampElement: (partial: Omit<StampElement, "id" | "type">) => string;
  updateElement: (id: string, patch: Partial<CardElement>, recordHistory?: boolean) => void;
  deleteElement: (id: string) => void;
  duplicateElement: (id: string) => void;
  reorderElement: (id: string, direction: "up" | "down" | "top" | "bottom") => void;

  applyTemplate: (template: CardTemplate) => void;
  loadProject: (project: CardProject) => void;
  exportProjectSnapshot: () => CardProject;
  markSaved: (timestamp: number) => void;

  undo: () => void;
  redo: () => void;
}

const MAX_HISTORY = 40;

function createId(prefix: string): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function cloneElements(elements: readonly CardElement[]): CardElement[] {
  return elements.map((el) => ({ ...el }));
}

function pushHistory(state: EditorState): Pick<EditorState, "past" | "future"> {
  const snapshot: HistorySnapshot = {
    orientation: state.orientation,
    background: { ...state.background },
    elements: cloneElements(state.elements),
  };
  const nextPast = [...state.past, snapshot].slice(-MAX_HISTORY);
  return { past: nextPast, future: [] };
}

const initialTemplate = CARD_TEMPLATES[0];

export const useEditorStore = create<EditorState>((set, get) => ({
  year: DEFAULT_YEAR,
  title: "無題の年賀状",
  orientation: initialTemplate.orientation,
  background: { ...initialTemplate.background },
  elements: cloneElements(initialTemplate.elements),
  selectedId: null,
  zoom: 0.36,
  showGuides: true,
  showBleed: true,
  past: [],
  future: [],
  lastSavedAt: null,

  setYear: (year) => set({ year }),
  setTitle: (title) => set({ title }),

  setOrientation: (orientation) =>
    set((state) => ({
      ...pushHistory(state),
      orientation,
    })),

  setBackground: (patch) =>
    set((state) => ({
      ...pushHistory(state),
      background: { ...state.background, ...patch },
    })),

  selectElement: (selectedId) => set({ selectedId }),
  setZoom: (zoom) => set({ zoom: Math.min(1.5, Math.max(0.15, zoom)) }),
  toggleGuides: () => set((state) => ({ showGuides: !state.showGuides })),
  toggleBleed: () => set((state) => ({ showBleed: !state.showBleed })),

  addTextElement: (partial) => {
    const id = createId("text");
    const newEl: TextElement = {
      id,
      name: partial?.name ?? "テキスト",
      type: "text",
      text: partial?.text ?? "謹賀新年",
      writingMode: partial?.writingMode ?? "vertical",
      tateChuYoko: partial?.tateChuYoko ?? true,
      fontFamily: partial?.fontFamily ?? "'Yuji Syuku', serif",
      fontSize: partial?.fontSize ?? 84,
      fontWeight: partial?.fontWeight ?? "bold",
      color: partial?.color ?? "#2B2B2B",
      letterSpacing: partial?.letterSpacing ?? 8,
      lineHeight: partial?.lineHeight ?? 1.4,
      align: partial?.align ?? "center",
      strokeColor: partial?.strokeColor ?? "#FFFFFF",
      strokeWidth: partial?.strokeWidth ?? 0,
      shadowEnabled: partial?.shadowEnabled ?? false,
      shadowColor: partial?.shadowColor ?? "rgba(0,0,0,0.2)",
      x: partial?.x ?? 380,
      y: partial?.y ?? 260,
      width: partial?.width ?? 420,
      height: partial?.height ?? 520,
      rotation: partial?.rotation ?? 0,
      opacity: partial?.opacity ?? 1,
      visible: true,
      locked: false,
    };

    set((state) => ({
      ...pushHistory(state),
      elements: [...state.elements, newEl],
      selectedId: id,
    }));
    return id;
  },

  addImageElement: (partial) => {
    const id = createId("img");
    const newEl: ImageElement = {
      ...partial,
      id,
      type: "image",
    };
    set((state) => ({
      ...pushHistory(state),
      elements: [...state.elements, newEl],
      selectedId: id,
    }));
    return id;
  },

  addStampElement: (partial) => {
    const id = createId("stamp");
    const newEl: StampElement = {
      ...partial,
      id,
      type: "stamp",
    };
    set((state) => ({
      ...pushHistory(state),
      elements: [...state.elements, newEl],
      selectedId: id,
    }));
    return id;
  },

  updateElement: (id, patch, recordHistory = true) =>
    set((state) => ({
      ...(recordHistory ? pushHistory(state) : {}),
      elements: state.elements.map((el) =>
        el.id === id ? ({ ...el, ...patch } as CardElement) : el
      ),
    })),

  deleteElement: (id) =>
    set((state) => ({
      ...pushHistory(state),
      elements: state.elements.filter((el) => el.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    })),

  duplicateElement: (id) =>
    set((state) => {
      const target = state.elements.find((el) => el.id === id);
      if (!target) return state;
      const newId = createId(target.type);
      const cloned: CardElement = {
        ...target,
        id: newId,
        name: `${target.name} (コピー)`,
        x: target.x + 40,
        y: target.y + 40,
      };
      return {
        ...pushHistory(state),
        elements: [...state.elements, cloned],
        selectedId: newId,
      };
    }),

  reorderElement: (id, direction) =>
    set((state) => {
      const idx = state.elements.findIndex((el) => el.id === id);
      if (idx === -1) return state;
      const next = [...state.elements];
      const [item] = next.splice(idx, 1);
      if (!item) return state;

      if (direction === "up") {
        next.splice(Math.min(next.length, idx + 1), 0, item);
      } else if (direction === "down") {
        next.splice(Math.max(0, idx - 1), 0, item);
      } else if (direction === "top") {
        next.push(item);
      } else {
        next.unshift(item);
      }
      return {
        ...pushHistory(state),
        elements: next,
      };
    }),

  applyTemplate: (template) =>
    set((state) => ({
      ...pushHistory(state),
      title: resolveYearPlaceholders(template.name, state.year),
      orientation: template.orientation,
      background: { ...template.background },
      elements: cloneElements(template.elements),
      selectedId: null,
    })),

  loadProject: (project) =>
    set({
      year: project.year,
      title: project.title,
      orientation: project.orientation,
      background: { ...project.background },
      elements: cloneElements(project.elements),
      selectedId: null,
      past: [],
      future: [],
      lastSavedAt: project.updatedAt,
    }),

  exportProjectSnapshot: () => {
    const state = get();
    return {
      id: "current-draft",
      title: state.title,
      year: state.year,
      orientation: state.orientation,
      background: { ...state.background },
      elements: cloneElements(state.elements),
      updatedAt: Date.now(),
    };
  },

  markSaved: (timestamp) => set({ lastSavedAt: timestamp }),

  undo: () =>
    set((state) => {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      if (!previous) return state;
      const currentSnapshot: HistorySnapshot = {
        orientation: state.orientation,
        background: { ...state.background },
        elements: cloneElements(state.elements),
      };
      return {
        orientation: previous.orientation,
        background: previous.background,
        elements: previous.elements,
        past: state.past.slice(0, -1),
        future: [currentSnapshot, ...state.future].slice(0, MAX_HISTORY),
        selectedId: null,
      };
    }),

  redo: () =>
    set((state) => {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      if (!next) return state;
      const currentSnapshot: HistorySnapshot = {
        orientation: state.orientation,
        background: { ...state.background },
        elements: cloneElements(state.elements),
      };
      return {
        orientation: next.orientation,
        background: next.background,
        elements: next.elements,
        past: [...state.past, currentSnapshot].slice(-MAX_HISTORY),
        future: state.future.slice(1),
        selectedId: null,
      };
    }),
}));
