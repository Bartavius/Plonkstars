"use client";
import "./summary.css";
import { useState } from "react";
import dynamic from "next/dynamic";
import Table from "../table/table";

const BasicMapResult = dynamic(
  () => import("@/components/maps/BasicMapResult"),
  { ssr: false }
);

interface Location {
  lat: number;
  lng: number;
}
export default function Summary({
        locations,
        data,
        user,
        children,
        mapHeight = 70,
        leaderboard = false,
    }:{
        locations:Location[]
        data:any,
        user:any
        children?:any
        mapHeight?:number
        leaderboard?:boolean
}) {
  //will need to set total number of rounds that pop up (click more at the bottom), limit of...10 per?
  const guesses = [...Array(locations.length).keys()].map((index) => {
    return data.map((u:any) => {
      return {...u.guesses[index],user:u.user};
    })
  })

  const [displayedLocation, setDisplayedLocation] = useState<Location[]>(locations);
  const [displayedGuesses, setDisplayedGuesses] = useState(guesses);

  const userStats = guesses.map((round) => {
    return round.find((guess:any) => guess.user.username === user.username);
  });
  
  const overallStats = data.find((score:any) => score.user.username === user.username);

  const keys: Record<string, any> = {user: "User",total: "Total"};
  const leaderboardHTML = data.map((scores:any, index:number) => {
    const map = scores.guesses.reduce((acc: any,guess: any,index: number) => {
      acc[`Round ${index + 1}`] = guess.score;
      keys[`Round ${index + 1}`] = `Round ${index + 1}`;
      return acc;
    }, {} as Record<string, any>);
    map.rank = scores.rank? scores.rank : index + 1;
    map.total = scores.score;
    map.user = scores.user.username;
    return map;
  });
  
  return (
    <div>
      <div id="map-summary" className="map-container absolute">
        <BasicMapResult
          markers={displayedLocation.map((location, index) => {
            return {
              correct: location,
              users: leaderboard? displayedGuesses[index]: [userStats[index]],
            };
          })}
          height={mapHeight}
        />
      </div>
      <div className="mx-auto p-6 bg-main-dark shadow-lg rounded-lg">
        {children}
        {leaderboard ? 
          <Table data={leaderboardHTML} headers={keys}/>
          :
          <div>
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
                        {guess.distance && Math.round(guess.distance * 1000) >= 1000 &&
                          `📍 ${Math.round(guess.distance * 100)/100} km away`}
                        {guess.distance && Math.round(guess.distance * 1000) < 1000 &&
                          `📍 ${Math.round(guess.distance * 1000)} m away`}
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        }
      </div>
      
    </div>
  );
}
