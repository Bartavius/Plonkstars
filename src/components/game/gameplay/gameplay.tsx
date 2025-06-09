"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import api from "@/utils/api";
import GamePanel from "@/components/game/GamePanel";
import "@/app/game.css";
import "./gameplay.css";

const CombinedMap = dynamic(() => import("@/components/maps/CombinedMap"), {
  ssr: false,
});

export default function GamePlay({
    correctLat,
    correctLng,
    time,
    timeLimit,
    roundNumber,
    totalScore,
    NMPZ,
    mapBounds,
    canGuess = true,
    userLat,
    userLng,
    onTimeout,
    afterTimeoutFunction,
    onGuess,
    rightFooter,
    onPlonk,
}: {
    correctLat: number;
    correctLng: number;
    time?: Date;
    timeLimit?: number;
    roundNumber: number;
    totalScore: number;
    NMPZ: boolean;
    mapBounds: any;
    userLat?: number;
    userLng?: number;
    canGuess?: boolean;
    onTimeout?: () => void;
    onGuess?: () => void;
    afterTimeoutFunction?: () => void;
    rightFooter?: React.ReactNode;
    onPlonk?: (lat:number,lng:number) => void;
}) {
  const [lat, setLat] = useState<number|undefined>(userLat);
  const [lng, setLng] = useState<number|undefined>(userLng);
  const [submitted, setSubmitted] = useState<boolean>(!canGuess);
  const [reload, setReload] = useState<number>(0);

  const params = useParams();
  const matchId = Array.isArray(params.id) ? params.id[0] : params.id;

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
      onGuess && onGuess();
    } else {
      onTimeout && onTimeout();
    }
  };

  function setPos(lat: number, lng: number) {
    if (canGuess) {
      setLat(lat);
      setLng(lng);
      onPlonk && onPlonk(lat,lng);
    }
  }

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

  return (
    <div color="bg-dark">
      <GamePanel
        time={time}
        timeLimit={timeLimit}
        afterTimeoutFunction={afterTimeoutFunction}
        totalScore={totalScore}
        roundNumber={roundNumber}
      />
      <div className="relative min-h-[90vh] min-w-full">
        <CombinedMap
          lat={lat}
          lng={lng}
          canChange={!submitted}
          setPos={setPos}
          correctLat={correctLat}
          correctLng={correctLng}
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
            {rightFooter? rightFooter:
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
            }
          </div>
        </div>
      </div>
    </div>
  );
}