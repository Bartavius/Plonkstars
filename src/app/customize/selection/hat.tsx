import CosmeticScrollBox from "@/components/cosmetics/CosmeticBox";
import Fedora from "@/components/cosmetics/hats/fedora";
import NoHat from "@/components/cosmetics/hats/NoHat";
import { CosmeticTiers } from "@/types/CosmeticTiers";
import { UserIconCosmetics } from "@/types/userIconCosmetics";

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

const hats = [
    { name: "no_hat", tier: CosmeticTiers.COMMON, html: <NoHat /> },
    { name: "fedora", tier: CosmeticTiers.EPIC, html: <Fedora /> },
  ];