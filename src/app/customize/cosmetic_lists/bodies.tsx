import NoBody from "@/components/cosmetics/body/NoBody";
import Shirt from "@/components/cosmetics/body/PurpleShirt";
import PixelTuxedo from "@/components/cosmetics/body/Tuxedo";

import { CosmeticTiers } from "@/types/CosmeticTiers";
export const bodies = [
    // commons
  { name: "no_shirt", tier: CosmeticTiers.COMMON, html: <NoBody /> },
  { name: "purple_shirt", tier: CosmeticTiers.COMMON, html: <Shirt /> },

  // epics
  { name: "tuxedo", tier: CosmeticTiers.EPIC, html: <PixelTuxedo /> },
];
