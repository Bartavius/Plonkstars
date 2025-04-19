"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import api from "@/utils/api";
import GamePanel from "@/components/game/GamePanel";
import "@/app/game.css";
import Loading from "@/components/loading";
import "./gameplay.css";

const CombinedMap = dynamic(() => import("@/components/maps/CombinedMap"), {
  ssr: false,
});

export default function MatchPage() {
  const [lat, setLat] = useState<number>();
  const [lng, setLng] = useState<number>();
  const [correctLat, setCorrectLat] = useState<number>(0);
  const [correctLng, setCorrectLng] = useState<number>(0);
  const [time, setTime] = useState<Date | null>(null);
  const [timeLimit, setTimeLimit] = useState<number>(0);
  const [roundNumber, setRoundNumber] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<number>(0);
  const [NMPZ, setNMPZ] = useState(false);
  const [mapBounds, setMapBounds] = useState<any>(null);

  const router = useRouter();
  const params = useParams();
  const matchId = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    const fetchLocation = async (id: string) => {
      setLoading(true);
      try {
        const response = await api.post(`/game/round?`,{id});
        const { lat, lng, round, time, time_limit, total, nmpz, map_bounds } = response.data;
        
        setRoundNumber(round);
        setCorrectLat(lat);
        setCorrectLng(lng);
        setTime(new Date(time));
        setTimeLimit(time_limit);
        setTotalScore(total);
        setNMPZ(nmpz);
        setMapBounds(map_bounds);
        setLoading(false);
      } catch (err: any) {
        if (err.response?.status == 404) {
          router.push("/game");
        }
        if (err.response?.data?.error == "No more rounds are available") {
          router.push(`/game/${id}/summary`);
        }
      }
    };
    if (matchId) {
      fetchLocation(matchId); //render loading screen later
    }
  }, [matchId]);

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const backToStart = () => {
    setReload((prev) => prev + 1);
  }

  const submitGuess = async () => {
    if (lat !== undefined && lng !== undefined && !submitted) {
      setSubmitted(true);
      try {
        await api.post("/game/guess", {
          lat: lat,
          lng: (((lng % 360) + 540) % 360) - 180,
          id: matchId,
        });
      } catch (err: any) {}
    } else {
      await sleep(1000);
    }
    router.push(`/game/${matchId}/result?round=${roundNumber}`);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (lat !== undefined && lng !== undefined && event.code === "Space") {
        event.preventDefault();
        submitGuess();
      }
      if(event.code === "KeyR"){
        setReload((prev) => prev + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lat,lng]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div color="bg-dark">
      <GamePanel
        time={time}
        timeLimit={timeLimit}
        timeoutFunction={submitGuess}
        totalScore={totalScore}
        roundNumber={roundNumber}
      />
      <div className="relative min-h-[90vh] min-w-full">
        <CombinedMap
          setLat={setLat}
          setLng={setLng}
          lat={correctLat}
          lng={correctLng}
          reload={reload}
          NMPZ={NMPZ}
          mapBounds={mapBounds}
        />
      </div>
      <div className="game-footer">
        <div className="footer-grid">
          <div className="footer-grid-left-elements">
            {!NMPZ &&
              <button className="back-to-start-button dark-hover-button" onClick={backToStart}>
                Back To Start
              </button>
            }
          </div>
          <div className="footer-grid-center-elements"></div>
          <div className="footer-grid-right-elements">
            <button
              onClick={submitGuess}
              disabled={
                lat !== undefined && lng !== undefined && !submitted
                  ? false
                  : true
              }
              className="game-button"
            >
              <b className="block">Submit</b>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}