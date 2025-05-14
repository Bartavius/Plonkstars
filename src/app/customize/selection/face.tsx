import CosmeticScrollBox from "@/components/cosmetics/CosmeticsBox";
import { CosmeticProps } from "@/types/cosmetics/CosmeticProps";
import { UserIconCosmetics } from "@/types/userIconCosmetics";

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