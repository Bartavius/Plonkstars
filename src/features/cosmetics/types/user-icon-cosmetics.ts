import type { CosmeticProps } from "./cosmetic-props";

export interface UserIconCosmetics {
  hue: number;
  saturation: number;
  brightness: number;
  // Optional because the stored demo avatar has colors only.
  hat?: CosmeticProps | null;
  body?: CosmeticProps | null;
  face?: CosmeticProps | null;
  team_color?: number;
  user_team_color?: number;
}
