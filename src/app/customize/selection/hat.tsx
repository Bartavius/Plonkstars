import CosmeticScrollBox from "@/components/cosmetics/CosmeticBox";
import { UserIconCosmetics } from "@/types/userIconCosmetics";
import { hats } from "../cosmetic_lists/hats";

export default function HatSelection({
  userIcon,
  setUserIcon,
}: {
  userIcon: UserIconCosmetics;
  setUserIcon: (icon: UserIconCosmetics) => void;
}) {
  const handleHatClick = (hat: string) => {
    setUserIcon({ ...userIcon, hat });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <CosmeticScrollBox
        cosmetics={hats}
        selected={userIcon.hat ?? "no_hat"}
        onClick={(name) => handleHatClick(name)}
      />
    </div>
  );
}