import { CosmeticTiers } from "@/types/CosmeticTiers";
import React from "react";
import { IoIosLock } from "react-icons/io";
import { tierStyles } from "@/types/cosmetics/TierStyles";

type CosmeticDisplayBoxProps = {
  children: React.ReactNode;
  tier: CosmeticTiers;
  className?: string;
  onClick?: () => void;
  locked?: boolean;
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