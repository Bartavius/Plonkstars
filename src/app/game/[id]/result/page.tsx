"use client";

import dynamic from "next/dynamic";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { Loading } from "@/components/primitives/loading";
import { ProtectedRoutes } from "@/features/auth/components/protected-routes";
import { isDemo } from "@/features/auth/services/session";
import { api } from "@/services/api";
import { getErrorResponse } from "@/services/api-error";
import { setError } from "@/store/error-slice";
import { useAppSelector } from "@/store/use-app-selector";
import type { ChallengeState } from "@/app/game/_types/challenge-state";
import type { RoundResults } from "@/features/challenge/types/round-results";

const Results = dynamic(
  () => import("@/features/challenge/components/results").then((m) => m.Results),
  {
    ssr: false,
  },
);

export default function GameResultPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const matchId = params.id;
  const roundNumber = parseInt(searchParams.get("round") || "-1");

  const [data, setData] = useState<RoundResults>();
  const [state, setState] = useState<ChallengeState>();
  const [loading, setLoading] = useState<boolean>(false);
  const [preloading, setPreloading] = useState<boolean>(true);

  const demo = isDemo();
  const demoAvatar = useAppSelector((state) => state.demoAvatar);

  useEffect(() => {
    if (roundNumber === -1) {
      return;
    }
    const getResults = async () => {
      try {
        const state = await api.get<ChallengeState>(`/game/state?id=${matchId}`);
        setState(state.data);
        const response = await api.get<RoundResults>(
          `/game/results?id=${matchId}&round=${roundNumber}`,
        );
        setData(response.data);
        setPreloading(false);
      } catch (err) {
        dispatch(setError(getErrorResponse(err)?.data?.error || "Error getting results"));
        router.push("/game");
      }
    };
    getResults();
  }, []);

  async function nextRound() {
    if (state!.state === "FINISHED") {
      router.push(`/game/${matchId}/summary`);
      return;
    }
    if (state!.state === "RESULTS") {
      setLoading(true);
      await api.post("/game/next", { id: matchId });
      router.push(`/game/${matchId}`);
    }
  }

  if (roundNumber === -1) {
    return <div>Invalid round number</div>;
  }

  if (preloading || loading) {
    return (
      <ProtectedRoutes allowDemo={true}>
        <Loading />
      </ProtectedRoutes>
    );
  }

  return (
    <ProtectedRoutes allowDemo={true}>
      <Suspense fallback={<Loading />}>
        <Results
          onClick={nextRound}
          this_user={data!.this_user}
          users={data!.users.map((user) =>
            user.user.username === "demo" && demo
              ? { ...user, user: { ...user.user, user_cosmetics: demoAvatar } }
              : user,
          )}
          roundNumber={data!.round}
          correct={data!.correct}
        />
      </Suspense>
    </ProtectedRoutes>
  );
}
