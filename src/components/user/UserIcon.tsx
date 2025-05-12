import Smiley from "@/components/cosmetics/faces/smiley";
import Fedora from "@/components/cosmetics/hats/fedora";
import Shirt from "@/components/cosmetics/body/PurpleShirt";
import CoolFace from "@/components/cosmetics/faces/coolFace";
import NerdFace from "../cosmetics/faces/NerdFace";
import AngryFace from "../cosmetics/faces/AngryFace";
import NoFace from "../cosmetics/faces/NoFace";
import { useState } from "react";
import PurpleShirt from "@/components/cosmetics/body/PurpleShirt";
import NoBody from "../cosmetics/body/NoBody";
import NoHat from "../cosmetics/hats/NoHat";

interface CosmeticProps {
  top: number;
  left: number;
  scale: number;
}

export default function UserIcon({
  data,
  className,
}: {
  data: any;
  className?: string;
}) {
  const face = data.face;
  const hat = data.hat;
  const body = data.body;

  const [faceProps, setFaceProps] = useState<CosmeticProps>({
    top: 0,
    left: 0,
    scale: 1,
  });
  const [hatProps, setHatProps] = useState<CosmeticProps>({
    top: -45,
    left: 0,
    scale: 1.6,
  });
  const [bodyProps, setBodyProps] = useState<CosmeticProps>({
    top: 0,
    left: 0,
    scale: 1,
  });

  const renderFace = () => {
    switch (face) {
      case "no_face":
        faceProps.top = 0;
        faceProps.left = 0;
        faceProps.scale = 1;
        return <NoFace />;
      case "smiley_face":
        faceProps.top = -10;
        faceProps.left = 0;
        faceProps.scale = 0.75;
        return <Smiley />;
      case "cool_face":
        faceProps.top = -8;
        faceProps.left = -2;
        faceProps.scale = 1.25;
        return <CoolFace />;
      case "nerd_face":
        faceProps.top = -10;
        faceProps.left = 0;
        faceProps.scale = 0.75;
        return <NerdFace />;
      case "angry_face":
        faceProps.top = -10;
        faceProps.left = 0;
        faceProps.scale = 0.75;
        return <AngryFace />;
      default:
        faceProps.top = 0;
        faceProps.left = 0;
        faceProps.scale = 1;
        return <NoFace />;
    }
  };

  const renderBody = () => {
    switch (body) {
      case "no_body":
        bodyProps.top = 0;
        bodyProps.left = 0;
        bodyProps.scale = 1;
        return <NoBody />;
      case "purple_shirt":
        bodyProps.top = 33;
        bodyProps.left = 0;
        bodyProps.scale = 0.79;
        return <PurpleShirt />;
      default:
        bodyProps.top = 0;
        bodyProps.left = 0;
        bodyProps.scale = 1;
        return <NoBody />;
    }
  };

  const renderHat = () => {
    switch (hat) {
      case "no_hat":
        hatProps.top = 0;
        hatProps.left = 0;
        hatProps.scale = 1;
        return <NoHat />;
      case "fedora":
        hatProps.top = -45;
        hatProps.left = 0;
        hatProps.scale = 1.6;
        return <Fedora />;
      default:
        hatProps.top = 0;
        hatProps.left = 0;
        hatProps.scale = 1;
        return <NoHat />;
    }
  };

  return (
    <div className={className ? className : "w-full"}>
      <div className="relative">
        <img
          src="/PlonkStarsAvatar.svg"
          style={{
            filter: `hue-rotate(${data.hue}deg) saturate(${data.saturation}%) brightness(${data.brightness}%)`,
          }}
          alt=""
        />

        {/* faces */}
        <div
          className="absolute flex justify-center items-center w-full h-full"
          style={{
            top: `${faceProps.top}%`,
            left: `${faceProps.left}%`,
            transform: `scale(${faceProps.scale})`,
          }}
        >
          {renderFace()}
        </div>

        {/* body */}
        <div
          className="absolute flex justify-center items-center w-full h-full"
          style={{
            top: `${bodyProps.top}%`,
            left: `${bodyProps.left}%`,
            transform: `scale(${bodyProps.scale})`,
          }} // smiley should be 0.75 scale
        >
          {renderBody()}
        </div>

        {/* hats */}
        <div
          className="absolute flex justify-center items-center w-full h-full"
          style={{
            top: `${hatProps.top}%`,
            left: `${hatProps.left}%`,
            transform: `scale(${hatProps.scale})`,
          }} // smiley should be 0.75 scale
        >
          {renderHat()}
        </div>
      </div>
    </div>
  );
}
