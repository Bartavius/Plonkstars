"use client";

import Popup from "@/components/Popup";
import { CosmeticProps } from "@/types/cosmetics/CosmeticProps";
import { CosmeticTiers } from "@/types/CosmeticTiers";
import api from "@/utils/api";
import { useEffect, useState } from "react";

interface CrateProps {
  name: string;
  price: number;
  rarity: CosmeticTiers;
}

export default function Page() {
  const [message, _setMessage] = useState<React.ReactNode>();
  const [update, setUpdate] = useState<number>(0);
  const [type, setType] = useState("");
  const [cosmetic, setCosmetic] = useState<CosmeticProps | null>(null);

  const setMessage = (message: React.ReactNode) => {
    _setMessage(message);
    setUpdate((prev) => prev + 1);
  };

  const [coins, setCoins] = useState(0);
  useEffect(() => {
    const fetchCoins = async () => {
      const { data } = await api.get("/account/profile/coins");
      setCoins(parseInt(data.coins));
    };
    fetchCoins();
  }, []);

  const crates = [
    { name: "Common Crate", price: 100, rarity: CosmeticTiers.COMMON },
    { name: "Uncommon Crate", price: 250, rarity: CosmeticTiers.UNCOMMON },
    { name: "Rare Crate", price: 500, rarity: CosmeticTiers.RARE },
    { name: "Epic Crate", price: 1000, rarity: CosmeticTiers.EPIC },
    { name: "Legendary Crate", price: 2000, rarity: CosmeticTiers.LEGENDARY },
  ];

  // Map rarities to Tailwind color classes
  const rarityColors: Record<CosmeticTiers, string> = {
    COMMON: "bg-gray-300 text-gray-800",
    UNCOMMON: "bg-green-300 text-green-900",
    RARE: "bg-blue-400 text-blue-900",
    EPIC: "bg-purple-400 text-purple-900",
    LEGENDARY: "bg-yellow-400 text-yellow-900 font-bold",
  };

  const darkerRarityColors: Record<CosmeticTiers, string> = {
    COMMON: "bg-gray-500 text-gray-800",
    UNCOMMON: "bg-green-600 text-green-900",
    RARE: "bg-blue-600 text-blue-900",
    EPIC: "bg-purple-600 text-purple-900",
    LEGENDARY: "bg-yellow-600 text-yellow-900 font-bold",
  };

  const buyCrate = async (crate: CrateProps) => {
    try {
      const response = await api.post("/account/profile/buy", crate);
      setMessage(response.data.message || "Purchase successful!");
      setCosmetic(response.data.cosmetic);
      setType("success");
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        "Failed to purchase crate. Please try again.";
      setMessage(errorMsg);
      setType("error");
    }
  };

  return (
    <div>
      <div className="navbar-buffer" />
      <Popup update={update} type={type}>
        {message}
        {cosmetic && type == "success" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div
              className={`w-[50%] h-[60%] p-6 ${
                rarityColors[cosmetic.tier]
              } rounded-xl shadow-2xl text-center animate-reward-pop relative`}
            >
              <h2 className="text-2xl font-bold text-green-600 mb-4">
                🎉 Cosmetic Unlocked! 🎉
              </h2>
              <div className="w-full h-64 flex justify-center items-center">
                <div
                  className={`absolute w-48 h-48 rounded-full opacity-30 blur-xl z-0 animate-spin-slow ${darkerRarityColors[cosmetic.tier]}`}
                 
                />
                <img
                  src={`/cosmetics/${cosmetic.type}/${cosmetic.image}`}
                  alt={cosmetic.image.toString()}
                  className="max-h-full max-w-full object-contain"
                />
                
              </div>
              <p className="text-xl font-bold text-white">
                {cosmetic.item_name}
              </p>
              
            </div>
            
          </div>
        )}
      </Popup>

      <div className="max-w-xl mx-auto mt-8 font-sans text-gray-900">
        <div className="mb-6 text-center text-3xl font-bold">Shop</div>

        <div className="mb-8 text-center text-lg font-semibold text-gray-700">
          Coins: {coins}
        </div>

        <div className="flex flex-col gap-4">
          {crates.map((crate: CrateProps) => (
            <div
              key={crate.name}
              className={`flex justify-between items-center px-6 py-4 rounded-lg shadow cursor-pointer transform transition duration-150 hover:scale-105 hover:shadow-lg ${
                rarityColors[crate.rarity]
              }`}
              onClick={() => buyCrate(crate)}
            >
              <div className="text-lg font-semibold">{crate.name}</div>
              <div className="text-lg font-semibold">{crate.price} coins</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
