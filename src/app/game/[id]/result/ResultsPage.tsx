"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import api from "@/utils/api";
import "@/app/game.css";
import GamePanel from "@/components/game/GamePanel";
import Loading from "@/components/loading";
import ScoreAccordion from "./ScoreAccordian";
import { FaMedal } from "react-icons/fa";

const BasicMapResult = dynamic(
  () => import("@/components/maps/BasicMapResult"),
  { ssr: false }
);

export default function Results() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const matchId = params.id;
  const roundNumber = parseInt(searchParams.get("round") || "-1");

  if (roundNumber === -1) {
    return <div>Invalid round number</div>;
  }

  const [data,setData] = useState<any>();
  const [error, setError] = useState<string | undefined>(undefined);
  const [open, setOpen] = useState(false);

  const nextGame = () => {
    router.push(`/game/${matchId}`);
  };

  useEffect(() => {
    const getResults = async () => {
      try {
        const response = await api.get(
          `/game/results?id=${matchId}&round=${roundNumber}`
        );
        setData(response.data)
      } catch (err: any) {
        setError(err.response?.data?.error || "Error getting results");
      }
    };

    getResults();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        nextGame();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!data) {
    return <Loading />;
  }
  const thisUser = data.users.find((user:any) => user.user.username === data.this_user.username);

  const distanceString = (distance:number) => {
    const m = distance === undefined ? -1 : Math.round(distance * 1000);
    const km = Math.round(m / 10) / 100;
    const userDistance = km > 1 ? km : m;
    const units = km > 1 ? "km" : "m";
    return {userDistance,units};
  }

  const userDistance = thisUser.guess.distance? distanceString(thisUser.guess.distance): undefined;
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="relative">
      <GamePanel
        time={null}
        timeLimit={null}
        timeoutFunction={null}
        totalScore={thisUser.score}
        roundNumber={roundNumber}
      />
      <div className="map-result-container min-h-[90vh] min-w-full">
        <div>
          <BasicMapResult
            markers={[{
              users: data.users.map((user: any) => ({ ...user.guess, user: user.user })),
              correct: data.correct
            }]}
            user={data.this_user}
          />
        </div>
      </div>
      <div className="game-footer w-full">
        <div className="grid grid-cols-3 gap-4 w-full">
          <div className="flex justify-between items-center">
            <ScoreAccordion open={open} guesses={data.users} className="absolute" user={data.this_user}/>
            <button className="accordion-toggle" onClick={() => setOpen(!open)}>
              <FaMedal/>{open ? 'Hide' : 'Show'} Scores
            </button>
            <div className="text-center">
              <div>
                <b className="text-2xl">{thisUser.guess.score}</b>
              </div>
              <div className="text-red font-bold">
                <b>SCORE</b>
              </div>
            </div>
          </div>
          <div className="game-footer-element w-full">
            <button
              onClick={nextGame}
              style={{ zIndex: 10000 }}
              className="game-button"
            >
              <b>Next Round</b>
            </button>
          </div>
          <div className="flex justify-left items-center">
            {userDistance !== undefined && (
              <div>
                <div className="text-center inline">
                  <div>
                    <b className="text-2xl">{userDistance.userDistance} {userDistance.units}</b>
                  </div>
                  <div className="text-red font-bold">
                    <b>DISTANCE</b>
                  </div>
                </div>
              </div>
            )}
            {thisUser.guess.distance === undefined && (
              <b className="text-2xl">Timed Out</b>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
