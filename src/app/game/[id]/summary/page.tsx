"use client";
import "./summary.css";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const BasicMapResult = dynamic(() => import("@/components/maps/BasicMapResult"),{ ssr: false });

interface Location{
  lat:number;
  lng:number;
}

interface Guess{
  user:string;
  score:number;
  distance:number | null;
  time:number | null;
  lat:number | null;
  lng:number | null;
}
export default function Summary() {
  // needs to call for all rounds info

  //will need to set total number of rounds that pop up (click more at the bottom), limit of...10 per?

  //
  const [locations, setLocations] = useState<Location[]>([]);
  const [displayedLocation, setDisplayedLocation] = useState<Location[]>([]);
  const [topGuesses, setTopGuesses] = useState<Guess[][]>([]);
  const [userGuesses, setUserGuesses] = useState<Guess[]>([]);
  const [data, setData] = useState<any[]>([]);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    if (!params.id) {
      return;
    }
    const fetchGuesses = async () => {
      try {
        const res = await api.get(
          `/game/summary?&session=${params.id}`
        );
        const location = res.data.rounds.map((guess:any) => guess.correct);
        const topGuesses = res.data.rounds.map((guess:any) => guess.top);
        const userGuesses = res.data.rounds.map((guess:any) => guess.this_user);
        setLocations(location);
        setDisplayedLocation(location);
        setTopGuesses(topGuesses);
        setUserGuesses(userGuesses);
        setData(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchGuesses();
  }, [params.id]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        router.push("/game");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const getUserMap = (top:Guess[],user:Guess) => {
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

  return (
    <div className="summary-container">
      <div id="map-summary" className="map-container absolute">
        <BasicMapResult markers={
          displayedLocation.map((location, index) => {
            return {
              correct: location,
              users: getUserMap(topGuesses[index], userGuesses[index])
            };
          })
        }
        height={70} />
      </div>
      <div className="mx-auto p-6 bg-main-dark shadow-lg rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <button
            className="btn-selected"
            onClick={() => {
              setDisplayedLocation(locations);
              router.push("#map-summary");
            }}
          >
            Select All
          </button>

          <h2 className="text-3xl font-bold text-center text-dark flex-1">
            Game Summary
          </h2>
          <button className="btn-primary" onClick={() => router.push("/game")}>
            Next Game
          </button>
        </div>

        <ul className="space-y-4 my-5">
          {userGuesses.map((guess, index) => (
            <li key={index}>
              <a
                href="#map-summary"
                className="flex mx-20 justify-between items-center bg-accent1 p-4 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200"
                onClick={() => setDisplayedLocation([locations[index]])}
              >
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-dark">
                    Round {index}
                  </span>
                  <span className="text-dark text-sm">
                    ⏳ {guess.time}s
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-lg font-bold text-red">
                    {guess.score} pts
                  </span>
                  <span className="text-dark text-sm">
                    📍 {guess.distance !== null ? `${parseFloat(guess.distance.toString()).toFixed(2)} km away` : 'Timed out'}
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
