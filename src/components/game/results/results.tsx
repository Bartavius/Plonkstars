"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "@/app/game.css";
import GamePanel from "@/components/game/GamePanel";
import ScoreAccordion from "./ScoreAccordian";
import { FaMedal } from "react-icons/fa";
import MapAccordian from "./MapAccordian";
import Popup from "@/components/Popup";

const BasicMapResult = dynamic(
  () => import("@/components/maps/BasicMapResult"),
  { ssr: false }
);

export default function Results({
  onClick,
  this_user,
  users,
  maps,
  roundNumber,
  correct,
  centerText,
}: {
  onClick: () => void;
  this_user: any;
  users: any;
  maps: any[];
  roundNumber: number;
  correct: any;
  centerText?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [openMaps, setOpenMaps] = useState(false);
  const [update, setUpdate] = useState<number>(0);
  const [message, _setMessage] = useState<React.ReactNode>();

  const setMessage = (message: React.ReactNode) => {
    _setMessage(message);
    setUpdate((prev) => prev + 1);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        onClick();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const thisUser = users.find(
    (user: any) => user.user.username === this_user.username
  );

  const distanceString = (distance: number) => {
    const m = distance === undefined ? -1 : Math.round(distance * 1000);
    const km = Math.round(m / 10) / 100;
    const userDistance = km > 1 ? km : m;
    const units = km > 1 ? "km" : "m";
    return { userDistance, units };
  };

  const userDistance = thisUser.guess.distance
    ? distanceString(thisUser.guess.distance)
    : undefined;

  return (
    <div className="relative overflow-hidden">
      <Popup update={update} type={typeof message === "string" && message.includes("Failed") ? "error" : "success"}>
                {message}
              </Popup>
      <GamePanel totalScore={thisUser.score} roundNumber={roundNumber} />
      <div className="map-result-container min-h-[90vh] min-w-full">
        <div>
          <BasicMapResult
            markers={[
              {
                users: users.map((user: any) => ({
                  ...user.guess,
                  user: user.user,
                })),
                correct: correct,
              },
            ]}
            user={this_user}
          />
        </div>
      </div>
      <div className="game-footer w-full">
        <div className="grid grid-cols-3 gap-4 w-full">
          <div className="flex justify-between items-center">
            <MapAccordian
              open={openMaps}
              maps={maps}
              location={correct}
              className="absolute justify-end"
              setMessage={setMessage}
            />
            <ScoreAccordion
              open={open}
              guesses={users}
              className="absolute"
              user={this_user}
            />

            <button
              className="accordion-toggle dark-hover-button gray-disabled"
              onClick={() => setOpen(!open)}
            >
              <FaMedal />
              {open ? "Hide" : "Show"} Scores
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
            {centerText ?? (
              <button
                onClick={onClick}
                style={{ zIndex: 10000 }}
                className="game-button"
              >
                <b>Next Round</b>
              </button>
            )}
          </div>
          <div className="flex justify-between items-center">
            {userDistance !== undefined && (
              <div>
                <div className="text-center inline">
                  <div>
                    <b className="text-2xl">
                      {userDistance.userDistance} {userDistance.units}
                    </b>
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
            <button
              className="btn-primary mr-4"
              onClick={() => setOpenMaps(!openMaps)}
            >
              <span>Add Location to Your Maps</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
