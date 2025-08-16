"use client";
import ProtectedRoutes from "@/app/ProtectedRoutes";
import GamePlay from "@/components/game/challenge/gameplay/gameplay";
import Loading from "@/components/loading";
import calcuateOffset from "@/components/time";
import api from "@/utils/api";
import { useRouter,useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function Page() {
  const [data,setData] = useState<any>();
  const [offset,setOffset] = useState<number>();
  const [loading, setLoading] = useState<boolean>(true);
  const [userLat, setUserLat] = useState<number|undefined>(undefined);
  const [userLng, setUserLng] = useState<number|undefined>(undefined);

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
    return false;
  }

  async function getRound(){
    const response = await api.get(`/game/round?id=${id}`);
    setData(response.data);
    return response;
  }
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const state = await api.get(`/game/state?id=${id}`);
        if (pushCorrect(state.data)){
          return;
        }
        setUserLat(state.data.lat);
        setUserLng(state.data.lng);
        const offset = await calcuateOffset(getRound);
        setOffset(offset);
        setLoading(false);
      } catch (err: any) {
        console.log(err);
        if (err.response?.data?.error == "No more rounds are available") {
          router.push(`/game/${id}/summary`);
          return;
        }
        
        router.push("/game");
      }
    };
    fetchLocation();
  }, []);

  async function onPlonk(lat: number, lng: number) {
    if (!data) return;
    await api.post("/game/ping", {
      id,
      lat,
      lng,
      type: "plonk",
    })
  }
  if (loading) {
    return <Loading />;
  }

  return (
    <ProtectedRoutes>
      <GamePlay 
        userLat={userLat}
        userLng={userLng}
        correctLat={data.lat}
        correctLng={data.lng}
        time={new Date(data.time)}
        timeLimit={data.time_limit}
        roundNumber={data.round}
        totalScore={data.total}
        NMPZ={data.nmpz}
        mapBounds={data.map_bounds}
        onPlonk={onPlonk}
        offset={offset}
        onTimeout={() => router.push(`/game/${id}/result?round=${data.round}`)}
        onGuess={() => router.push(`/game/${id}/result?round=${data.round}`)}
      />
    </ProtectedRoutes>
  );
}