"use client";

import ProtectedRoutes from "@/app/ProtectedRoutes";
import Loading from "@/components/loading";
import api from "@/utils/api";
import dynamic from "next/dynamic";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const Results = dynamic(() => import("@/components/game/results/results"), { ssr: false });

export default function GameResultPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const matchId = params.id;
  const roundNumber = parseInt(searchParams.get("round") || "-1");

  if (roundNumber === -1) {
    return <div>Invalid round number</div>;
  }

  const [data,setData] = useState<any>();
  const [error, setError] = useState<string | undefined>(undefined);
  const [redirect, setRedirect] = useState(`/game/${matchId}`);

  useEffect(() => {
    const getResults = async () => {
      try {
        const state = await api.get(`/game/state?id=${matchId}`);
        if(state.data.state === "finished"){
          setRedirect(`/game/${matchId}/summary`);
        }
        const response = await api.get(
          `/game/results?id=${matchId}&round=${roundNumber}`
        );
        setData(response.data)
      } catch (err: any) {
        setError(err.response?.data?.error || "Error getting results");
      }
    };
    getResults();
  },[])

  if (!data) {
    return <Loading />;
  }

  return (
    <ProtectedRoutes>
      <Suspense fallback={<Loading />}>
        <Results redirect={redirect} this_user={data.this_user} users={data.users} roundNumber={roundNumber} correct={data.correct}/>
      </Suspense>
    </ProtectedRoutes>
  );
}
