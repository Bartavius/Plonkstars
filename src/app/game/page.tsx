"use client";

import { useRouter } from "next/navigation";
import api from "../../utils/api";
import { useState } from "react";
import NavBar from "@/components/Navbar";

export default function Game() {
  const router = useRouter();
  // page for starting NEW game, also render all the settings and options here.
  const [maps, setMaps] = useState<string[]>([]);
  const [mapSearch, setMapSearch] = useState<string>();
  const [rounds, setRounds] = useState<number>(5);
  const [time, setTime] = useState<number>(-1); // -1 is inf time
  const [replay, setReplay] = useState<string>("d5afbc6c-58e2-4330-bfb2-bb39feb34e94");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const startGame = async (event: React.FormEvent) => {
    event.preventDefault();
    
    {!loading && 
      setLoading(true);
      try {
        const response = await api.post("/game/create", {rounds,time,"map":{"name":mapSearch}}); //////////////////////////////////////////////////
        const { id } = response.data;
        console.log("Game created with ID:", id);

        await api.post("/game/play", { id });

        const gameUrl = `/game/${id}`;
        console.log("Navigating to:", gameUrl);

        router.push(gameUrl);
      } catch (err:any) {
        setError(err.response?.data?.error || "Error starting game");
        setLoading(false);
      }
    }
  };

  // make a handle change function

  const joinGame = async (e: React.FormEvent) => {
    e.preventDefault();
    {!loading && 
      setLoading(true);
      try{
        const res = await api.post("/game/play", {
          id: replay,
        });
      }catch(err:any){
        if (err.response?.status === 404) {
          setLoading(false);
          setError(err.response?.data?.error || "Game not found");
          return;
        }
      }
      router.push(`/game/${replay}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-white p-6">
      <div className="grid grid-cols-2 gap-4 w-full max-w-lg border-white border-4 shadow-lg rounded-2xl p-6 form-window">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-center">Game Setup</h2>
          <div className="mb-4">
            <label className="block mb-2 text-gray-300">Map Name</label>
            <div className="flex">
              <input
                className="focus:outline-none focus:ring-2 focus:ring-blue-500 input-field"
                type="text"
                placeholder="Search for a map..."
                defaultValue={mapSearch}
                onChange={(e) => e.target.value === "" ? setMapSearch(undefined): setMapSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-gray-300">No. of Rounds</label>
            <input
              className="focus:outline-none focus:ring-2 focus:ring-blue-500 input-field"
              type="number"
              defaultValue={rounds}
              onChange={(e) => setRounds(Number(e.target.value))}
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-gray-300">
              Time Limit (seconds)
            </label>
            <input
              className="focus:outline-none focus:ring-2 focus:ring-blue-500 input-field"
              type="number"
              defaultValue={time}
              onChange={(e) => setTime(Number(e.target.value))}
            />
          </div>
          <button
            disabled={loading}
            className={`w-full bg-blue-500 py-2 rounded-lg font-semibold text-white hover:bg-blue-600 transition duration-200 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={startGame}
          >
            Start Game
          </button>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4 text-center">Join Game</h2>
          <div className="mb-6">
            <label className="block mb-2 text-gray-300">
              Session ID
            </label>
            <input
              type="text"
              defaultValue={replay}
              onChange={(e) => setReplay(e.target.value)}
              className="focus:outline-none focus:ring-2 focus:ring-blue-500 input-field"
              placeholder="Enter Game ID to join..."
            />
          </div>
          <button
            disabled={loading}
            className={`w-full bg-blue-500 py-2 rounded-lg font-semibold text-white hover:bg-blue-600 transition duration-200 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={joinGame}
          >
            Join
          </button>
          
          {error && (
            <div className="mt-4"> 
              <div className="text-center text-red-500 bg-red-100 p-2 rounded-lg border border-red-400">
                {error}
              </div> 
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
