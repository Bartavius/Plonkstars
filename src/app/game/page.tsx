"use client";

import { useRouter } from "next/navigation";
import api from "../../utils/api";
import { useEffect, useState } from "react";
import NavBar from "@/components/Navbar";

export default function Game() {
  const router = useRouter();

  // page for starting NEW game, also render all the settings and options here.
  const [maps, setMaps] = useState<string[]>([]);
  const [mapSearch, setMapSearch] = useState<string>();
  const [rounds, setRounds] = useState<number>(5);
  const [time, setTime] = useState<number>(-1); // -1 is inf time

  const startGame = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await api.post("/game/create");
      const { id } = response.data;
      console.log("Game created with ID:", id);

      await api.post("/game/play", { id });

      const gameUrl = `/game/${id}`;
      console.log("Navigating to:", gameUrl);

      router.push(gameUrl);
    } catch (error) {
      console.error("Error starting game:", error);
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
    await api.post("/game/play", {
      id: "aa654dbf-e103-4105-b7e1-0067869219b9",
    });
    router.push("/game/aa654dbf-e103-4105-b7e1-0067869219b9");
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-white p-4">
      <NavBar />
      <div className="w-full max-w-lg border-white border-4 shadow-lg rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">Game Setup</h2>
        <p>** none of these inputs are tracked at the moment. Click start game if you want to play by yourself, or join game if you want to play the same location with a friend.**</p>

        <div className="mb-4">
          <label className="block mb-2 text-gray-300">Map Name</label>
          <div className="flex">
            <input
              className="w-full px-3 py-2 rounded-l-lg bg-white text-black border border-gray-600 focus:outline-none focus:ring-2 focus:ring-white"
              type="text"
              placeholder="Search for a map..."
              defaultValue={mapSearch}
              onChange={(e) => setMapSearch(e.target.value)}
            />
            <button className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600">
              Search
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-300">No. of Rounds</label>
          <input
            className="w-full px-3 py-2 rounded-lg bg-white text-black border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        <hr className="my-6 border-white" />
        <button
          className="w-full bg-blue-500 py-2 rounded-lg font-semibold text-white hover:bg-blue-600 transition duration-200"
          onClick={joinGame}
        >
          Join Game "aa654dbf-e103-4105-b7e1-0067869219b9"
        </button>
      </div>
    </div>
  );
}
