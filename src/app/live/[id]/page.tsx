"use client";
import ProtectedRoutes from "@/app/ProtectedRoutes";
import GamePlay from "@/components/game/gameplay/gameplay";
import Loading from "@/components/loading";
import api from "@/utils/api";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import useLiveSocket from "../liveSocket";
import Popup from "@/components/Popup";
import UserIcon from "@/components/user/UserIcon";

export default function Page() {
  const [data,setData] = useState<any>();
  const [state,setState] = useState<any>();
  const [guesses,setGuesses] = useState<number>(0);
  const [players,setPlayers] = useState<number>(0);
  const [lat, setLat] = useState<number>();
  const [lng, setLng] = useState<number>();
  const [canGuess, setCanGuess] = useState<boolean>(true);
  const [popupElement, setPopupElement] = useState<React.ReactNode>();

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
            setLat(state.data.lat);
            setLng(state.data.lng);
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
        setGuesses((prev) => prev + 1);
        setPopupElement(
          <div className="flex flex-col justify-center items-center">
            <UserIcon className="w-[1rem]" data={data.user_cosmetics}/>
            <div>{data.username} guessed</div>
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

  async function onPlonk(lat: number, lng: number) {
    await api.post("/game/ping", {
      type:"plonk",
      id,
      lat,
      lng,
    })
  }

  if (!data || !state) {
    return <Loading />;
  }

  const rightFooter = (
    <div className="border border-gray-300 bg-white shadow-md rounded-full text-base font-semibold text-gray-800 mr-4 flex justify-center items-center px-5 py-1.5">
      {guesses}/{players} guesses
    </div>
  )

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
        afterTimeoutFunction={ping}
        rightFooter={canGuess? undefined: rightFooter}
        onGuess={() => setCanGuess(false)}
        onPlonk={onPlonk}
      />
    </ProtectedRoutes>
  );
}