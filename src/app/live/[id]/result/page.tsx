"use client";

import ProtectedRoutes from "@/app/ProtectedRoutes";
import Loading from "@/components/loading";
import api from "@/utils/api";
import dynamic from "next/dynamic";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useLiveSocket from "../../liveSocket";

const Results = dynamic(() => import("@/components/game/results/results"), { ssr: false });

export default function GameResultPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const matchId = params.id;
  const roundNumber = parseInt(searchParams.get("round") || "-1");
  const code = useSelector((state: any) => state.party).code;


  if (roundNumber === -1) {
    return <div>Invalid round number</div>;
  }

  const [data,setData] = useState<any>();
  const [error, setError] = useState<string | undefined>(undefined);
  const [state,setState] = useState<any>();
  const [isHost, setIsHost] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getResults = async () => {
      try {
        const state = await api.get(`/game/state?id=${matchId}`);
        setState(state.data);
        const response = await api.get(
          `/game/results?id=${matchId}&round=${roundNumber}`
        );
        setData(response.data)

        const isHost = await api.get(`/party/host?code=${code}`);
        setIsHost(isHost.data.is_host);

        
      } catch (err: any) {
        setError(err.response?.data?.error || "Error getting results");
      }
    };
    getResults();
  },[]);

  const socket = useLiveSocket({id: matchId?.toString() ?? "",state});

  async function nextRound() {
    if (state.state === "finished") {
      router.push(`/live/${matchId}/summary`);
      return;
    }
    if (state.state === "results" && isHost){
      setLoading(true);
      await api.post("/game/next", {id:matchId});
    }
  }

  if (!data){
    return <Loading />;
  }

  const centerText = state.state === "finished"? undefined: (isHost ? (loading?<div>Loading next round...</div>:undefined) : <div>Waiting for host...</div>)

  return (
    <ProtectedRoutes>
      <Suspense fallback={<Loading />}>
        <Results 
          onClick={nextRound} 
          this_user={data.this_user} 
          users={data.users} 
          roundNumber={roundNumber} 
          correct={data.correct} 
          centerText={centerText}
        />
      </Suspense>
    </ProtectedRoutes>
  );
}
