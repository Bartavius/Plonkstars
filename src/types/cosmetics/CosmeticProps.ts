import { CosmeticTiers } from "../CosmeticTiers";
import { CosmeticTypes } from "./CosmeticTypes";

export interface CosmeticProps {
    image: String;
    item_name: String;
    tier: CosmeticTiers;
    type: CosmeticTypes;
    top_position: number;
    left_position: number;
    scale: number;
  }