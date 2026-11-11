import type { CosmeticProps } from "./cosmetic-props";

export interface UserIconCosmetics {
  hue: number;
  saturation: number;
  brightness: number;
  hat: CosmeticProps | null;
  body: CosmeticProps | null;
  face: CosmeticProps | null;
}
