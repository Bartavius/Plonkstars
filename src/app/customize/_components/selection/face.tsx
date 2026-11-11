import CosmeticScrollBox from "@/features/cosmetics/components/cosmetics-box";
import { CosmeticProps } from "@/features/cosmetics/types/cosmetic-props";
import { UserIconCosmetics } from "@/features/cosmetics/types/user-icon-cosmetics";

export default function FaceSelection({
  userIcon,
  setUserIcon,
  facesOwned, //TODO: figure out the facesOwned / not owned
  facesUnowned,
}: {
  userIcon: UserIconCosmetics;
  setUserIcon: (icon: UserIconCosmetics) => void;
  facesOwned: CosmeticProps[];
  facesUnowned: CosmeticProps[];
}) {
  const handleFaceClick = (face: CosmeticProps | null) => {
    setUserIcon({ ...userIcon, face });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <CosmeticScrollBox
        cosmeticsOwned={facesOwned}
        cosmeticsUnowned={facesUnowned}
        selected={userIcon.face?.image ? userIcon.face.image.toString() : null}
        onClick={(face) => handleFaceClick(face)}
      />
    </div>
  );
}
