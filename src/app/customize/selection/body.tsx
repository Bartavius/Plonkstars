import NoBody from "@/components/cosmetics/body/NoBody";
import Shirt from "@/components/cosmetics/body/PurpleShirt";
import CosmeticScrollBox from "@/components/cosmetics/CosmeticBox";
import { CosmeticTiers } from "@/types/CosmeticTiers";
import { UserIconCosmetics } from "@/types/userIconCosmetics";

export default function BodySelection({
  userIcon,
  setUserIcon,
}: {
  userIcon: UserIconCosmetics;
  setUserIcon: (icon: UserIconCosmetics) => void;
}) {
  const handleBodyClick = (body: string) => {
    setUserIcon({ ...userIcon, body });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <CosmeticScrollBox
        cosmetics={bodies}
        selected={userIcon.body ?? "no_body"}
        onClick={(name) => handleBodyClick(name)}
      />
    </div>
  );
}

const bodies = [
    { name: "no_shirt", tier: CosmeticTiers.COMMON, html: <NoBody /> },
    { name: "purple_shirt", tier: CosmeticTiers.COMMON, html: <Shirt /> },
  ];