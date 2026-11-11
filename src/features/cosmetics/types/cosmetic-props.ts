import { CosmeticTiers } from "./cosmetic-tiers";
import { CosmeticTypes } from "./cosmetic-types";

export interface CosmeticProps {
    image: String;
    item_name: String;
    tier: CosmeticTiers;
    type: CosmeticTypes;
    top_position: number;
    left_position: number;
    scale: number;
  }