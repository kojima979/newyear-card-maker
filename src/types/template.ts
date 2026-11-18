import type { CardBackground, CardElement, CardOrientation } from "./card";

export type TemplateCategory =
  | "all"
  | "photo"
  | "japanese"
  | "calligraphy"
  | "casual"
  | "business";

export interface CardTemplate {
  id: string;
  name: string;
  category: Exclude<TemplateCategory, "all">;
  description: string;
  orientation: CardOrientation;
  etoKey?: string;
  background: CardBackground;
  elements: CardElement[];
}
