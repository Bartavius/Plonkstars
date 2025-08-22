"use client";

import ProtectedRoutes from "@/app/ProtectedRoutes";
import Loading from "@/components/loading";
import api from "@/utils/api";
import dynamic from "next/dynamic";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import useLiveSocket from "../../liveSocket";
import Popup from "@/components/Popup";
import UserIcon from "@/components/user/UserIcon";

const Results = dynamic(() => import("@/components/game/challenge/results/results"), { ssr: false });

export default function GameResultPage() {
  const params = useParams();
  const matchId = params.id;
  const code = useSelector((state: any) => state.party).code;


  const [data,setData] = useState<any>();
  const [state,setState] = useState<any>();
  const [isHost, setIsHost] = useState(false);
  const isHostRef = useRef<boolean>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [preload, setPreload] = useState<boolean>(true);
  const [popupElement, setPopupElement] = useState<React.ReactNode>();
  
  useEffect(() => {
    const getResults = async () => {
      try {
        const state = await api.get(`/game/state?id=${matchId}`);
        setState(state.data);
        const response = await api.get(
          `/game/results?id=${matchId}`
        );
        setData(response.data)

        const isHost = await api.get(`/party/host?code=${code}`);
        setIsHost(isHost.data.is_host);
        isHostRef.current = isHost.data.is_host;
        setPreload(false);
      } catch (err: any) {

      }
    };
    getResults();
  },[]);

  const socketFunctions = {
    join_game: (data:any) =>{ 
      setPopupElement(
        <div className="flex flex-col justify-center items-center">
          <UserIcon className="w-[1rem]" data={data.user_cosmetics}/>
          <div>{data.username} joined</div>
        </div>
      );
    }
  }

  const socket = useLiveSocket({
    id: matchId?.toString() ?? "",
    state, 
    functions:socketFunctions
  });

  async function nextRound() {
    if (isHostRef.current && !loading){
      setLoading(true);
      await api.post("/game/next", {id:matchId});
    }
  }


  if (preload) {
    return <Loading />;
  }

  const centerText = isHost ? (loading?<div>Loading next round...</div>:undefined) : <div>Waiting for host...</div>
  return (
    <ProtectedRoutes>
      <Popup>
        {popupElement}
      </Popup>
      <Suspense fallback={<Loading />}>
        <Results 
          onClick={nextRound} 
          this_user={data.this_user} 
          users={data.users} 
          roundNumber={data.round} 
          correct={data.correct} 
          centerText={centerText}
        />
      </Suspense>
    </ProtectedRoutes>
  );
}
