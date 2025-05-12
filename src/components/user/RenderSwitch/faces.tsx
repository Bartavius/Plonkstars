import AngryFace from "@/components/cosmetics/faces/AngryFace";
import CoolFace from "@/components/cosmetics/faces/CoolFace";
import NerdFace from "@/components/cosmetics/faces/NerdFace";
import NoFace from "@/components/cosmetics/faces/NoFace";
import Smiley from "@/components/cosmetics/faces/SmileyFace";
import SurprisedFace from "@/components/cosmetics/faces/SurprisedFace";
import WinkingFace from "@/components/cosmetics/faces/WinkingFace";
import { CosmeticProps } from "@/types/cosmetics/CosmeticProps";
import { Face } from "@/types/cosmetics/faces";

export function renderFace(
    face: Face
  ): { component: React.ReactElement; props: CosmeticProps } {
    switch (face) {
      case Face.NO_FACE:
        return { component: <NoFace />, props: { top: 0, left: 0, scale: 1 } };
      case Face.SMILEY:
        return { component: <Smiley />, props: { top: -10, left: 0, scale: 0.75 } };
      case Face.COOL:
        return { component: <CoolFace />, props: { top: -8, left: -2, scale: 1.25 } };
      case Face.NERD:
        return { component: <NerdFace />, props: { top: -10, left: 0, scale: 0.75 } };
      case Face.ANGRY:
        return { component: <AngryFace />, props: { top: -10, left: 0, scale: 0.75 } };
      case Face.WINK:
        return { component: <WinkingFace />, props: { top: -10, left: 0, scale: 0.75 } };
      case Face.SURPRISED:
        return { component: <SurprisedFace />, props: { top: -10, left: 0, scale: 0.75 } };
      default:
        return { component: <NoFace />, props: { top: 0, left: 0, scale: 1 } };
    }
  }
  