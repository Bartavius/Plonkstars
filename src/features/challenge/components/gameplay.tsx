"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { GamePanel } from "@/features/game/components/game-panel";
import "@/app/game.css";
import { BasicMapWithMarker } from "@/features/maps/components/basic-map-with-marker";
import { api } from "@/services/api";
import type { UserIconCosmetics } from "@/features/cosmetics/types/user-icon-cosmetics";
import type { MapBounds } from "@/features/maps/types/map-bounds";

const CombinedMap = dynamic(
  () => import("@/features/maps/components/combined-map").then((m) => m.CombinedMap),
  {
    ssr: false,
  },
);
interface GamePlayProps {
  correctLat: number;
  correctLng: number;
  time?: Date;
  timeLimit?: number;
  roundNumber: number;
  totalScore: number;
  NMPZ: boolean;
  mapBounds: MapBounds;
  cosmetics?: UserIconCosmetics;
  userLat?: number;
  userLng?: number;
  canGuess?: boolean;
  onTimeout?: () => void;
  onGuess?: () => void;
  rightFooter?: React.ReactNode;
  onPlonk?: (lat: number, lng: number) => void;
  offset?: number;
}

function GamePlay({
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
  onGuess,
  rightFooter,
  onPlonk,
  offset = 0,
  cosmetics,
}: GamePlayProps) {
  const [lat, setLat] = useState<number | undefined>(userLat);
  const [lng, setLng] = useState<number | undefined>(userLng);
  const [submitted, setSubmitted] = useState<boolean>(!canGuess);
  const [reload, setReload] = useState<number>(0);

  const params = useParams();
  const matchId = Array.isArray(params.id) ? params.id[0] : params.id;

  function backToStart() {
    setReload((prev) => prev + 1);
  }

  async function submitGuess() {
    if (lat !== undefined && lng !== undefined && !submitted) {
      setSubmitted(true);
      try {
        await api.post("/game/guess", {
          lat: lat,
          lng: (((lng % 360) + 540) % 360) - 180,
          id: matchId,
        });
      } catch (err) {}
      onGuess && onGuess();
    }
  }

  async function setPos(lat: number, lng: number) {
    if (!submitted) {
      const boundedLat = Math.max(-90, Math.min(90, lat));
      await api.post("/game/plonk", {
        id: matchId,
        lng: (((lng % 360) + 540) % 360) - 180,
        lat: boundedLat,
      });
      setLat(boundedLat);
      setLng(lng);
      onPlonk && onPlonk(boundedLat, lng);
    }
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (lat !== undefined && lng !== undefined && event.code === "Space") {
        event.preventDefault();
        submitGuess();
      }
      if (event.code === "KeyR") {
        setReload((prev) => prev + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lat, lng]);

  return (
    <div color="bg-dark">
      <div className="absolute w-full">
        <GamePanel
          time={time}
          timeLimit={timeLimit}
          timeoutFunction={onTimeout}
          offset={offset}
          display={[
            { key: "SCORE", value: totalScore.toString() },
            { key: "ROUND", value: roundNumber.toString() },
          ]}
        />
      </div>
      <div className="relative w-full h-full">
        <CombinedMap
          correctLat={correctLat}
          correctLng={correctLng}
          reload={reload}
          NMPZ={NMPZ}
          map={
            <BasicMapWithMarker
              lat={lat}
              lng={lng}
              setPos={setPos}
              mapBounds={mapBounds}
              cosmetics={cosmetics}
            />
          }
        />
      </div>
      <div className="text-[#ffffff] flex h-[10vh] w-full items-center">
        <div className="grid grid-cols-[repeat(3,1fr)] w-full h-full">
          <div className="flex justify-start items-center h-full">
            {!NMPZ && (
              <button
                className="bg-[gray] w-1/2 h-[70%] rounded-[2rem] dark-hover-button"
                onClick={backToStart}
              >
                Back To Start
              </button>
            )}
          </div>
          <div className="flex justify-center items-center h-full"></div>
          <div className="flex justify-end items-center h-full">
            {rightFooter ? (
              rightFooter
            ) : (
              <button
                onClick={submitGuess}
                disabled={lat !== undefined && lng !== undefined && !submitted ? false : true}
                className="h-[70%] w-full bg-plonk-stars-red justify-center items-center text-plonk-stars-white border border-solid border-plonk-stars-white transition-all duration-150 ease-[ease-in-out] rounded-[2rem] [&:not(:disabled)]:hover:-translate-y-[0.1rem] [&:not(:disabled)]:hover:[scale:1.03] [&:not(:disabled)]:hover:bg-plonk-stars-red [&:not(:disabled)]:hover:text-plonk-stars-white [&:not(:disabled)]:hover:border [&:not(:disabled)]:hover:border-solid [&:not(:disabled)]:hover:border-plonk-stars-white disabled:opacity-50 disabled:![background:#000] disabled:cursor-not-allowed"
              >
                <b className="block">Submit</b>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { GamePlay };
