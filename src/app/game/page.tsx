"use client";

import { useRouter } from "next/navigation";
import api from "../../utils/api";
import { useEffect, useRef, useState } from "react";
import "@/app/game.css";
import Modal from "@/components/Modal";
import MapSearch from "@/components/maps/search/MapSearch";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { setGameSettings } from "@/redux/gameSlice";
import ProtectedRoutes from "../ProtectedRoutes";
import { clearError } from "@/redux/errorSlice";
import { FaQuestionCircle } from "react-icons/fa";
import Popup from "@/components/Popup";
import Loading from "@/components/loading";
import DailyTimer from "./DailyTimer";

const MIN_ROUNDS = 5;
const MAX_ROUNDS = 20;
const MIN_TIME = 5;
const MAX_TIME = 300;

export default function Game() {
  const router = useRouter();
  const dispatch = useDispatch();

  // loading past game settings
  const lastSetting = useSelector((state: any) => state.game);
  const errorState = useSelector((state: any) => state.error).error;

  // page for starting NEW game, also render all the settings and options here.
  const [mapName, setMapName] = useState<string>(lastSetting.mapName);
  const [mapId, setMapId] = useState<string>(lastSetting.mapId);
  const [rounds, setRounds] = useState<number>(lastSetting.rounds);
  const [time, setTime] = useState<number>(lastSetting.seconds);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(errorState);
  const [NMPZ, setNMPZ] = useState<boolean>(lastSetting.NMPZ);
  const [daily, setDaily] = useState<any>()

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    setMapName(lastSetting.mapName);
    setMapId(lastSetting.mapId);
    setRounds(lastSetting.rounds);
    setTime(lastSetting.seconds);
    setNMPZ(lastSetting.NMPZ);
  }, [lastSetting]);

  async function fetchDaily() {
    const daily = await api.get(`/session/daily`);
    setDaily(daily.data);
  }

  useEffect(() => {
    fetchDaily();
  },[]);

  async function playDaily() {
    if (!daily) return;
    router.push(`/game/${daily.id}/join`);
  }

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
          map_id: mapId,
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

  console.log(daily);

  const addMap = (id: string, name: string) => {
    setIsModalOpen(false);
    setMapId(id);
    setMapName(name);
  };

  return (
    <ProtectedRoutes>
      <div className="relative">
        <div className="flex items-center justify-center min-h-screen text-white p-6 w-full h-full">
          <div className="flex flex-row w-full max-w-lg border-white border-4 shadow-lg rounded-2xl py-6 form-window divide-x divide-x-2">
            <div className="w-full px-4">
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
                  className="focus:outline-none input-field cursor-pointer"
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
                  className="text-dark focus:outline-none input-field cursor-pointer"
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
                  className="mr-2 cursor-pointer"
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
            <div className="w-full px-4">
              <h2 className="text-xl font-semibold mb-2 text-center">
                Daily Challenge
              </h2>
              { daily ? 
              <>
                <div className="text-center mb-2 text-lg font-semibold text-white"><DailyTimer time={daily.next} onFinish={fetchDaily}/></div>
                <label
                  className="block mb-2 text-white"
                  htmlFor="map-search-bar"
                >
                  Map Name
                </label>
                <button
                  className={`bg-dark w-full py-2 rounded-lg font-semibold mb-4 dark-hover-button ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                  onClick={() => router.push(`/map/${daily.map.id}`)}
                >
                  {daily.map.name}
                </button>
              
                <div className="block mb-6 text-white font-semibold">
                  No. of Rounds: {daily.rules.rounds}
                </div>
                <div className="block mb-6 text-white font-semibold">
                  Time Limit:{" "}
                  {daily.rules.time == -1 ? "Infinite" : `${daily.rules.time}s`}
                </div>          
                <div
                  className="mb-4"
                  title="No moving, No panning, No zooming"
                >
                  <b>NMPZ: {daily.rules.NMPZ ? "Yes": "No"}</b>
                </div>
                <button
                  disabled={loading}
                  className={`${daily.finished ? "bg-yellow":"game-setup-btn"} w-full py-2 rounded-lg font-semibold dark-hover-button ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={playDaily}
                >
                  {daily.finished?"Leaderboard":daily.playing?"Continue":"Play"}
                </button>
              </>:<Loading/>
              }
            </div>
          </div>
        </div>
        <Popup message={error} type="error"/>
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
