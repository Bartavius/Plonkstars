"use client";
import ProtectedRoutes from "@/app/ProtectedRoutes";
import GamePlay from "@/components/game/gameplay/gameplay";
import Loading from "@/components/loading";
import api from "@/utils/api";
import { useRouter,useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function Page() {
  const [data,setData] = useState<any>();

  const router = useRouter();
  const params = useParams();
  const id = params.id;

  function pushCorrect(data:any){
    if (data.state === "results") {
      router.push(`/game/${id}/result?round=${data.round}`);
      return true;
    } else if (data.state === "finished") {
      router.push(`/game/${id}/summary`);
      return true;
    } else if (data.state === "not_playing"){
      router.push(`/game/${id}`);
      return true;
    }
  }
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const state = await api.get(`/game/state?id=${id}`);
        if (pushCorrect(state.data)){
          return;
        }
        
        const response = await api.get(`/game/round?id=${id}`);
        setData(response.data);
      } catch (err: any) {
        console.log(err);
        if (err.response?.data?.error == "No more rounds are available") {
          router.push(`/game/${id}/summary`);
          return;
        }
        
        router.push("/game");
        
        
      }
    };
    fetchLocation(); //render loading screen later
  }, []);

  if (!data) {
    return <Loading />;
  }

  return (
    <ProtectedRoutes>
      <GamePlay 
        correctLat={data.lat}
        correctLng={data.lng}
        time={new Date(data.time)}
        timeLimit={data.time_limit}
        roundNumber={data.round}
        totalScore={data.total}
        NMPZ={data.nmpz}
        mapBounds={data.map_bounds}
        afterTimeoutFunction={() => router.push(`/game/${id}/result?round=${data.round}`)}
        onGuess={() => router.push(`/game/${id}/result?round=${data.round}`)}
      />
    </ProtectedRoutes>
  );
}