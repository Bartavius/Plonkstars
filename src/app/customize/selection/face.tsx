import { UserIconCosmetics } from "@/types/userIconCosmetics";

export default function FaceSelection({
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
          {/* Face component goes here */}
          face stuff
        </div>
      </div>
    </div>
  );
}
