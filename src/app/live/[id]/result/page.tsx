"use client";

import dynamic from "next/dynamic";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

import { useLiveSocket } from "@/app/live/_hooks/use-live-socket";
import { Loading } from "@/components/primitives/loading";
import { Popup } from "@/components/primitives/popup";
import { ProtectedRoutes } from "@/features/auth/components/protected-routes";
import { UserIcon } from "@/features/user/components/user-icon";
import { api } from "@/services/api";
import { useAppSelector } from "@/store/use-app-selector";
import type { RoundResults } from "@/features/challenge/types/round-results";
import type { UserProfile } from "@/features/user/types/user-profile";
import type { LiveState } from "@/app/live/_types/live-state";

const Results = dynamic(
  () => import("@/features/challenge/components/results").then((m) => m.Results),
  { ssr: false },
);

export default function GameResultPage() {
  const params = useParams();
  const matchId = params.id;
  const code = useAppSelector((state) => state.party).code;

  const [data, setData] = useState<RoundResults>();
  const [state, setState] = useState<LiveState>();
  const [isHost, setIsHost] = useState(false);
  const isHostRef = useRef<boolean>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [preload, setPreload] = useState<boolean>(true);
  const [popupElement, setPopupElement] = useState<React.ReactNode>();

  useEffect(() => {
    const getResults = async () => {
      try {
        const state = await api.get<LiveState>(`/game/state?id=${matchId}`);
        setState(state.data);
        const response = await api.get<RoundResults>(`/game/results?id=${matchId}`);
        setData(response.data);

        const isHost = await api.get(`/party/host?code=${code}`);
        setIsHost(isHost.data.is_host);
        isHostRef.current = isHost.data.is_host;
        setPreload(false);
      } catch (err) {}
    };
    getResults();
  }, []);

  const socketFunctions = {
    join_game: (data: UserProfile) => {
      setPopupElement(
        <div className="flex flex-col justify-center items-center">
          <UserIcon className="w-[1rem]" data={data.user_cosmetics} />
          <div>{data.username} joined</div>
        </div>,
      );
    },
  };

  const socket = useLiveSocket({
    id: matchId?.toString() ?? "",
    state,
    functions: socketFunctions,
  });

  async function nextRound() {
    if (isHostRef.current && !loading) {
      setLoading(true);
      await api.post("/game/next", { id: matchId });
    }
  }

  if (preload) {
    return (
      <ProtectedRoutes>
        <Loading />
      </ProtectedRoutes>
    );
  }

  const centerText = isHost ? (
    loading ? (
      <div>Loading next round...</div>
    ) : undefined
  ) : (
    <div>Waiting for host...</div>
  );
  return (
    <ProtectedRoutes>
      <Popup>{popupElement}</Popup>
      <Suspense fallback={<Loading />}>
        <Results
          onClick={nextRound}
          this_user={data!.this_user}
          users={data!.users}
          roundNumber={data!.round}
          correct={data!.correct}
          centerText={centerText}
        />
      </Suspense>
    </ProtectedRoutes>
  );
}
