import React from "react";
import CosmeticDisplayBox from "./CosmeticsDisplayBox";
import { CosmeticProps } from "@/types/cosmetics/CosmeticProps";
import { CosmeticTiers } from "@/types/CosmeticTiers";

type CosmeticScrollBoxProps = {
  cosmeticsOwned: CosmeticProps[];
  cosmeticsUnowned: CosmeticProps[];
  selected: string | null;
  onClick?: (cosmetic: CosmeticProps | null) => void;
};

export default function CosmeticScrollBox({
  cosmeticsOwned,
  cosmeticsUnowned,
  selected,
  onClick,
}: CosmeticScrollBoxProps) {
  return (
    <div className="overflow-y-scroll p-2 bg-red shadow-inner w-full">
      <div className="grid grid-cols-2 grid-rows-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 w-full">
        <CosmeticDisplayBox
            tier={CosmeticTiers.COMMON}
            onClick={() => onClick?.(null)}
            className={`aspect-square w-20 h-20 ${
              null === selected
                ? "outline outline-4 outline-white"
                : ""
            }`}
          ><div></div>
          </CosmeticDisplayBox>
        {cosmeticsOwned.map((cosmetic, index) => (
          <CosmeticDisplayBox
            key={index}
            tier={cosmetic.tier}
            onClick={() => onClick?.(cosmetic)}
            className={`aspect-square w-20 h-20 ${
              cosmetic.image === selected
                ? "outline outline-4 outline-white"
                : ""
            }`}
          >
            <img
              src={`cosmetics/${cosmetic.type.toUpperCase()}/${cosmetic.image}`}
              alt={cosmetic.item_name.toString()}
            />
          </CosmeticDisplayBox>
        ))}
        {cosmeticsUnowned.map((cosmetic, index) => (
          <CosmeticDisplayBox
            key={index}
            tier={cosmetic.tier}
            onClick={() => onClick?.(cosmetic)}
            className={`aspect-square w-20 h-20 ${
              cosmetic.image === selected
                ? "outline outline-4 outline-white"
                : ""
            }`}
            locked={true}
          >
            <img
              className="w-full pixelated"
              src={`cosmetics/${cosmetic.type}/${cosmetic.image}`}
              alt={cosmetic.item_name.toString()}
            />
          </CosmeticDisplayBox>
        ))}
      </div>
    </div>
  );
}