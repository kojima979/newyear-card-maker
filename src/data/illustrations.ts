export interface IllustrationAsset {
  id: string;
  name: string;
  category: "moving" | "eto-2027" | "lucky";
  srcPath: string;
  defaultWidth: number;
  defaultHeight: number;
}

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBasePath(path: string): string {
  if (BASE_PATH) {
    return `${BASE_PATH}${path}`;
  }
  if (
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/newyear-card-maker")
  ) {
    return `/newyear-card-maker${path}`;
  }
  return path;
}

export const ILLUSTRATION_ASSETS: readonly IllustrationAsset[] = [
  {
    id: "ai-moving-sheep-1",
    name: "引っ越しひつじ（水彩イラスト）",
    category: "moving",
    srcPath: "/stamps/moving-sheep-1.jpg",
    defaultWidth: 460,
    defaultHeight: 460,
  },
  {
    id: "ai-moving-fuji-1",
    name: "引っ越し・富士山と新居（水彩イラスト）",
    category: "moving",
    srcPath: "/stamps/moving-fuji-1.jpg",
    defaultWidth: 520,
    defaultHeight: 520,
  },
] as const;
