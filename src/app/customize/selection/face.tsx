import CosmeticDisplayBox from "@/components/cosmetics/CosmeticDisplayBox";
import AngryFace from "@/components/cosmetics/faces/AngryFace";
import CoolFace from "@/components/cosmetics/faces/coolFace";
import NerdFace from "@/components/cosmetics/faces/NerdFace";
import SmileyFace from "@/components/cosmetics/faces/smiley";
import { UserIconCosmetics } from "@/types/userIconCosmetics";

export default function FaceSelection({
  userIcon,
  setUserIcon,
}: {
  userIcon: UserIconCosmetics;
  setUserIcon: (icon: UserIconCosmetics) => void;
}) {
  const faces = [
    { name: "smiley_face", html: <SmileyFace /> },
    { name: "cool_face", html: <CoolFace /> },
    { name: "nerd_face", html: <NerdFace /> },
    { name: "angry_face", html: <AngryFace /> },
  ];
  const handleFaceClick = (face: string) => {
    setUserIcon({ ...userIcon, face });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="w-1/2 h-1/2 bg-gray-200 rounded-lg shadow-lg text-black flex flex-col items-center justify-center">
        Selected Face: {userIcon.face}
          {faces.map((face) => (
              <CosmeticDisplayBox onClick={() => handleFaceClick(face.name)}>{face.html}</CosmeticDisplayBox>
            
          ))}
        </div>
    </div>
  );
}
