"use client";
import ProtectedRoutes from "@/app/ProtectedRoutes";
import GamePlay from "@/components/game/challenge/gameplay/gameplay";
import Loading from "@/components/loading";
import calculateOffset from "@/components/time";
import api from "@/utils/api";
import { useRouter,useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function Page() {
  const [data,setData] = useState<any>();
  const [offset,setOffset] = useState<number>();
  const [loading, setLoading] = useState<boolean>(true);
  const [userLat, setUserLat] = useState<number|undefined>(undefined);
  const [userLng, setUserLng] = useState<number|undefined>(undefined);
  const [cosmetics, setCosmetics] = useState<any>();
  const [score, setScore] = useState<number>(0);

  const router = useRouter();
  const params = useParams();
  const id = params.id;

  async function pushCorrect(data:any){
    if (data.state === "RESULTS") {
      router.push(`/game/${id}/result?round=${data.round}`);
      return true;
    } 
    else if (data.state === "FINISHED") {
      router.push(`/game/${id}/summary`);
      return true;
    } 
    else if (data.state === "RESTRICTED") {
      router.push(`/game`);
      return true;
    }
    else if (data.state === "NOT_STARTED") {
      await api.post("/game/play", { id }).catch(() => {});
      await api.post("/game/next", {id});
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
        if (await pushCorrect(state.data)){
          return;
        }
        setUserLat(state.data.lat);
        setUserLng(state.data.lng);
        setScore(state.data.score);
        const offset = await calculateOffset(getRound);
        setOffset(offset);

        const cosmetics = await api.get("/account/avatar");
        setCosmetics(cosmetics.data.user_cosmetics);

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
        totalScore={score}
        NMPZ={data.nmpz}
        mapBounds={data.map_bounds}
        offset={offset}
        onTimeout={() => router.push(`/game/${id}/result?round=${data.round}`)}
        onGuess={() => router.push(`/game/${id}/result?round=${data.round}`)}
        cosmetics={cosmetics}
      />
    </ProtectedRoutes>
  );
}