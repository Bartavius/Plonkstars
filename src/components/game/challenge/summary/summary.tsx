"use client";
import "./summary.css";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Table from "@/components/table/table";
import {useRouter} from "next/navigation";
import ScoreBox from "@/components/game/challenge/summary/ScoreBox";
import UserIcon from "@/components/user/UserIcon";

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
  const [highlighted, setHighlighted] = useState<number>(0);
  const router = useRouter();

  const userStats = guesses.map((round) => {
    return round.find((guess:any) => guess.user.username === user.username);
  });
  const userDisplay = displayedGuesses.map((round) => {
    return round.find((guess:any) => guess.user.username === user.username);
  });
  
  const overallStats = data.find((score:any) => score.user.username === user.username);
  function distanceString(distance: number){
    if (distance === undefined) return "N/A";
    const m = Math.round(distance * 1000);
    const km = Math.round(m / 10) / 100;
    const num = km > 1 ? km : m;
    const unit = km > 1 ? "km" : "m";
    return `${num}${unit}`;
  };

  function timeString(time: number){
    if (time === undefined) return "Timed Out";
    const minutes = Math.floor(time / 60);
    const seconds = Math.round(time % 60);
    return minutes > 0
      ? `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`: `${seconds}s`;
  };

  const keys: Record<string, any> = {total: <div className={highlighted === 0?"text-white":""}>Total</div>};
  const leaderboardHTML = leaderboard && data.map((scores:any, index:number) => {
    const map = scores.guesses.reduce((acc: any,guess: any,index: number) => {
      acc[`Round ${index + 1}`] = <ScoreBox data={guess}/>;
      keys[`Round ${index + 1}`] = <div className={highlighted === index + 1?"text-white":""}>Round {index + 1}</div>;
      return acc;
    }, {} as Record<string, any>);
    const rank = scores.rank? scores.rank : index + 1;
    map.total = <ScoreBox data={scores}/>;
    map.heading = (
      <div className="summary-rank-box">
        <div className="rank-number-text">#{rank}<UserIcon data={scores.user.user_cosmetics} className="summary-leaderboard-avatar"/></div>
        <div className="user-name-text">{scores.user.username}</div>
      </div>
    );
    if (scores.user.username === user.username){
      map.style = "summary-highlight-self-row";
    }
    return map;
  });

  function clickHeader(column: number){
    setHighlighted(column);
    const round = column - 1;
    router.push("#map-summary");
    if(round < 0){
      setDisplayedGuesses(guesses);
      setDisplayedLocation(locations);
    }
    else{
      setDisplayedGuesses([guesses[round]]);
      setDisplayedLocation([locations[round]]);
    }
  }

  useEffect(() => {
    setHighlighted(0);
    setDisplayedGuesses(guesses);
    setDisplayedLocation(locations);
  },[leaderboard])
  return (
    <div>
      <div id="map-summary" className="map-container absolute">
        <BasicMapResult
          markers={displayedLocation.map((location, index) => {
            return {
              correct: location,
              users: leaderboard? displayedGuesses[index]: [userDisplay[index]],
            };
          })}
          height={mapHeight}
        />
      </div>
      <div className="mx-auto p-6 bg-main-dark shadow-lg rounded-lg">
        {children}
        {leaderboard ? 
          <Table 
            data={leaderboardHTML} 
            onClickHeader={clickHeader}
            headers={keys} 
            rowHeader="heading"
            className="table-leaderboard-style"
          />
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
                    ⏳ {timeString(overallStats.time)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-lg font-bold text-red">
                    {overallStats.score} pts
                  </span>
                  <span className="text-dark text-sm">
                    {overallStats.distance && `📍 ${distanceString(overallStats.distance)} away`}
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
                        ⏳ {guess.time ? timeString(guess.time) : "Timed Out"}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="block text-lg font-bold text-red">
                        {guess.score} pts
                      </span>
                      <span className="text-dark text-sm">
                        {guess.distance && `📍 ${distanceString(guess.distance)} away`}
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
