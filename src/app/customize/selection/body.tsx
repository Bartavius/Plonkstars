import { UserIconCosmetics } from "@/types/userIconCosmetics";
import CosmeticScrollBox from "@/components/cosmetics/CosmeticBox";
import { bodies } from "../cosmetic_lists/bodies";

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