import CosmeticScrollBox from "@/features/cosmetics/components/cosmetics-box";
import { CosmeticProps } from "@/features/cosmetics/types/cosmetic-props";
import { UserIconCosmetics } from "@/features/cosmetics/types/user-icon-cosmetics";

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
