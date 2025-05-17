"use client";

import Popup from "@/components/Popup";
import { CosmeticProps } from "@/types/cosmetics/CosmeticProps";
import { CosmeticTiers } from "@/types/CosmeticTiers";
import api from "@/utils/api";
import { useEffect, useState } from "react";

export default function Page() {
  const [message, _setMessage] = useState<React.ReactNode>();
  const [update, setUpdate] = useState<number>(0);
  const [type, setType] = useState("");
  const [response, setResponse] = useState<Response | null>(null);

  const setMessage = (message: React.ReactNode) => {
    _setMessage(message);
    setUpdate((prev) => prev + 1);
  };

  const [coins, setCoins] = useState(0);
  useEffect(() => {
    const fetchCoins = async () => {
      const { data } = await api.get("/account/coins");
      setCoins(parseInt(data.coins));
    };
    fetchCoins();
  }, [response]);

  const buyCrate = async (crate: Crate) => {
    try {
      const response = await api.post("/cosmetics/crates/buy", crate);
      setMessage(response.data.message || "Purchase successful!");
      setResponse(response.data);
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

    {/* //     "cosmetic": reward.to_json() if hasattr(reward, 'to_json') else None,
    //     "coins": reward if isinstance(reward, int) else None,
    //     "duplicate": duplicate,
    //     "tier": result_tier,
    //     "message": f"{crate_name.capitalize()} Crate purchased successfully!"
    //  */}


        {response && type == "success" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div
              className={`w-[50%] h-[60%] p-6 ${
                rarityColors[response.tier]
              } rounded-xl shadow-2xl text-center animate-reward-pop relative`}
            >
              <h2 className="text-2xl font-bold mb-4">
                {response.duplicate && `You've unlocked a duplicate ${response.tier} cosmetic. Instead, you'll be awarded with...` }
                {response.cosmetic && `${response.cosmetic.tier} Cosmetic Unlocked!`}
                {response.tier === 'COINS' && `You've won...`}
              </h2>
              <div className="w-full h-64 flex justify-center items-center">
                {response.cosmetic ?
                <img
                  src={`/cosmetics/${response.cosmetic.type}/${response.cosmetic.image}`}
                  alt={response.cosmetic.image.toString()}
                  className="max-h-full max-w-full object-contain"
                /> :
                <img src="/cosmetics/coin.png" alt="coin" className="max-h-full max-w-full object-contain"/>
                
                
}
              </div>
              <p className="text-4xl font-bold text-black mt-5">
                {response.cosmetic ? response.cosmetic.item_name : `${response.coins} coins`}
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
          {crates.map((crate: Crate) => (
            <div
              key={crate.name}
              className={`flex justify-between items-center px-6 py-4 rounded-lg shadow cursor-pointer transform transition duration-150 hover:scale-105 hover:shadow-lg`}
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

interface Response {
    cosmetic: CosmeticProps | null;
    coins: number | null;
    duplicate: boolean;
    tier: CosmeticTiers | 'COINS';
    message: string;
}

// TODO: restructure so that each tier now has percentages on waht can spawn
interface Crate {
    name: string; // will need image name later
    price: number;
    percentages: Percentages;
    coinsMin: number;
    coinsMax: number;
  }

  interface Percentages {
    COINS: number;
    COMMON: number;
    UNCOMMON: number;
    RARE: number;
    EPIC: number;
    LEGENDARY: number;
  }

  const crates: Crate[] = [
    {
      name: "Wooden Crate",
      price: 20,
      percentages: {
        COINS: 0.4,
        COMMON: 0.58889,
        UNCOMMON: 0.01,
        RARE: 0.001,
        EPIC: 0.0001,
        LEGENDARY: 0.00001,
      },
      coinsMin: 0,
      coinsMax: 0,
    },
    {
      name: "Bronze Crate",
      price: 500,
      percentages: {
        COINS: 0.1,
        COMMON: 0.6,
        UNCOMMON: 0.2,
        RARE: 0.08,
        EPIC: 0.015,
        LEGENDARY: 0.005,
      },
      coinsMin: 100,
      coinsMax: 500,
    },
    {
      name: "Silver Crate",
      price: 1000,
      percentages: {
        COINS: 0.15,
        COMMON: 0.35,
        UNCOMMON: 0.25,
        RARE: 0.15,
        EPIC: 0.07,
        LEGENDARY: 0.03,
      },
      coinsMin: 250,
      coinsMax: 800,
    },
    {
      name: "Gold Crate",
      price: 2000,
      percentages: {
        COINS: 0.2,
        COMMON: 0.1,
        UNCOMMON: 0.2,
        RARE: 0.25,
        EPIC: 0.15,
        LEGENDARY: 0.1,
      },
      coinsMin: 500,
      coinsMax: 1500,
    },
  ];


  // Map rarities to Tailwind color classes
  const rarityColors: Record<CosmeticTiers | 'COINS', string> = {
    COINS: "bg-orange-300 text-orange-900",
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