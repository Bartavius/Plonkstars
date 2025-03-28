"use client";

import { useRouter } from "next/navigation";
import api from "../../utils/api";
import { useEffect, useState } from "react";
import "@/app/game.css";
import Modal from "@/components/Modal";
import MapSearch from "@/components/maps/search/MapSearch";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { setGameSettings } from "@/redux/gameSlice";
import ProtectedRoutes from "../ProtectedRoutes";
import { clearError } from "@/redux/errorSlice";
import { FaQuestionCircle } from "react-icons/fa";

const MIN_ROUNDS = 5;
const MAX_ROUNDS = 20;
const MIN_TIME = 5;
const MAX_TIME = 300;
const DEFAULT_TIME = 60;
const DEFAULT_MAP_NAME = "World";
const DEFAULT_MAP_UUID = "6de5dcca-72c2-4c5a-8984-bcff7f059ea0";
// all default values are initialized in the gameSlice redux
const REPLAY_GAME = "d5afbc6c-58e2-4330-bfb2-bb39feb34e94";

export default function Game() {
  const router = useRouter();
  const dispatch = useDispatch();

  // loading past game settings
  const lastSetting = useSelector((state: any) => state.game);
  const errorState = useSelector((state: any) => state.error).error;
  // page for starting NEW game, also render all the settings and options here.
  const [maps, setMaps] = useState<string[]>([]);
  const [mapName, setMapName] = useState<string>(lastSetting.mapName);
  const [mapId, setMapId] = useState<string>(lastSetting.mapId);
  const [rounds, setRounds] = useState<number>(lastSetting.rounds);
  const [time, setTime] = useState<number>(lastSetting.seconds);
  const [replay, setReplay] = useState<string>(REPLAY_GAME);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(errorState);
  const [NMPZ, setNMPZ] = useState<boolean>(false);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const startGame = async (event: React.FormEvent) => {
    event.preventDefault();
    {
      !loading && setLoading(true);
      try {
        const checkInfRounds =
          rounds < MIN_ROUNDS || rounds >= MAX_ROUNDS + 1 ? MIN_ROUNDS : rounds;
        const checkInfTime =
          time < MIN_TIME || time >= MAX_TIME + 1 ? -1 : time;
        const response = await api.post("/game/create", {
          rounds: checkInfRounds,
          time: checkInfTime,
          map: { id: mapId },
          nmpz: NMPZ,
        });
        dispatch(
          setGameSettings({
            mapName: mapName,
            mapId: mapId,
            seconds: checkInfTime,
            rounds: checkInfRounds,
            NMPZ: NMPZ,
          })
        );
        const { id } = response.data;
        router.push(`/game/${id}/join`);
      } catch (err: any) {
        setError(err.response?.data?.error || "Error starting game");
        setLoading(false);
      }
    }
  };

  // make a handle change function

  const joinGame = async (e: React.FormEvent) => {
    router.push(`/game/${replay}/join`);
  };

  const addMap = (id: string, name: string) => {
    setIsModalOpen(false);
    setMapId(id);
    setMapName(name);
  };

  useEffect(() => {
    setMapName(lastSetting.mapName || DEFAULT_MAP_NAME);
    setMapId(lastSetting.mapId || DEFAULT_MAP_UUID);
    setRounds(lastSetting.rounds || MIN_ROUNDS);
    setTime(lastSetting.seconds || DEFAULT_TIME);
    setNMPZ(lastSetting.NMPZ || false);
  }, [lastSetting]);

  return (
    <ProtectedRoutes>
      <div className="relative">
        <div className="flex items-center justify-center min-h-screen text-white p-6 w-full h-full">
          <div className="grid grid-cols-2 gap-4 w-full max-w-lg border-white border-4 shadow-lg rounded-2xl p-6 form-window">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-center">
                Game Setup
              </h2>
              <div className="mb-4 relative">
                <label
                  className="block mb-2 text-white"
                  htmlFor="map-search-bar"
                >
                  Map Name
                </label>
                <button
                  className={`game-setup-btn w-full py-2 rounded-lg font-semibold ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                  onClick={() => {
                    !loading && setIsModalOpen(true);
                  }}
                >
                  <FaMagnifyingGlass className="inline" /> {mapName}
                </button>
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-white" htmlFor="round-range">
                  No. of Rounds: {rounds}
                </label>
                <input
                  className="focus:outline-none input-field"
                  style={{ padding: "0px" }}
                  type="range"
                  id="round-range"
                  min={MIN_ROUNDS}
                  max={MAX_ROUNDS}
                  step="1"
                  value={rounds}
                  onChange={(e) => setRounds(Number(e.target.value))}
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-white" htmlFor="time-range">
                  Time Limit:{" "}
                  {time >= MAX_TIME + 1 || time == -1 ? "Infinite" : `${time}s`}
                </label>
                <input
                  className="text-dark focus:outline-none  input-field"
                  style={{ padding: "0px" }}
                  type="range"
                  id="time-range"
                  min={MIN_TIME}
                  max={MAX_TIME + 1}
                  step="1"
                  value={time == -1 ? MAX_TIME + 1 : time}
                  onChange={(e) => setTime(Number(e.target.value))}
                />
              </div>
              <div className="mb-6">
                <input
                  type="checkbox"
                  name="NMPZ-toggle"
                  id="NMPZ-toggle"
                  checked={NMPZ}
                  className="mr-2"
                  onChange={(e) => 
                    setNMPZ(e.target.checked)
                  }
                />
                <label
                  htmlFor="NMPZ-toggle"
                  title="No moving, No panning, No zooming"
                >
                  <b>NMPZ</b>
                  <FaQuestionCircle className="ml-2 inline" />
                </label>
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
              <h2 className="text-xl font-semibold mb-4 text-center">
                Join Game
              </h2>
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
            <h2 className="text-xl font-semibold text-center">Select Map</h2>
            <div className="text-center">
              For more info about the maps:{" "}
              <a href="/map" className="link">
                Click here
              </a>
            </div>
            <MapSearch mapSelect={addMap} pageSize={12} bodySize="60vh" />
          </Modal>
        </div>
      </div>
    </ProtectedRoutes>
  );
}
