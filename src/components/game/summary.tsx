"use client";
import "./summary.css";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import ProtectedRoutes from "@/app/ProtectedRoutes";
import Loading from "@/components/loading";

const BasicMapResult = dynamic(
  () => import("@/components/maps/BasicMapResult"),
  { ssr: false }
);

interface Location {
  lat: number;
  lng: number;
}
export default function Summary(
    {
        locations,
        guesses,
        scores,
        user,
        children,
        mapHeight = 70,
    }:{
        locations:Location[]
        guesses:any[]
        scores:any[]
        user:any
        children?:any
        mapHeight?:number
    }
) {
    //will need to set total number of rounds that pop up (click more at the bottom), limit of...10 per?
    const [displayedLocation, setDisplayedLocation] = useState<Location[]>(locations);
    const [displayedGuesses, setDisplayedGuesses] = useState(guesses);

    const userStats = guesses.map((round) => {
      return round.find((guess:any) => guess.user.username === user.username);
    });
    const overallStats = scores.find((score) => score.user.username === user.username);
    return (
      <div>
        <div id="map-summary" className="map-container absolute">
          <BasicMapResult
            markers={displayedLocation.map((location, index) => {
              return {
                correct: location,
                users: displayedGuesses[index],
              };
            })}
            height={mapHeight}
          />
        </div>
        <div className="mx-auto p-6 bg-main-dark shadow-lg rounded-lg">
          {children}
          <div className="mt-5">
            <a
              href="#map-summary"
              className="flex mx-20 justify-between items-center bg-accent1 p-4 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200"
              onClick={() => {
                setDisplayedGuesses(guesses);
                setDisplayedLocation(locations);
              }}
            >
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-dark">
                  Overall Stats
                </span>
                <span className="text-dark text-sm">
                  ⏳ {`${overallStats.time}s`}
                </span>
              </div>
              <div className="text-right">
                <span className="block text-lg font-bold text-red">
                  {overallStats.score} pts
                </span>
                <span className="text-dark text-sm">
                  {overallStats.distance && Math.round(overallStats.distance) >= 1 &&
                    `📍 ${Math.round(overallStats.distance * 100)/100} km away`}
                  {overallStats.distance && overallStats.distance < 1 &&
                    `📍 ${Math.round(overallStats.distance * 1000)} m away`}
                </span>
              </div>
            </a>
          </div>
          <ul className="space-y-4 my-5">
            {userStats.map((guess:any, index:number) => (
              <li key={index}>
                <a
                  href="#map-summary"
                  className="flex mx-20 justify-between items-center bg-accent1 p-4 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200"
                  onClick={() => {
                    setDisplayedGuesses([guesses[index]]);
                    setDisplayedLocation([locations[index]]);
                  }}
                >
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-dark">
                      Round {index + 1}
                    </span>
                    <span className="text-dark text-sm">
                      ⏳ {guess.time ? `${guess.time}s` : "Timed Out"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-lg font-bold text-red">
                      {guess.score} pts
                    </span>
                    <span className="text-dark text-sm">
                      {guess.distance && Math.round(guess.distance) >= 1 &&
                        `📍 ${Math.round(guess.distance * 100)/100} km away`}
                      {guess.distance && guess.distance < 1 &&
                        `📍 ${Math.round(guess.distance * 1000)} m away`}
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
  );
}
