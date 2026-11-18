export type CardOrientation = "portrait" | "landscape";

export type WritingMode = "vertical" | "horizontal";

export type ImageMaskType =
  | "none"
  | "rounded"
  | "circle"
  | "diamond"
  | "plum"
  | "sheep";

export type ImageEdgeEffect =
  | "none"
  | "feather"
  | "washi-torn"
  | "brush"
  | "polaroid"
  | "stamp"
  | "double-frame";

export type BackgroundPattern =
  | "none"
  | "washi"
  | "ichimatsu"
  | "asanoha"
  | "seigaiha";

export interface CardBackground {
  type: "solid" | "gradient";
  color: string;
  secondaryColor: string;
  pattern: BackgroundPattern;
  patternOpacity: number;
}

export interface BaseElement {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
}

export interface TextElement extends BaseElement {
  type: "text";
  text: string;
  writingMode: WritingMode;
  tateChuYoko: boolean;
  fontFamily: string;
  fontSize: number;
  fontWeight: "normal" | "bold";
  color: string;
  letterSpacing: number;
  lineHeight: number;
  align: "left" | "center" | "right";
  strokeColor: string;
  strokeWidth: number;
  shadowEnabled: boolean;
  shadowColor: string;
}

export interface ImageFilters {
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
  saturation: number; // -100 to 100
  sepia: boolean;
}

export interface ImageElement extends BaseElement {
  type: "image";
  src: string;
  naturalWidth: number;
  naturalHeight: number;
  mask: ImageMaskType;
  edgeEffect: ImageEdgeEffect;
  frameColor: string;
  frameColorSecondary: string;
  frameWidth: number;
  filters: ImageFilters;
}

export interface StampElement extends BaseElement {
  type: "stamp";
  stampId: string;
  color: string;
  secondaryColor: string;
}

export type CardElement = TextElement | ImageElement | StampElement;

export interface CardProject {
  id: string;
  title: string;
  year: number;
  orientation: CardOrientation;
  background: CardBackground;
  elements: CardElement[];
  updatedAt: number;
}
