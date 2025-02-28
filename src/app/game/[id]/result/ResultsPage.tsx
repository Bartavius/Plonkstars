"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Suspense } from "react";
import NavBar from "@/components/Navbar";
import dynamic from "next/dynamic";

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
  const [loading, setLoading] = useState(true);

  // testing distance (client side for now)
  function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371000;
    const φ1 = lat1 * (Math.PI / 180);
    const φ2 = lat2 * (Math.PI / 180);
    const Δφ = (lat2 - lat1) * (Math.PI / 180);
    const Δλ = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in meters
    return Math.round(distance);
  }

  useEffect(() => {
    const userLat = searchParams.get("userLat");
    const userLng = searchParams.get("userLng");
    const correctLat = searchParams.get("correctLat");
    const correctLng = searchParams.get("correctLng");

    setUserLatParsed(userLat ? parseFloat(userLat) : null);
    setUserLngParsed(userLng ? parseFloat(userLng) : null);
    setCorrectLatParsed(correctLat ? parseFloat(correctLat) : 0);
    setCorrectLngParsed(correctLng ? parseFloat(correctLng) : 0);
    setLoading(false);

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

  const meters = getDistance(
    userLatParsed ?? 0,
    userLngParsed ?? 0,
    correctLatParsed,
    correctLngParsed
  );

  const km = Math.round(meters / 10) / 100;
  const formatter = km > 1 ? `${km} KM` : `${meters} M`;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="relative">
        <div className="fixed top-0 left-0 w-full z-20">
          <NavBar />
        </div>

        <div className="map-result-container">
          {!loading && (
            <div className="">
              <BasicMapResult
                userLat={userLatParsed}
                userLng={userLngParsed}
                correctLat={correctLatParsed}
                correctLng={correctLngParsed}
              />
            </div>
          )}
        </div>
        {userLatParsed && userLngParsed && (
          <h2 className="text-center text-4xl text-bold mt-1 inline">
            <b>Distance: {formatter}</b>
          </h2>
        )}
        <button
          onClick={nextGame}
          style={{ zIndex: 10000 }}
          className="inline m-2 mr-5 float-end bg-green-600 pl-40 pr-40 pt-2 pb-2 rounded-full border transition duration-150 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-green-700"
        >
          <b>Next Round</b>
        </button>
      </div>
    </Suspense>
  );
}
