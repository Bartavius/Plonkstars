import React from "react";
import CosmeticDisplayBox from "./CosmeticDisplayBox";
import { CosmeticItem } from "@/types/CosmeticItem";

type CosmeticScrollBoxProps = {
  cosmetics: CosmeticItem[];
  selected: string;
  onClick?: (name: string) => void;
};

export default function CosmeticScrollBox({
  cosmetics,
  selected,
  onClick,

}: CosmeticScrollBoxProps) {
  return (
    <div className="w-64 h-80 border border-gray-300 rounded-lg overflow-y-scroll p-2 bg-white shadow-inner">
      <div className="grid grid-cols-2 gap-2">
        {cosmetics.map((cosmetic, index) => (
          <CosmeticDisplayBox
            key={index}
            tier={cosmetic.tier}
            onClick={() => onClick?.(cosmetic.name)}
            className={`aspect-square ${cosmetic.name === selected ? "border-2 border-red-500" : ""}`}
          >
            {cosmetic.html}
          </CosmeticDisplayBox>
        ))}
      </div>
    </div>
  );
}
