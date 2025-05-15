import { CosmeticTiers } from "../CosmeticTiers";

export const tierStyles =  {
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