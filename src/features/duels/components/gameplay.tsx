import { useEffect, useState } from "react";

import { CombinedMap } from "@/features/maps/components/combined-map";
import { TeamGuessingMap } from "@/features/maps/components/team-guessing-map";
import "@/app/game.css";
import { api } from "@/services/api";
import type { RoundInfo } from "@/features/game/types/round-info";

import { DuelsUIOverlay } from "./map-ui-overlay";
import type { DuelsStateTeam } from "../types/duels-state-team";
import type { DuelsUser } from "../types/duels-user";
import type { TeamMarker } from "../types/team-marker";
interface DuelsGameplayProps {
  id: string;
  users: Record<string, DuelsUser>;
  thisUser: string;
  teams: Record<string, DuelsStateTeam>;
  teamPlonks: Record<string, TeamMarker>;
  teamGuesses: Record<string, TeamMarker>;
  // The backend sends `nmpz`; this spelling never matches, so duels ignores NMPZ. Kept as-is to avoid a behavior change.
  roundInfo: RoundInfo & { NMPZ?: boolean };
  spectator?: boolean;
  canGuess?: boolean;
  guesses: number;
  maxGuesses: number;
  multi: number;
  maxHealth: number;
  endTime?: Date;
  timeLimit?: number;
  timeOffset?: number;
}

function DuelsGameplay({
  id,
  users,
  thisUser,
  teams,
  teamPlonks,
  teamGuesses,
  roundInfo,
  spectator,
  canGuess,
  guesses,
  maxGuesses,
  multi,
  maxHealth,
  endTime,
  timeLimit,
  timeOffset = 0,
}: DuelsGameplayProps) {
  const [guessed, setGuessed] = useState<boolean>(canGuess === false);
  const [reload, setReload] = useState<number>(0);
  const [rightTeamIndex, setrightTeamIndex] = useState<number>(0);

  const thisTeam =
    users[thisUser]?.team ??
    Object.keys(teams).reduce((bestTeam: string | undefined, team) => {
      if (!bestTeam) {
        return team;
      }
      if (teams[bestTeam].hp < teams[team].hp) {
        return team;
      }
    }, Object.keys(teams)[0]);
  const teamsToDisplay = Object.keys(teams).filter((t) => t != thisTeam && teams[t].hp > 0);

  useEffect(() => {}, []);

  function backToStart() {
    setReload((prev) => prev + 1);
  }

  function mapPlonk(lat: number, lng: number) {
    api.post("/game/plonk", {
      id,
      lng: (((lng % 360) + 540) % 360) - 180,
      lat: Math.max(-90, Math.min(90, lat)),
    });
  }

  function submitGuess() {
    api.post("/game/guess", {
      id,
    });
    setGuessed(true);
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        submitGuess();
      }
      if (event.code === "KeyR") {
        setReload((prev) => prev + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    function rotateTeam() {
      setrightTeamIndex((prev) => (prev + 1) % Math.max(teamsToDisplay.length, 1));
    }
    const intervalId = setInterval(rotateTeam, 5000);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div color="bg-dark">
      <DuelsUIOverlay
        time={endTime}
        timeLimit={timeLimit}
        timeOffset={timeOffset}
        roundNumber={roundInfo.round}
        multi={multi}
        maxHealth={maxHealth}
        teams={teams}
        leftTeam={thisTeam}
        rightTeam={teamsToDisplay[rightTeamIndex]}
      />
      <div className="relative w-full h-full">
        <CombinedMap
          correctLat={roundInfo.lat}
          correctLng={roundInfo.lng}
          reload={reload}
          NMPZ={roundInfo.NMPZ!}
          map={
            spectator ? null : (
              <TeamGuessingMap
                users={users}
                plonks={teamPlonks}
                guesses={teamGuesses}
                mapBounds={roundInfo.map_bounds}
                onClick={mapPlonk}
              />
            )
          }
        />
      </div>
      <div className="text-[#ffffff] flex h-[10vh] w-full items-center">
        <div className="grid grid-cols-[repeat(3,1fr)] w-full h-full">
          <div className="flex justify-start items-center h-full">
            {!roundInfo.NMPZ && (
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
            {guessed ? (
              <div className="border border-gray-300 bg-white shadow-md rounded-full text-base font-semibold text-gray-800 mr-4 flex justify-center items-center px-5 py-1.5">
                {guesses}/{maxGuesses} guesses
              </div>
            ) : (
              <button
                onClick={submitGuess}
                disabled={!canGuess}
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

export { DuelsGameplay };
