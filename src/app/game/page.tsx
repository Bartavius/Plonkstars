"use client";

import { useRouter } from "next/navigation";
import api from "../../utils/api";
import { useState } from "react";
import "./game.css";
import Modal from "@/components/Modal";
import MapSearch from "@/components/maps/search/MapSearch";
import { FaMagnifyingGlass } from "react-icons/fa6";

const minRounds = 5;
const maxRounds = 20;
const minTime = 5;
const maxTime = 300;

export default function Game() {
  const router = useRouter();
  // page for starting NEW game, also render all the settings and options here.
  const [maps, setMaps] = useState<string[]>([]);
  const [mapName, setMapName] = useState<string>("World");
  const [mapId, setMapId] = useState<string>("6de5dcca-72c2-4c5a-8984-bcff7f059ea0");
  const [rounds, setRounds] = useState<number>(minRounds);
  const [time, setTime] = useState<number>(60); // -1 is inf time
  const [replay, setReplay] = useState<string>(
    "d5afbc6c-58e2-4330-bfb2-bb39feb34e94"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const startGame = async (event: React.FormEvent) => {
    event.preventDefault();

    {
      !loading && setLoading(true);
      try {
        const checkInfRounds =
          rounds < minRounds || rounds >= maxRounds + 1 ? -1 : rounds;
        const checkInfTime = time < minTime || time >= maxTime + 1 ? -1 : time;
        const response = await api.post("/game/create", {
          "rounds": checkInfRounds,
          "time": checkInfTime,
          map: { id: mapId },
        });
        const { id } = response.data;

        await api.post("/game/play", { id });

        const gameUrl = `/game/${id}`;

        router.push(gameUrl);
      } catch (err: any) {
        setError(err.response?.data?.error || "Error starting game");
        setLoading(false);
      }
    }
  };

  // make a handle change function

  const joinGame = async (e: React.FormEvent) => {
    e.preventDefault();
    {
      !loading && setLoading(true);
      try {
        const res = await api.post("/game/play", {
          id: replay,
        });
      } catch (err: any) {
        if (err.response?.status === 404) {
          setLoading(false);
          setError(err.response?.data?.error || "Game not found");
          return;
        }
      }
      router.push(`/game/${replay}`);
    }
  };

  const addMap = (id: string, name: string) => {
    setIsModalOpen(false);
    setMapId(id);
    setMapName(name);
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-center min-h-screen text-white p-6 w-full h-full">
        <div className="grid grid-cols-2 gap-4 w-full max-w-lg border-white border-4 shadow-lg rounded-2xl p-6 form-window">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-center">Game Setup</h2>
            <div className="mb-4 relative">
              <label
                className="block mb-2 text-white"
                htmlFor="map-search-bar"
              >
                Map Name
              </label>
              <button 
                className={`game-setup-btn w-full py-2 rounded-lg font-semibold ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={loading}
                onClick={() => {!loading && setIsModalOpen(true)}}
              >
                 <FaMagnifyingGlass className="inline"/> {mapName}
              </button>
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-white" htmlFor="round-range">
                No. of Rounds: {rounds >= maxRounds + 1 ? "Infinite" : rounds}
              </label>
              <input
                className="focus:outline-none input-field"
                style={{ padding: "0px" }}
                type="range"
                id="round-range"
                min={minRounds}
                max={maxRounds + 1}
                step="1"
                value={rounds}
                onChange={(e) => setRounds(Number(e.target.value))}
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-white" htmlFor="time-range">
                Time Limit: {time >= maxTime + 1 ? "Infinite" : `${time}s`}
              </label>
              <input
                className="text-dark focus:outline-none  input-field"
                style={{ padding: "0px" }}
                type="range"
                id="time-range"
                min={minTime}
                max={maxTime + 1}
                step="1"
                value={time}
                onChange={(e) => setTime(Number(e.target.value))}
              />
            </div>
            <button
              disabled={loading}
              className={`game-setup-btn w-full py-2 rounded-lg font-semibold ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={startGame}
            >
              Start Game
            </button>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4 text-center">Join Game</h2>
            <div className="mb-6">
              <label className="block mb-2 text-white" htmlFor="session-id">
                Session ID
              </label>
              <input
                id="session-id"
                type="text"
                defaultValue={replay}
                onChange={(e) => setReplay(e.target.value)}
                className="focus:outline-none focus:ring-2 focus:ring-blue-500 input-field text-dark"
                placeholder="Enter Game ID to join..."
              />
            </div>
            <button
              disabled={loading}
              className={`w-full bg-dark py-2 rounded-lg font-semibold game-setup-btn ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
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
      <div className="fixed">
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <MapSearch mapSelect={addMap} pageSize={12}/>
        </Modal>
      </div>
    </div>
  );
}
