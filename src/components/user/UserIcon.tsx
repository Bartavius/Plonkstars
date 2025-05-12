import { useEffect, useState } from "react";
import { CosmeticProps } from "@/types/cosmetics/CosmeticProps";
import { renderFace } from "./RenderSwitch/faces";
import { renderBody } from "./RenderSwitch/bodies";
import { renderHat } from "./RenderSwitch/hats";
import NoFace from "../cosmetics/faces/NoFace";
import NoBody from "../cosmetics/body/NoBody";
import NoHat from "../cosmetics/hats/NoHat";
import Fedora from "../cosmetics/hats/Fedora";
import Loading from "../loading";
import { UserIconCosmetics } from "@/types/userIconCosmetics";

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


  // face stuff
  const [faceProps, setFaceProps] = useState<CosmeticProps>({
    top: 0,
    left: 0,
    scale: 1,
  });
  const [faceComponent, setFaceComponent] = useState<React.ReactElement>(
    <NoFace />
  );

  useEffect(() => {
    const { component, props } = renderFace(face);
    setFaceProps(props);
    setFaceComponent(component);
  }, [face]);

  // body stuff
  const [hatProps, setHatProps] = useState<CosmeticProps>({
    top: -45,
    left: 0,
    scale: 1.6,
  });
  const [hatComponent, sethatComponent] = useState<React.ReactElement>(
    <Fedora />
  );

    useEffect(() => {
        const { component, props } = renderHat(hat);
        setHatProps(props);
        sethatComponent(component);
        console.log("hat");
    }, [hat]);

    // body stuff
  const [bodyProps, setBodyProps] = useState<CosmeticProps>({
    top: 0,
    left: 0,
    scale: 1,
  });
    const [bodyComponent, setBodyComponent] = useState<React.ReactElement>(
        <NoBody />
    );
    useEffect(() => {
        const { component, props } = renderBody(body);
        setBodyProps(props);
        setBodyComponent(component);
        console.log("body");
    }, [body]);


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
          {faceComponent}
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
          {bodyComponent}
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
          {hatComponent}
        </div>
      </div>
    </div>
  );
}
