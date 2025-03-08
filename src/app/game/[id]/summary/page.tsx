"use client";
import "./summary.css";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const BasicMapResult = dynamic(() => import("@/components/maps/BasicMapResult"),{ ssr: false });

export default function Summary() {
  // needs to call for all rounds info

  //will need to set total number of rounds that pop up (click more at the bottom), limit of...10 per?

  //
  const [locations, setLocations] = useState<any[]>([]);
  const [displayedLocation, setDisplayedLocation] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const user = useSelector((state: any) => state.auth.token);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    if (!user || !params.id) {
      return;
    }
    const fetchGuesses = async () => {
      try {
        const res = await api.get(
          `/game/summary?user_id=${user}&session=${params.id}`
        );
        const location = res.data.map((guess: any) => guess.coordinates);
        setLocations(location);
        setDisplayedLocation(location);
        setData(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchGuesses();
  }, [user, params.id]);

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

  return (
    <div className="summary-container">
      <div id="map-summary" className="map-container absolute">
        <BasicMapResult markers={displayedLocation} height={70} />
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
          {data.map((guess, index) => (
            <li key={index}>
              <a
                href="#map-summary"
                className="flex mx-20 justify-between items-center bg-accent1 p-4 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200"
                onClick={() => setDisplayedLocation([guess.coordinates])}
              >
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-dark">
                    Round {guess.data.round_number}
                  </span>
                  <span className="text-dark text-sm">
                    ⏳ {guess.data.time}s
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-lg font-bold text-red">
                    {guess.data.score} pts
                  </span>
                  <span className="text-dark text-sm">
                    📍 {parseFloat(guess.data.distance).toFixed(2)} km away
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
