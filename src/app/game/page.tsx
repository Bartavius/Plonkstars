"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useDispatch } from "react-redux";

import "@/app/game.css";
import { Modal } from "@/components/primitives/modal";
import { ProtectedRoutes } from "@/features/auth/components/protected-routes";
import { MapSearch } from "@/features/maps/components/map-search";
import { Popup } from "@/components/primitives/popup";
import { UserInput } from "@/components/primitives/user-input";
import { Loading } from "@/components/primitives/loading";
import { api } from "@/services/api";
import { clearError } from "@/store/error-slice";
import { setGameSettings } from "@/store/game-slice";
import { useAppSelector } from "@/store/use-app-selector";
import type { RuleConfig } from "@/features/game/types/rule-config";
import type { RuleInputValue } from "@/features/game/types/rule-input-value";
import { getErrorResponse } from "@/services/api-error";

import { Daily } from "./_components/daily";
import { HowToPlayModal } from "./_components/how-to-play-modal";
import { Multiplayer } from "./_components/multiplayer";
import type { GameRules } from "./_types/game-rules";
import type { GameSettings } from "./_types/game-settings";

export default function Game() {
  const router = useRouter();
  const dispatch = useDispatch();

  const lastSetting = useAppSelector((state) => state.game);
  const errorState = useAppSelector((state) => state.error).error;

  const [mapName, setMapName] = useState<string | undefined>(lastSetting.mapName);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError_] = useState<string | undefined>(errorState);
  const [update, setUpdate] = useState<number>(0);
  const [rulesConfig, setRulesConfig] = useState<RuleConfig[]>();
  const [rules, setRules] = useState<GameRules>(lastSetting);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);

  function setError(error: string) {
    setError_(error);
    setUpdate((prev) => prev + 1);
  }

  useEffect(() => {
    async function fetchRules() {
      try {
        const response = await api.get<RuleConfig[]>("/game/rules/config");
        const responseData = response.data;
        const nmpz = responseData.filter((rule) => rule.key === "nmpz")[0];
        nmpz.name = (
          <span title="No moving, No panning, No zooming">
            <b>NMPZ</b>
            <FaQuestionCircle className="ml-2 inline" />
          </span>
        );
        setRulesConfig(responseData);
        if (lastSetting.map_id === undefined) {
          const defaultRules = await api.get<GameSettings>("/session/default");
          dispatch(setGameSettings(defaultRules.data));
          setMapName(defaultRules.data.mapName);
          setRules(defaultRules.data);
        }
      } catch (err) {
        console.error("Failed to fetch rules config:", err);
      }
    }
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
          }),
        );
        const { id } = response.data;

        router.push(`/game/${id}/join`);
      } catch (err) {
        setError(getErrorResponse(err)?.data?.error || "Error starting game");
        setLoading(false);
      }
    }
  };

  const setSingleRule = (key: keyof GameRules, value: RuleInputValue) => {
    setRules((prevRules) => ({
      ...prevRules,
      [key]: value,
    }));
  };

  const addMap = (id: string, name: string) => {
    setIsModalOpen(false);
    setSingleRule("map_id", id);
    setMapName(name);
  };

  if (!rules.map_id || !rulesConfig) {
    return (
      <ProtectedRoutes allowDemo={true}>
        <Loading />
      </ProtectedRoutes>
    );
  }

  return (
    <ProtectedRoutes allowDemo={true}>
      <div className="relative">
        <div className="navbar-buffer md:h-0" />
        <div className="flex items-center justify-center min-h-screen text-white p-6 w-full h-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 border-white border-4 shadow-lg rounded-2xl py-6 form-window divide-x divide-x-3">
            <div className="w-full px-4 h-full">
              <h2 className="text-xl font-semibold mb-4 text-center">Singleplayer</h2>
              <div className="mb-4 relative">
                <div className="block mb-2 text-white">Map Name</div>
                <button
                  className="bg-plonk-stars-red text-plonk-stars-white transition-all duration-200 ease-[ease-in-out] hover:[filter:brightness(90%)] w-full py-2 rounded-lg font-semibold"
                  disabled={loading}
                  onClick={() => {
                    !loading && setIsModalOpen(true);
                  }}
                >
                  <FaMagnifyingGlass className="inline" /> {mapName}
                </button>
              </div>
              {rulesConfig &&
                rulesConfig.map((data) => (
                  <div className="mb-6" key={data.key}>
                    <UserInput
                      key={data.key}
                      inputType={data.display}
                      data={data}
                      value={rules ? rules[data.key] : undefined}
                      setError={setError}
                      setInput={(input) => setSingleRule(data.key, input)}
                      editable={true}
                    />
                  </div>
                ))}
              <button
                disabled={loading}
                className="bg-plonk-stars-red text-plonk-stars-white transition-all duration-200 ease-[ease-in-out] hover:[filter:brightness(90%)] w-full py-2 rounded-lg font-semibold"
                onClick={startGame}
              >
                Start Game
              </button>
            </div>
            <div className="border-t-2 md:border-t-0">
              <Daily loading={loading} setLoading={setLoading} />
            </div>
            <div className="border-t-2 md:border-t-0">
              <Multiplayer loading={loading} setLoading={setLoading} setError={setError} />
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
            <Link href="/map" className="link">
              Click here
            </Link>
          </div>
          <MapSearch mapSelect={addMap} pageSize={12} bodySize="60vh" />
        </Modal>

        {!isHowToPlayOpen && (
          <div className="fixed bottom-4 right-8 z-50">
            <button
              className="
                px-4 py-2 text-lg font-semibold rounded-lg shadow-lg 
                bg-plonk-stars-red text-plonk-stars-white transition-all duration-200 ease-[ease-in-out] hover:[filter:brightness(90%)]
              "
              onClick={() => setIsHowToPlayOpen(true)}
            >
              How to Play
            </button>
          </div>
        )}
        <HowToPlayModal onClose={() => setIsHowToPlayOpen(false)} open={isHowToPlayOpen} />
      </div>
    </ProtectedRoutes>
  );
}
