import CosmeticScrollBox from "@/components/cosmetics/CosmeticsBox";
import { CosmeticProps } from "@/types/cosmetics/CosmeticProps";
import { UserIconCosmetics } from "@/types/userIconCosmetics";

export default function HatSelection({
  userIcon,
  setUserIcon,
  hatsOwned,
  hatsUnowned,
}: {
  userIcon: UserIconCosmetics;
  setUserIcon: (icon: UserIconCosmetics) => void;
  hatsOwned: CosmeticProps[];
  hatsUnowned: CosmeticProps[];
}) {
  const handleHatClick = (hat: CosmeticProps | null) => {
    setUserIcon({ ...userIcon, hat });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <CosmeticScrollBox
        cosmeticsOwned={hatsOwned}
        cosmeticsUnowned={hatsUnowned}
        selected={userIcon.hat?.image ? userIcon.hat.image.toString() : null}
        onClick={(hat) => handleHatClick(hat)}
      />
    </div>
  );
}