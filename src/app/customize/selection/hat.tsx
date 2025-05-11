import { UserIconCosmetics } from "@/types/userIconCosmetics";

export default function HatSelection({
  userIcon,
  setUserIcon,
}: {
  userIcon: UserIconCosmetics;
  setUserIcon: (icon: UserIconCosmetics) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="w-1/2 h-1/2 bg-gray-200 rounded-lg shadow-lg text-black">
          {/* Hat component goes here */}
          hat stuff
        </div>
      </div>
    </div>
  );
}
