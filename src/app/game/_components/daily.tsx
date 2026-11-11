import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { LoginTooltipWrapper } from "@/features/auth/components/login-tooltip-wrapper";
import { isDemo } from "@/features/auth/services/session";
import { calculateOffset } from "@/lib/clock-offset";
import { api } from "@/services/api";

import { DailyTimer } from "./daily-timer";
import type { DailyChallenge } from "../_types/daily-challenge";
interface DailyProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

function Daily({ loading, setLoading }: DailyProps) {
  const demo = isDemo();
  const [daily, setDaily] = useState<DailyChallenge>();
  const [offset, setOffset] = useState<number | undefined>(undefined);
  const router = useRouter();

  async function fetchDaily() {
    const daily = await api.get<DailyChallenge>(`/session/daily`);
    setDaily(daily.data);
    return daily;
  }

  useEffect(() => {
    async function fetchData() {
      const offset = await calculateOffset(fetchDaily);
      setOffset(offset);
    }
    fetchData();
  }, []);

  async function playDaily() {
    if (!daily) {
      return;
    }
    if (demo) {
      alert("Demo users cannot play the daily challenge.");
      return;
    }
    setLoading(true);
    router.push(`/game/${daily.id}/join`);
  }

  return (
    <div className="w-full px-4 relative">
      <h2 className="text-xl font-semibold mb-2 text-center">Daily Challenge</h2>
      {daily && offset != undefined ? (
        <>
          <div className="text-center mb-2 text-lg font-semibold text-white">
            <DailyTimer time={daily.next} onFinish={fetchDaily} offset={offset} />
          </div>
          <div className="block mb-2 text-white">Map Name</div>
          <button
            className="bg-dark w-full py-2 rounded-lg font-semibold mb-4 dark-hover-button"
            disabled={loading}
            onClick={() => router.push(`/map/${daily.map.id}`)}
          >
            {daily.map.name}
          </button>

          <div className="block mb-6 text-white font-semibold">
            No. of Rounds: {daily.rules.rounds}
          </div>
          <div className="block mb-6 text-white font-semibold">
            Time Limit: {daily.rules.time == -1 ? "Infinite" : `${daily.rules.time}s`}
          </div>
          <div className="mb-4" title="No moving, No panning, No zooming">
            <b>NMPZ: {daily.rules.NMPZ ? "Yes" : "No"}</b>
          </div>
          <LoginTooltipWrapper
            message="Login to play the daily challenge"
            demo={demo}
            className="w-full"
          >
            <button
              disabled={loading || demo}
              className={`${daily.state == "FINISHED" ? "bg-yellow" : "game-setup-btn bg-plonk-stars-red text-plonk-stars-white hover:[filter:brightness(90%)]"} w-full py-2 rounded-lg font-semibold dark-hover-button`}
              onClick={playDaily}
            >
              {daily.state == "FINISHED"
                ? "Leaderboard"
                : daily.state == "GUESSING"
                  ? "Continue"
                  : "Play"}
            </button>
          </LoginTooltipWrapper>
        </>
      ) : (
        <div className="w-full h-full flex justify-center items-center">Loading...</div>
      )}
    </div>
  );
}

export { Daily };
