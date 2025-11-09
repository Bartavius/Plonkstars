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
import constants from "@/app/constants.json";
import Popup from "@/components/Popup";
import Multiplayer from "./multiplayer";
import Daily from "./daily";
import UserInput from "@/components/party/userInput";
import Loading from "@/components/loading";

export default function Game() {
  const router = useRouter();
  const dispatch = useDispatch();

  const lastSetting = useSelector((state: any) => state.game);
  const errorState = useSelector((state: any) => state.error).error;

  const [mapName, setMapName] = useState<string>(lastSetting.mapName);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError_] = useState<string | undefined>(errorState);
  const [update, setUpdate] = useState<number>(0);
  const [rulesConfig, setRulesConfig] = useState<any>(undefined);
  const [rules, setRules] = useState<any>(lastSetting);

  function setError(error: string) {
    setError_(error);
    setUpdate((prev) => prev + 1);
  }

  useEffect(() => {
    async function fetchRules(){
      try {
        const response = await api.get("/game/rules/config");
        const responseData = response.data;
        const nmpz = responseData.filter((rule:any) => rule.key === "nmpz")[0];
        nmpz.name = <span title="No moving, No panning, No zooming"><b>NMPZ</b><FaQuestionCircle className="ml-2 inline" /></span>;
        setRulesConfig(responseData);
        if (lastSetting.map_id === undefined) {
          const defaultRules = await api.get("/session/default");
          dispatch(setGameSettings(defaultRules.data));
          setMapName(defaultRules.data.mapName);
          setRules(defaultRules.data);
        }
      } catch (err) {
        console.error("Failed to fetch rules config:", err);
      } 
    };
    fetchRules();
  }, []);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const startGame = async (event: React.FormEvent) => {
    event.preventDefault();
    {
      !loading && setLoading(true);
      try {
        const response = await api.post("/game/create", rules);
        dispatch(
          setGameSettings({
            ...rules,
            mapName: mapName,
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

  const setSingleRule = (key:string, value:any) =>{
    setRules((prevRules:any) => ({
      ...prevRules,
      [key]: value
    }));

  }

  const addMap = (id: string, name: string) => {
    setIsModalOpen(false);
    setSingleRule("map_id", id);
    setMapName(name);
  };

  if(!rules.map_id || !rulesConfig){
    return <ProtectedRoutes allowDemo={true}><Loading/></ProtectedRoutes>
  }
  

  return (
    <ProtectedRoutes allowDemo={true}>
      <div className="relative">
      <div className="navbar-buffer md:h-0" />
        <div className="flex items-center justify-center min-h-screen text-white p-6 w-full h-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 border-white border-4 shadow-lg rounded-2xl py-6 form-window divide-x divide-x-3">
            
            <div className="w-full px-4 h-full">
              <h2 className="text-xl font-semibold mb-4 text-center">
                Singleplayer
              </h2>
              <div className="mb-4 relative">
                <div
                  className="block mb-2 text-white"
                >
                  Map Name
                </div>
                <button
                  className="game-setup-btn w-full py-2 rounded-lg font-semibold"
                  disabled={loading}
                  onClick={() => {
                    !loading && setIsModalOpen(true);
                  }}
                >
                  <FaMagnifyingGlass className="inline" /> {mapName}
                </button>
              </div>
              {
                rulesConfig && rulesConfig.map((data:any) => (
                  <div className="mb-6" key={data.key}>
                    <UserInput
                      key={data.key}
                      inputType={data.display}
                      data={data}
                      value={rules ? rules[data.key] : undefined}
                      setError={setError}
                      setInput={(input: any) => setSingleRule(data.key, input)}
                      editable={true}
                    />
                  </div>
                ))
              }
              <button
                disabled={loading}
                className="game-setup-btn w-full py-2 rounded-lg font-semibold"
                onClick={startGame}
              >
                Start Game
              </button>
            </div>
            <div className="border-t-2 md:border-t-0">
              <Daily loading={loading} setLoading={setLoading} />
            </div>
            <div className="border-t-2 md:border-t-0">
              <Multiplayer
                loading={loading}
                setLoading={setLoading}
                setError={setError}
              />
            </div>
          </div>
        </div>
        <Popup type="error" update={update}>
          {error}
        </Popup>
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
    </ProtectedRoutes>
  );
}
