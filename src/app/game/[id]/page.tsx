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

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await api.post(`/game/round`,{id:id});
        setData(response.data);
      } catch (err: any) {
        console.log(err);
        if (err.response?.status == 404) {
          router.push("/game");
        }
        if (err.response?.data?.error == "No more rounds are available") {
          router.push(`/game/${id}/summary`);
        }
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
        guessRedirect={`/game/${id}/result?round=${data.round}`}
        correctLat={data.lat}
        correctLng={data.lng}
        time={new Date(data.time)}
        timeLimit={data.time_limit}
        roundNumber={data.round}
        totalScore={data.total}
        NMPZ={data.nmpz}
        mapBounds={data.map_bounds}
      />
    </ProtectedRoutes>
  );
}