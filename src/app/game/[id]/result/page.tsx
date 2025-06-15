"use client";

import ProtectedRoutes from "@/app/ProtectedRoutes";
import Loading from "@/components/loading";
import { setError } from "@/redux/errorSlice";
import api from "@/utils/api";
import dynamic from "next/dynamic";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const Results = dynamic(() => import("@/components/game/challenge/results/results"), {
  ssr: false,
});

export default function GameResultPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const matchId = params.id;
  const roundNumber = parseInt(searchParams.get("round") || "-1");

  if (roundNumber === -1) {
    return <div>Invalid round number</div>;
  }

  const [data, setData] = useState<any>();
  const [state, setState] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [preloading, setPreloading] = useState<boolean>(true);

  useEffect(() => {
    const getResults = async () => {
      try {
        const state = await api.get(`/game/state?id=${matchId}`);
        setState(state.data);
        const response = await api.get(
          `/game/results?id=${matchId}&round=${roundNumber}`
        );
        setData(response.data);
        setPreloading(false);
      } catch (err: any) {
        dispatch(setError(err.response?.data?.error || "Error getting results"));
        router.push("/game");
      }
    };
    getResults();
  }, []);

  async function nextRound() {
    if (state.state === "finished") {
      router.push(`/game/${matchId}/summary`);
      return;
    }
    if (state.state === "results") {
      setLoading(true);
      await api.post("/game/next", { id: matchId });
      router.push(`/game/${matchId}`);
    }
  }

  if (preloading || loading) {
    return <Loading />;
  }

  return (
    <ProtectedRoutes>
      <Suspense fallback={<Loading />}>
        <Results
          onClick={nextRound}
          this_user={data.this_user}
          users={data.users}
          roundNumber={roundNumber}
          correct={data.correct}
        />
      </Suspense>
    </ProtectedRoutes>
  );
}
