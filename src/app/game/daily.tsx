import Loading from "@/components/loading";
import api from "@/utils/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DailyTimer from "./DailyTimer";

export default function Daily({
    loading,
    setLoading
}:{
    loading:boolean
    setLoading: (loading:boolean) => void
}) {
    const [daily, setDaily] = useState<any>()
    const router = useRouter();

    async function fetchDaily() {
        const daily = await api.get(`/session/daily`);
        setDaily(daily.data);
      }
    
      useEffect(() => {
        fetchDaily();
      },[]);
    
      async function playDaily() {
        if (!daily) return;
        setLoading(true);
        router.push(`/game/${daily.id}/join`);
      }

    return (
        <div className="w-full px-4 relative">
            <h2 className="text-xl font-semibold mb-2 text-center">
            Daily Challenge
            </h2>
            { daily ? 
            <>
            <div className="text-center mb-2 text-lg font-semibold text-white"><DailyTimer time={daily.next} onFinish={fetchDaily}/></div>
            <label
                className="block mb-2 text-white"
                htmlFor="map-search-bar"
            >
                Map Name
            </label>
            <button
                className={`bg-dark w-full py-2 rounded-lg font-semibold mb-4 dark-hover-button ${
                loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
                onClick={() => router.push(`/map/${daily.map.id}`)}
            >
                {daily.map.name}
            </button>
            
            <div className="block mb-6 text-white font-semibold">
                No. of Rounds: {daily.rules.rounds}
            </div>
            <div className="block mb-6 text-white font-semibold">
                Time Limit:{" "}
                {daily.rules.time == -1 ? "Infinite" : `${daily.rules.time}s`}
            </div>          
            <div
                className="mb-4"
                title="No moving, No panning, No zooming"
            >
                <b>NMPZ: {daily.rules.NMPZ ? "Yes": "No"}</b>
            </div>
            <button
                disabled={loading}
                className={`${daily.finished ? "bg-yellow":"game-setup-btn"} w-full py-2 rounded-lg font-semibold dark-hover-button ${
                loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={playDaily}
            >
                {daily.finished?"Leaderboard":daily.playing?"Continue":"Play"}
            </button>
            </>:<div className="w-full h-full flex justify-center items-center">Loading...</div>
            }
        </div>
    )
}