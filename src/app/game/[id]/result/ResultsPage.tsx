"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Suspense } from "react";
import NavBar from "@/components/Navbar";
import dynamic from "next/dynamic";
import api from "@/utils/api";

const BasicMapResult = dynamic(
  () => import("@/components/maps/BasicMapResult"),
  { ssr: false }
);

export default function Results() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const matchId = params.id;

  const [userLatParsed, setUserLatParsed] = useState<number | null>(null);
  const [userLngParsed, setUserLngParsed] = useState<number | null>(null);
  const [correctLatParsed, setCorrectLatParsed] = useState<number>(0);
  const [correctLngParsed, setCorrectLngParsed] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getResults = async () => {
      const roundNumber = searchParams.get("round");
      try{
        const response = await api.get(`/game/results?id=${matchId}&round=${roundNumber}`);
        const { userLat, userLng, correctLat, correctLng, distance, score, time} = response.data;
        console.log(time);
        setUserLatParsed(userLat);
        setUserLngParsed(userLng);
        setCorrectLatParsed(correctLat);
        setCorrectLngParsed(correctLng);
        setDistance(distance);
        setScore(score);
      } catch (err:any) {
        setError(err.response?.data?.error || "Error getting results");
      }
      setLoading(false);
    }

    getResults();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        nextGame();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);


  const nextGame = () => {
    router.push(`/game/${matchId}`);
  };

  const m = distance * 1000;
  const km = Math.round(m / 10) / 100;
  const formatter = km > 1 ? `${km}` : `${m}`;
  const units = km > 1 ? "KM" : "M";

  if(error) {
    return <div>{error}</div>;
  }

  if(loading) {
    return <div>Loading...</div>;
  }

  return (
      <div className="relative">
        <div className="fixed top-0 left-0 w-full z-20">
          <NavBar />
        </div>
        <div className="map-result-container">
          <div className="">
            <BasicMapResult
              userLat={userLatParsed}
              userLng={userLngParsed}
              correctLat={correctLatParsed}
              correctLng={correctLngParsed}
            />
          </div>
        </div>
        <div className="game-footer justify-center">
          <div className="results-score">
            {distance && (
              <h2 className="text-center mt-1 inline">
                <div>
                  <b className="text-2xl">
                    {formatter}
                  </b>
                </div>
                <div>
                  <label>
                    {units}
                  </label>
                </div>
              </h2>
            )}
          </div>
          <div className="game-footer-element px-6">
            <button
              onClick={nextGame}
              style={{ zIndex: 10000 }}
              className="game-button"
            >
              <b>Next Round</b>
            </button>
          </div>
          {score && (
              <h2 className="text-center mt-1 inline">
                <div>
                  <b className="text-2xl">
                    {score}
                  </b>
                </div>
                <div>
                  <label>
                    SCORE
                  </label>
                </div>
              </h2>
            )}
        </div>
      </div>
  );
}
