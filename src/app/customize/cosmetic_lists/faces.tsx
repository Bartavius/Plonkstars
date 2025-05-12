import { CosmeticTiers } from "@/types/CosmeticTiers";
import NoFace from "@/components/cosmetics/faces/NoFace";
import CoolFace from "@/components/cosmetics/faces/CoolFace";
import SmileyFace from "@/components/cosmetics/faces/SmileyFace";
import NerdFace from "@/components/cosmetics/faces/NerdFace";
import AngryFace from "@/components/cosmetics/faces/AngryFace";
import SurprisedFace from "@/components/cosmetics/faces/SurprisedFace";
import WinkingFace from "@/components/cosmetics/faces/WinkingFace";

export const faces = [
  // commons
    { name: "no_face", tier: CosmeticTiers.COMMON, html: <NoFace /> },
    { name: "smiley_face", tier: CosmeticTiers.COMMON, html: <SmileyFace /> },
    { name: "surprised_face", tier: CosmeticTiers.COMMON, html: <SurprisedFace /> },

    // uncommons
    { name: "angry_face", tier: CosmeticTiers.UNCOMMON, html: <AngryFace /> },

    // rares
    { name: "winking_face", tier: CosmeticTiers.RARE, html: <WinkingFace /> },

    // epics
    { name: "nerd_face", tier: CosmeticTiers.EPIC, html: <NerdFace /> },

    // legendaries
    { name: "cool_face", tier: CosmeticTiers.LEGENDARY, html: <CoolFace /> },
];