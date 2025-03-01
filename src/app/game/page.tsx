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
  const [replay, setReplay] = useState<string>("aa654dbf-e103-4105-b7e1-0067869219b9");
  const [loading, setLoading] = useState<boolean>(false);

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
      } catch (error) {
        console.error("Error starting game:", error);
      }
    }
  };

  // useEffect(() => {
  //   const fetchMaps = async () => {
  //     const response = await api.get(); // getting maps //////////////////////////////////////////////////
  //     const { maps } = response.data;
  //     setMaps(maps);
  //   }
  //   fetchMaps();
  // }, [])

  // make a handle change function

  const joinGame = async () => {
    {!loading && 
      setLoading(true);
      try{
        await api.post("/game/play", {
          id: "aa654dbf-e103-4105-b7e1-0067869219b9",
        });
      }catch(error){

      }finally{
        router.push("/game/aa654dbf-e103-4105-b7e1-0067869219b9");
      }
    }
  };
  if (loading){
    return <div>Loading...</div>
  }

  return (
    <div className="flex items-center justify-center min-h-screen text-white p-6">
      <NavBar />
      <div className="grid grid-cols-2 gap-4 w-full max-w-lg border-white border-4 shadow-lg rounded-2xl p-6">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-center">Game Setup</h2>
          <div className="mb-4">
            <label className="block mb-2 text-gray-300">Map Name</label>
            <div className="flex">
              <input
                className="w-full px-3 py-2 rounded-lg bg-white text-black border border-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                placeholder="Search for a map..."
                defaultValue={mapSearch}
                onChange={(e) => setMapSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-gray-300">No. of Rounds</label>
            <input
              className="w-full px-3 py-2 rounded-lg bg-white text-black border border-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-3 py-2 rounded-lg bg-white text-black border border-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="number"
              defaultValue={time}
              onChange={(e) => setTime(Number(e.target.value))}
            />
          </div>
          <button
            className="w-full bg-blue-500 py-2 rounded-lg font-semibold text-white hover:bg-blue-600 transition duration-200"
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
              className="w-full px-3 py-2 rounded-lg bg-white text-black border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Game ID to join..."
            />
          </div>
          <button
            className="w-full bg-blue-500 py-2 rounded-lg font-semibold text-white hover:bg-blue-600 transition duration-200"
            onClick={joinGame}
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
}
