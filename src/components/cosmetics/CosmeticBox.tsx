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
    <div className="overflow-y-scroll p-2 bg-red shadow-inner">
      <div className="grid grid-cols-2 grid-rows-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {cosmetics.map((cosmetic, index) => (
          <CosmeticDisplayBox
            key={index}
            tier={cosmetic.tier}
            onClick={() => onClick?.(cosmetic.name)}
            className={`aspect-square w-20 h-20 ${
              cosmetic.name === selected
                ? "outline outline-4 outline-white"
                : ""
            }`}
          >
            {cosmetic.html}
          </CosmeticDisplayBox>
        ))}
      </div>
    </div>
  );
}
