import { CosmeticTiers } from "@/types/CosmeticTiers";
import React from "react";

type CosmeticDisplayBoxProps = {
  children: React.ReactNode;
  tier: CosmeticTiers;
  className?: string;
  onClick?: () => void;
};

const tierStyles = {
  [CosmeticTiers.COMMON]: {
    colorClass: "bg-gray-500 hover:bg-gray-600 active:bg-gray-700",
    shadowClass: "shadow-[0_0_20px_#ffffffcc]", // white glow
  },
  [CosmeticTiers.UNCOMMON]: {
    colorClass: "bg-green-500 hover:bg-green-600 active:bg-green-700",
    shadowClass: "shadow-[0_0_20px_#22c55eff]", // green glow
  },
  [CosmeticTiers.RARE]: {
    colorClass: "bg-blue-500 hover:bg-blue-600 active:bg-blue-700",
    shadowClass: "shadow-[0_0_20px_#3b82f6ff]", // blue glow
  },
  [CosmeticTiers.EPIC]: {
    colorClass: "bg-purple-500 hover:bg-purple-600 active:bg-purple-700",
    shadowClass: "shadow-[0_0_25px_#a855f7ff]", // purple glow
  },
  [CosmeticTiers.LEGENDARY]: {
    colorClass: "bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700",
    shadowClass: "shadow-[0_0_30px_#eab308ff]", // yellow glow
  },
};

export default function CosmeticDisplayBox({
  children,
  tier,
  className = "",
  onClick,
}: CosmeticDisplayBoxProps) {
  const { colorClass, shadowClass } = tierStyles[tier] || tierStyles[CosmeticTiers.COMMON];

  return (
    <div
      className={`flex items-center justify-center w-full h-full ${colorClass} ${shadowClass} cursor-pointer ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
