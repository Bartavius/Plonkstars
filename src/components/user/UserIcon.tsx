import Smiley from "@/components/cosmetics/faces/smiley";
import Fedora from "@/components/cosmetics/hats/fedora";
import Shirt from "@/components/cosmetics/body/shirt";

export default function UserIcon({
  data,
  className,
}: {
  data: any;
  className?: string;
}) {
  const face = <Smiley />; // data.face
  const hat = <Fedora />; // data.hat
  const body = <Shirt />; // data.body
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
          style={{ top: "-15%", left: 0, transform: "scale(0.75)" }}
        >
          {face}
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
          style={{ top: "-50%", left: 0, transform: "scale(1.3)" }}
        >
          {hat}
          {/* TODO: data.hat */}
        </div>
      </div>
    </div>
  );
}
