"use client";

import Loading from "@/components/loading";
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
  const [crates, setCrates] = useState<Crate[]>();

  const setMessage = (message: React.ReactNode) => {
    _setMessage(message);
    setUpdate((prev) => prev + 1);
  };

  const [coins, setCoins] = useState(0);
  useEffect(() => {
    const fetchCoins = async () => {
      const { data } = await api.get("/account/coins");
      setCoins(data.coins);
    };
    fetchCoins();
  }, [response]);

  const buyCrate = async (name: string) => {
    try {
      const response = await api.post("/cosmetics/crates/buy", {crate:name});
      setCoins(response.data.coins);
      setResponse(response.data);
      setType("success");
      setUpdate((prev) => prev + 1);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        "Failed to purchase crate. Please try again.";
      setMessage(errorMsg);
      setType("error");
    }
  };

  useEffect(() => {
    async function fetchCrates() {
      const response = await api.get("/cosmetics/crates/shop");
      setCrates(response.data);
    }
    fetchCrates();
  },[]);

  if (!crates) return <Loading />;

  return (
    <div>
      <div className="navbar-buffer" />
      <Popup update={update} type={type === "success" ? undefined: type}>
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
                rarityColors[response.cosmetic?.tier ?? response.tier ?? "COMMON"]
              } rounded-xl shadow-2xl text-center animate-reward-pop relative`}
            >
              <h2 className="text-2xl font-bold mb-4">
                {response.refund === undefined && response.cosmetic === undefined && "You got nothing! womp womp"}
                {response.refund !== undefined? `You've unlocked a duplicate ${response.cosmetic? response.cosmetic.item_name:`${response.tier} cosmetic`}` 
                :
                response.cosmetic && `${response.cosmetic.tier} Cosmetic Unlocked!`}
                {response.tier === 'COINS' && `You've won...`}
              </h2>
              <div className="w-full h-64 flex justify-center items-center">
                {response.cosmetic && response.refund != undefined ?
                <img
                  src={`/cosmetics/${response.cosmetic.type}/${response.cosmetic.image}`}
                  alt={response.cosmetic.image.toString()}
                  className="max-h-full max-w-full object-contain"
                /> :
                response.refund && <img src="/cosmetics/coin.png" alt="coin" className="max-h-full max-w-full object-contain"/>
                }
              </div>
              <p className="text-4xl font-bold text-black mt-5">
                {response.cosmetic ? response.cosmetic.item_name : response.refund && `${response.refund} coins`}
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
              onClick={() => buyCrate(crate.name)}
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
    cosmetic: CosmeticProps | undefined;
    refund: number | undefined;
    tier: CosmeticTiers | 'COINS' | undefined;
    message: string | undefined;
}

// TODO: restructure so that each tier now has percentages on waht can spawn
interface Crate {
    name: string; // will need image name later
    price: number;
    items: CrateItems[];
  }

interface CrateItems {
  tier: CosmeticTiers;
  weight: number;
}

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