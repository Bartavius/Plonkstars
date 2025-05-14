import { CosmeticProps } from "./cosmetics/CosmeticProps";

export interface UserIconCosmetics {
    hue: number;
    saturation: number;
    brightness: number;
    hat: CosmeticProps | null;
    body: CosmeticProps | null;
    face: CosmeticProps | null;
  }
