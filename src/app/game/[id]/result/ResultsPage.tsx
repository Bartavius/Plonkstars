"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import api from "@/utils/api";
import "@/app/game.css";
import GamePanel from "@/components/game/GamePanel";
import Loading from "@/components/loading";

const BasicMapResult = dynamic(
  () => import("@/components/maps/BasicMapResult"),
  { ssr: false }
);

interface Guess{
  user:string;
  score:number;
  total_score:number;
  distance:number | null;
  time:number | null;
  lat:number | null;
  lng:number | null;
}

interface Location{
  lat:number;
  lng:number;
}

export default function Results() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const matchId = params.id;
  const roundNumber = parseInt(searchParams.get("round") || "-1");

  if (roundNumber === -1) {
    return <div>Invalid round number</div>;
  }

  const [top,setTop] = useState<Guess[]>([]);
  const [user,setUser] = useState<Guess>();
  const [correct,setCorrect] = useState<Location>();
  const [error, setError] = useState<string | undefined>(undefined);

  const nextGame = () => {
    router.push(`/game/${matchId}`);
  };

  useEffect(() => {
    const getResults = async () => {
      try {
        const response = await api.get(
          `/game/results?id=${matchId}&round=${roundNumber}`
        );
        const {
          this_user,
          top,
          correct
        } = response.data;
        setUser(this_user);
        setTop(top);
        setCorrect(correct);
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

  if (!user || !correct) {
    return <Loading />;
  }

  const getUserMap = () => {
    if(!top || !user){
      return [{ lat:0, lng: 0 }];
    }
    let userIn = false;
    let copy = [...top];
    for (let i = 0; i < copy.length; i++) {
      if (copy[i].user === user.user) {
        userIn = true;
        break;
      }
    }
    if (!userIn) {
      copy.push(user);
    }
    return copy;
  }

  const distanceString = (distance:number|null) => {
    const m = distance === null ? -1 : distance * 1000;
    const km = Math.round(m / 10) / 100;
    const userDistance = km > 1 ? km : m;
    const units = km > 1 ? "km" : "m";
    return {userDistance,units};
  }

  const userDistance = distanceString(user.distance);
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="relative">
      <GamePanel
        time={null}
        timeLimit={null}
        timeoutFunction={null}
        totalScore={user.total_score}
        roundNumber={roundNumber}
      />
      <div className="map-result-container min-h-[90vh] min-w-full">
        <div>
          <BasicMapResult
            markers={[{
              users: getUserMap(),
              correct: correct
            }]}
          />
        </div>
      </div>
      <div className="game-footer w-full">
        <div className="grid grid-cols-3 gap-4 w-full">
          <div className="flex justify-end items-center">
            <div className="text-center">
              <div>
                <b className="text-2xl">{user.score}</b>
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
            {user.distance !== undefined && (
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
            {user.distance === undefined && (
              <b className="text-2xl">Timed Out</b>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
