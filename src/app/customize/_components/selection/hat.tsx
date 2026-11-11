import { CosmeticScrollBox } from "@/features/cosmetics/components/cosmetics-box";
import type { CosmeticProps } from "@/features/cosmetics/types/cosmetic-props";
import type { UserIconCosmetics } from "@/features/cosmetics/types/user-icon-cosmetics";
interface HatSelectionProps {
  userIcon: UserIconCosmetics;
  setUserIcon: (icon: UserIconCosmetics) => void;
  hatsOwned: CosmeticProps[];
  hatsUnowned: CosmeticProps[];
}

function HatSelection({ userIcon, setUserIcon, hatsOwned, hatsUnowned }: HatSelectionProps) {
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

export { HatSelection };
