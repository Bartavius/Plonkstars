import Smiley from "@/components/cosmetics/faces/smiley";
import Fedora from "@/components/cosmetics/hats/fedora";
import Shirt from "@/components/cosmetics/body/shirt";
import CoolFace from "@/components/cosmetics/faces/coolFace";
import NerdFace from "../cosmetics/faces/NerdFace";
import AngryFace from "../cosmetics/faces/AngryFace";
import NoFace from "../cosmetics/faces/NoFace";
import { useState } from "react";

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
  const hat = <Fedora />; // data.hat
  const body = <Shirt />; // data.body

  const [faceProps, setFaceProps] = useState<CosmeticProps>({
    top: -8,
    left: -2,
    scale: 1,
  });
  const [hatProps, setHatProps] = useState<CosmeticProps>({
    top: -45,
    left: 0,
    scale: 1.6,
  });
  const [bodyProps, setBodyProps] = useState<CosmeticProps>({
    top: 33,
    left: 0,
    scale: 0.79,
  });

  const renderFace = () => {
    switch (face) {
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
      case "no_face":
        faceProps.top = 0;
        faceProps.left = 0;
        faceProps.scale = 1;
        return <NoFace />;
      default:
        faceProps.top = 0;
        faceProps.left = 0;
        faceProps.scale = 1;
        return <NoFace />;
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
          }} // smiley should be 0.75 scale
        >
          {renderFace()}
          {/* TODO: data.face */}
        </div>

        {/* body */}
        <div
          className="absolute flex justify-center items-center w-full h-full"
          style={{ top: "33%", left: 0, transform: "scale(0.79)" }}
        >
          {body}
          {/* TODO: data.body */}
        </div>

        {/* hats */}
        <div
          className="absolute flex justify-center w-full h-full"
          style={{ top: "-45%", left: 0, transform: "scale(1.6)" }}
        >
          {hat}
          {/* TODO: data.hat */}
        </div>
      </div>
    </div>
  );
}
