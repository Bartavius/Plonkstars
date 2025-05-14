import { CosmeticTiers } from "@/types/CosmeticTiers";
import React from "react";
import { IoIosLock } from "react-icons/io";

type CosmeticDisplayBoxProps = {
  children: React.ReactNode;
  tier: CosmeticTiers;
  className?: string;
  onClick?: () => void;
  locked?: boolean;
};

const tierStyles = {
  [CosmeticTiers.COMMON]: {
    colorClass: "bg-gray-500 hover:bg-gray-600 active:bg-gray-700",
    shadowClass: "shadow-[0_0_20px_#ffffffcc]",
  },
  [CosmeticTiers.UNCOMMON]: {
    colorClass: "bg-green-500 hover:bg-green-600 active:bg-green-700",
    shadowClass: "shadow-[0_0_20px_#22c55eff]",
  },
  [CosmeticTiers.RARE]: {
    colorClass: "bg-blue-500 hover:bg-blue-600 active:bg-blue-700",
    shadowClass: "shadow-[0_0_20px_#3b82f6ff]",
  },
  [CosmeticTiers.EPIC]: {
    colorClass: "bg-purple-500 hover:bg-purple-600 active:bg-purple-700",
    shadowClass: "shadow-[0_0_25px_#a855f7ff]",
  },
  [CosmeticTiers.LEGENDARY]: {
    colorClass: "bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700",
    shadowClass: "shadow-[0_0_30px_#eab308ff]",
  },
};

export default function CosmeticDisplayBox({
  children,
  tier,
  className = "",
  onClick,
  locked = false,
}: CosmeticDisplayBoxProps) {
  const { colorClass, shadowClass } = tierStyles[tier] || tierStyles[CosmeticTiers.COMMON];

  return (
    <div
      className={`relative flex items-center justify-center w-full h-full ${colorClass} ${shadowClass} cursor-pointer ${className}`}
      onClick={onClick}
    >
      {children}
      {locked && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <IoIosLock className="w-6 h-6 text-white" />
        </div>
      )}
    </div>
  );
}
