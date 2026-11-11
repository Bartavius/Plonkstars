"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BsInfinity } from "react-icons/bs";
import { useDispatch } from "react-redux";

import { ProtectedRoutes } from "@/features/auth/components/protected-routes";
import { api } from "@/services/api";
import { setError } from "@/store/error-slice";
import "./page.css";
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
      <div className="centered-elements">
        <div className="challenge-title">You got challenged by {data.host}</div>
        <div className="session-info-box">
          <MapCard
            map={map}
            onClick={() => {
              setLoading(true);
              router.push(`/map/${map.id}`);
            }}
          />
          <div className="challenge-text">Rounds: {rules.rounds}</div>
          <div className="challenge-text">
            Time: {rules.time === -1 ? <BsInfinity /> : `${rules.time} seconds`}
          </div>
          <div className="challenge-text">NMPZ: {rules.NMPZ ? "Yes" : "No"}</div>
          <div className="button-wrapper">
            <button
              onClick={() => {
                setLoading(true);
                router.push(`/game/${sessionID}/join`);
              }}
              className="game-button"
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
