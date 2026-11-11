import { UserIconCosmetics } from "@/features/cosmetics/types/user-icon-cosmetics";
import CosmeticScrollBox from "@/features/cosmetics/components/cosmetics-box";
import { CosmeticProps } from "@/features/cosmetics/types/cosmetic-props";

export default function BodySelection({
  userIcon,
  setUserIcon,
  bodiesOwned,
  bodiesUnowned,
}: {
  userIcon: UserIconCosmetics;
  setUserIcon: (icon: UserIconCosmetics) => void;
  bodiesOwned: CosmeticProps[];
  bodiesUnowned: CosmeticProps[];
}) {
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