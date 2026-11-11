"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BsInfinity } from "react-icons/bs";
import { useDispatch } from "react-redux";

import { ProtectedRoutes } from "@/features/auth/components/protected-routes";
import { api } from "@/services/api";
import { setError } from "@/store/error-slice";
import "@/app/game.css";
import { Loading } from "@/components/primitives/loading";
import { MapCard } from "@/features/maps/components/map-card";
import { getErrorResponse } from "@/services/api-error";
import type { SessionInfo } from "@/app/game/_types/session-info";

export default function ChallengePage() {
  const [data, setData] = useState<SessionInfo>();
  const [loading, setLoading] = useState<boolean>(false);

  const sessionID = useParams().id;
  const router = useRouter();
  const dispatch = useDispatch();

  async function getData() {
    try {
      const res = await api.get<SessionInfo>(`/session/info?id=${sessionID}`);
      if (res.data.state === "FINISHED") {
        router.push(`/game/${sessionID}/summary`);
        return;
      }
      setData(res.data);
    } catch (error) {
      dispatch(setError(getErrorResponse(error)?.data?.error ?? "Session not found"));
      router.push("/game");
    }
  }

  useEffect(() => {
    getData();
  }, []);

  if (!data) {
    return <Loading />;
  }
  const rules = data.rules;
  const map = data.map;

  return (
    <ProtectedRoutes>
      <div className="flex items-center justify-center text-left w-full h-full flex-col">
        <div className="text-[3rem] font-bold mb-4">You got challenged by {data.host}</div>
        <div className="w-1/2 bg-dark-blue p-4 rounded-2xl border-white border-4 text-white">
          <MapCard
            map={map}
            onClick={() => {
              setLoading(true);
              router.push(`/map/${map.id}`);
            }}
          />
          <div className="text-[2rem] font-bold mb-4">Rounds: {rules.rounds}</div>
          <div className="text-[2rem] font-bold mb-4">
            Time: {rules.time === -1 ? <BsInfinity /> : `${rules.time} seconds`}
          </div>
          <div className="text-[2rem] font-bold mb-4">NMPZ: {rules.NMPZ ? "Yes" : "No"}</div>
          <div className="w-full h-[10vh]">
            <button
              onClick={() => {
                setLoading(true);
                router.push(`/game/${sessionID}/join`);
              }}
              className="h-[70%] w-full bg-plonk-stars-red justify-center items-center text-plonk-stars-white border border-solid border-plonk-stars-white transition-all duration-150 ease-[ease-in-out] rounded-[2rem] [&:not(:disabled)]:hover:-translate-y-[0.1rem] [&:not(:disabled)]:hover:[scale:1.03] [&:not(:disabled)]:hover:bg-plonk-stars-red [&:not(:disabled)]:hover:text-plonk-stars-white [&:not(:disabled)]:hover:border [&:not(:disabled)]:hover:border-solid [&:not(:disabled)]:hover:border-plonk-stars-white disabled:opacity-50 disabled:![background:#000] disabled:cursor-not-allowed"
              disabled={loading}
            >
              {data.state === "NOT_STARTED" ? "Play" : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoutes>
  );
}
