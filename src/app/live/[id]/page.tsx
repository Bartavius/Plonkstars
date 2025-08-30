"use client";
import ProtectedRoutes from "@/app/ProtectedRoutes";
import GamePlay from "@/components/game/challenge/gameplay/gameplay";
import Loading from "@/components/loading";
import api from "@/utils/api";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import useLiveSocket from "../liveSocket";
import Popup from "@/components/Popup";
import UserIcon from "@/components/user/UserIcon";
import calcuateOffset from "@/components/time";

export default function Page() {
  const [round,setRound] = useState<any>();
  const [state,setState] = useState<any>();
  const [guesses,setGuesses] = useState<number>(0);
  const [players,setPlayers] = useState<number>(0);
  const [lat, setLat] = useState<number>();
  const [lng, setLng] = useState<number>();
  const [canGuess, setCanGuess] = useState<boolean>(true);
  const [cosmetics, setCosmetics] = useState<any>(null);
  const [popupElement, setPopupElement] = useState<React.ReactNode>();
  const [offset, setOffset] = useState<number>();
  const [loading, setLoading] = useState<boolean>(true);

  const params = useParams();
  const id = params.id;

  async function getRound(){
    const response = await api.get(`/game/round?id=${id}`);
    setRound(response.data);
    return response;
  }
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const state = await api.get(`/game/state?id=${id}`);
        setCanGuess(!state.data.guessed);
        setPlayers(state.data.player);
        setGuesses(state.data.guess);
        setLat(state.data.lat);
        setLng(state.data.lng);
        setState(state.data);

        const offset = await calcuateOffset(getRound)
        setOffset(offset);

        const cosmetics = await api.get("/account/avatar");
        setCosmetics(cosmetics.data.user_cosmetics);

        setLoading(false);
        
      } catch (err: any) {
        console.log(err);
      }
    };
    fetchLocation(); //render loading screen later
  }, []);



  const socketFunctions = {
      guess: (data: any) => {
        setGuesses((prev) => prev + 1);
        setPopupElement(
          <div className="flex flex-col justify-center items-center">
            <UserIcon className="w-[1rem]" data={data.user_cosmetics}/>
            <div>{data.username} guessed</div>
          </div>
        );
      },
      join_game: (data: any) => {
        setPlayers((prev) => prev + 1);
        setPopupElement(
          <div className="flex flex-col justify-center items-center">
            <UserIcon className="w-[1rem]" data={data.user_cosmetics}/>
            <div>{data.username} joined</div>
          </div>
        );
      }
  }

  const socket = useLiveSocket({
    id:id?.toString()??"",
    state,
    functions: socketFunctions,
  })

  if (loading) {
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
        correctLat={round.lat}
        correctLng={round.lng}
        time={new Date(round.time)}
        timeLimit={round.time_limit}
        roundNumber={round.round}
        totalScore={state.score}
        NMPZ={round.nmpz}
        mapBounds={round.map_bounds}
        rightFooter={canGuess? undefined: rightFooter}
        onGuess={() => setCanGuess(false)}
        offset={offset}
        cosmetics={cosmetics}
      />
    </ProtectedRoutes>
  );
}