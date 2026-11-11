import { CosmeticScrollBox } from "@/features/cosmetics/components/cosmetics-box";
import type { CosmeticProps } from "@/features/cosmetics/types/cosmetic-props";
import type { UserIconCosmetics } from "@/features/cosmetics/types/user-icon-cosmetics";
interface BodySelectionProps {
  userIcon: UserIconCosmetics;
  setUserIcon: (icon: UserIconCosmetics) => void;
  bodiesOwned: CosmeticProps[];
  bodiesUnowned: CosmeticProps[];
}

function BodySelection({ userIcon, setUserIcon, bodiesOwned, bodiesUnowned }: BodySelectionProps) {
  const handleBodyClick = (body: CosmeticProps | null) => {
    setUserIcon({ ...userIcon, body });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <CosmeticScrollBox
        cosmeticsOwned={bodiesOwned}
        cosmeticsUnowned={bodiesUnowned}
        selected={userIcon.body?.image ? userIcon.body.image.toString() : null}
        onClick={(body) => handleBodyClick(body)}
      />
    </div>
  );
}

export { BodySelection };
