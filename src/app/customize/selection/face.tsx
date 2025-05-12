import CosmeticScrollBox from "@/components/cosmetics/CosmeticBox";
import AngryFace from "@/components/cosmetics/faces/AngryFace";
import CoolFace from "@/components/cosmetics/faces/coolFace";
import NerdFace from "@/components/cosmetics/faces/NerdFace";
import NoFace from "@/components/cosmetics/faces/NoFace";
import SmileyFace from "@/components/cosmetics/faces/smiley";
import { CosmeticTiers } from "@/types/CosmeticTiers";
import { UserIconCosmetics } from "@/types/userIconCosmetics";

export default function FaceSelection({
  userIcon,
  setUserIcon,
}: {
  userIcon: UserIconCosmetics;
  setUserIcon: (icon: UserIconCosmetics) => void;
}) {
  const handleFaceClick = (face: string) => {
    setUserIcon({ ...userIcon, face });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <CosmeticScrollBox
        cosmetics={faces}
        selected={userIcon.face ?? "no_face"}
        onClick={(name) => handleFaceClick(name)}
      />
    </div>
  );
}

const faces = [
    { name: "no_face", tier: CosmeticTiers.COMMON, html: <NoFace /> },
    { name: "smiley_face", tier: CosmeticTiers.COMMON, html: <SmileyFace /> },
    { name: "cool_face", tier: CosmeticTiers.LEGENDARY, html: <CoolFace /> },
    { name: "nerd_face", tier: CosmeticTiers.EPIC, html: <NerdFace /> },
    { name: "angry_face", tier: CosmeticTiers.UNCOMMON, html: <AngryFace /> },
  ];