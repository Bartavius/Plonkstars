import type { CosmeticTiers } from "./cosmetic-tiers";
import type { CosmeticTypes } from "./cosmetic-types";

export interface CosmeticProps {
  image: string;
  item_name: string;
  tier: CosmeticTiers;
  type: CosmeticTypes;
  top_position: number;
  left_position: number;
  scale: number;
}
