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
  face: Face,
  faceProps: CosmeticProps
): React.ReactElement {
  switch (face) {
    case Face.NO_FACE:
      faceProps.top = 0;
      faceProps.left = 0;
      faceProps.scale = 1;
      return <NoFace />;
    case Face.SMILEY:
      faceProps.top = -10;
      faceProps.left = 0;
      faceProps.scale = 0.75;
      return <Smiley />;
    case Face.COOL:
      faceProps.top = -8;
      faceProps.left = -2;
      faceProps.scale = 1.25;
      return <CoolFace />;
    case Face.NERD:
      faceProps.top = -10;
      faceProps.left = 0;
      faceProps.scale = 0.75;
      return <NerdFace />;
    case Face.ANGRY:
      faceProps.top = -10;
      faceProps.left = 0;
      faceProps.scale = 0.75;
      return <AngryFace />;
    case Face.WINK:
      faceProps.top = -10;
      faceProps.left = 0;
      faceProps.scale = 0.75;
      return <WinkingFace />;
    case Face.SURPRISED:
      faceProps.top = -10;
      faceProps.left = 0;
      faceProps.scale = 0.75;
      return <SurprisedFace />;
  }
}
