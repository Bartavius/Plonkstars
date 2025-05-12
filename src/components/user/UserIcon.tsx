import Smiley from "@/components/cosmetics/faces/SmileyFace";
import Fedora from "@/components/cosmetics/hats/Fedora";
import Shirt from "@/components/cosmetics/body/PurpleShirt";
import CoolFace from "@/components/cosmetics/faces/CoolFace";
import NerdFace from "../cosmetics/faces/NerdFace";
import AngryFace from "../cosmetics/faces/AngryFace";
import NoFace from "../cosmetics/faces/NoFace";
import { useState } from "react";
import PurpleShirt from "@/components/cosmetics/body/PurpleShirt";
import NoBody from "../cosmetics/body/NoBody";
import NoHat from "../cosmetics/hats/NoHat";
import { CosmeticProps } from "@/types/cosmetics/CosmeticProps";
import { renderFace } from "./RenderSwitch/faces";
import { renderBody } from "./RenderSwitch/bodies";
import { renderHat } from "./RenderSwitch/hats";

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

  return (
    <div className={className ? className : "w-full"}>
      <div className="relative flex justify-center items-center w-full h-full">
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
          {renderFace(face, faceProps)}
        </div>

        {/* body */}
        <div
          className="absolute flex justify-center items-center w-full h-full"
          style={{
            top: `${bodyProps.top}%`,
            left: `${bodyProps.left}%`,
            transform: `scale(${bodyProps.scale})`,
          }}
        >
          {renderBody(body, bodyProps)}
        </div>

        {/* hats */}
        <div
          className="absolute flex justify-center items-center w-full h-full"
          style={{
            top: `${hatProps.top}%`,
            left: `${hatProps.left}%`,
            transform: `scale(${hatProps.scale})`,
          }}
        >
          {renderHat(hat, hatProps)}
        </div>
      </div>
    </div>
  );
}
