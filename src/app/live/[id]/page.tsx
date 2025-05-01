"use client";
import ProtectedRoutes from "@/app/ProtectedRoutes";
import GamePlay from "@/components/game/gameplay/gameplay";
import Loading from "@/components/loading";
import api from "@/utils/api";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import useLiveSocket from "../liveSocket";
import { useSelector } from "react-redux";
import Popup from "@/components/Popup";

export default function Page() {
  const [data,setData] = useState<any>();
  const [state,setState] = useState<any>();
  const [guesses,setGuesses] = useState<number>(0);
  const [players,setPlayers] = useState<number>(0);
  const [lat, setLat] = useState<number>();
  const [lng, setLng] = useState<number>();
  const [canGuess, setCanGuess] = useState<boolean>(true);
  const [popupElement, setPopupElement] = useState<React.ReactNode>();

  const code = useSelector((state: any) => state.party).code;
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const state = await api.get(`/game/state?id=${id}`);
        switch(state.data.state) {
          case "waiting":
            setCanGuess(false);
            setLat(state.data.lat);
            setLng(state.data.lng);
          case "playing":
            setPlayers(state.data.player);
            setGuesses(state.data.guess);
        }

        setState(state.data);

        const response = await api.get(`/game/round?id=${id}`);
        setData(response.data);
      } catch (err: any) {
        console.log(err);
      }
    };
    fetchLocation(); //render loading screen later
  }, []);

  const socketFunctions = {
      "guess": (data: any) => {
        guesses && setGuesses(guesses + 1);
        setPopupElement(
          <div>
            {data.username} guessed
          </div>
        );
      },
  }

  const socket = useLiveSocket({
    id:id?.toString()??"",
    state,
    functions: socketFunctions,
  })

  async function ping(){
    await api.post("/game/ping",{id});
  }

  if (!data || !state) {
    return <Loading />;
  }

  return (
    <ProtectedRoutes>
      <Popup>
        {popupElement}
      </Popup>
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