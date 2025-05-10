"use client";

import ProtectedRoutes from "@/app/ProtectedRoutes";
import Loading from "@/components/loading";
import api from "@/utils/api";
import dynamic from "next/dynamic";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const Results = dynamic(() => import("@/components/game/results/results"), {
  ssr: false,
});

export default function GameResultPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const matchId = params.id;
  const roundNumber = parseInt(searchParams.get("round") || "-1");

  if (roundNumber === -1) {
    return <div>Invalid round number</div>;
  }

  const [data, setData] = useState<any>();
  const [state, setState] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [maps, setMaps] = useState<any[]>([]);

  useEffect(() => {
    const getMaps = async () => {
      // TODO: get maps user has permission to edit
      // TODO: refactor eventually so that it checks for permissions instead of just checking for map creators
      const response = await api.get(`/account/permissions/map-edit`);
      setMaps(response.data);
    };
    const getResults = async () => {
      try {
        const state = await api.get(`/game/state?id=${matchId}`);
        setState(state.data);
        const response = await api.get(
          `/game/results?id=${matchId}&round=${roundNumber}`
        );
        setData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || "Error getting results");
        router.push("/game");
      }
    };
    getResults();
    getMaps();
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

  if (!data || loading) {
    return <Loading />;
  }

  return (
    <ProtectedRoutes>
      <Suspense fallback={<Loading />}>
        <Results
          onClick={nextRound}
          this_user={data.this_user}
          users={data.users}
          maps={maps}
          roundNumber={roundNumber}
          correct={data.correct}
        />
      </Suspense>
    </ProtectedRoutes>
  );
}
