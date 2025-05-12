import CosmeticScrollBox from "@/components/cosmetics/CosmeticBox";
import { faces } from "../cosmetic_lists/faces";
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