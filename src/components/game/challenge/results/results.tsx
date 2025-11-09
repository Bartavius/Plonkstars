"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "@/app/game.css";
import GamePanel from "@/components/game/GamePanel";
import ScoreAccordion from "./ScoreAccordian";
import { FaMedal } from "react-icons/fa";
import Popup from "@/components/Popup";
import Modal from "@/components/Modal";
import MapSearch from "@/components/maps/search/MapSearch";
import api from "@/utils/api";

const BasicMapResult = dynamic(
  () => import("@/components/maps/BasicMapResult"),
  { ssr: false }
);

export default function Results({
  onClick,
  this_user,
  users,
  roundNumber,
  correct,
  centerText,
}: {
  onClick: () => void;
  this_user: any;
  users: any;
  roundNumber: number;
  correct: any;
  centerText?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState<number>(0);
  const [message, _setMessage] = useState<React.ReactNode>();
  const [messageType, setMessageType] = useState<string>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  

  const setMessage = (message: React.ReactNode,type?:string) => {
    _setMessage(message);
    setMessageType(type);
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
    (user: any) => user.user.username === this_user
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

  async function addLocation(id:string,name: string){
    if (correct === undefined) return;
    try {
      const res = await api.post("/map/edit/bound/add", {
        ...correct,
        id,
        weight: 1,
      });
      setMessage("Successfully added the location!","success");
    } catch (error:any) {
      setMessage(error.response.data.error || "Failed to add the location.","error");
    }
    setIsModalOpen(false);
  };
  return (
    <div className="relative overflow-hidden">
      <Popup update={update} type={messageType}>
        {message}
      </Popup>
      <div className="absolute w-full">
        <GamePanel display={[{key:"SCORE",value:thisUser.score.toString()},{key:"ROUND", value:roundNumber.toString()}]} />
      </div>
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
                style={{ zIndex: 2 }}
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
              onClick={() => setIsModalOpen(true)}
            >
              <span>Add Location to Your Maps</span>
            </button>
          </div>
        </div>
      </div>
      <div className="fixed z-10">
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2 className="text-xl font-semibold text-center">Add this location to a map</h2>
          <div className="text-center">
            
          </div>
          <MapSearch mapSelect={addLocation} pageSize={12} bodySize="60vh" editable={true}/>
        </Modal>
      </div>
    </div>
  );
}
