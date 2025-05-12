import NoBody from "@/components/cosmetics/body/NoBody";
import Shirt from "@/components/cosmetics/body/PurpleShirt";

import { CosmeticTiers } from "@/types/CosmeticTiers";
export const bodies = [
  { name: "no_shirt", tier: CosmeticTiers.COMMON, html: <NoBody /> },
  { name: "purple_shirt", tier: CosmeticTiers.COMMON, html: <Shirt /> },
];
