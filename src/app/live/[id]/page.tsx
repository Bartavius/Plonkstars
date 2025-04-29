"use client";
import ProtectedRoutes from "@/app/ProtectedRoutes";
import GamePlay from "@/components/game/gameplay/gameplay";
import Loading from "@/components/loading";
import api from "@/utils/api";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import useLiveSocket from "../liveSocket";
import { useSelector } from "react-redux";

export default function Page() {
  const [data,setData] = useState<any>();
  const [lat, setLat] = useState<number>();
  const [lng, setLng] = useState<number>();
  const [canGuess, setCanGuess] = useState<boolean>(true);

  const code = useSelector((state: any) => state.party).code;
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const state = await api.get(`/game/state?id=${id}`);
        if (state.data.state === "waiting") {
          setCanGuess(false);
          setLat(state.data.lat);
          setLng(state.data.lng);
        }
        const response = await api.get(`/game/round?id=${id}`);
        setData(response.data);
      } catch (err: any) {
        console.log(err);
      }
    };
    fetchLocation(); //render loading screen later
  }, []);

  const socket = useLiveSocket({id:id?.toString()??""})

  async function ping(){
    await api.post("/game/ping",{id});
  }

  if (!data) {
    return <Loading />;
  }

  return (
    <ProtectedRoutes>
      <GamePlay 
        userLat={lat}
        userLng={lng}
        canGuess={canGuess}
        correctLat={data.lat}
        correctLng={data.lng}
        time={new Date(data.time)}
        timeLimit={data.time_limit}
        roundNumber={data.round}
        totalScore={data.total}
        NMPZ={data.nmpz}
        mapBounds={data.map_bounds}
        onTimeout={ping}
      />
    </ProtectedRoutes>
  );
}