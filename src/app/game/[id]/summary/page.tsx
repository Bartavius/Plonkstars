"use client";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import ProtectedRoutes from "@/app/ProtectedRoutes";
import Loading from "@/components/loading";
import Summary from "@/components/game/summary";

interface Location {
  lat: number;
  lng: number;
}

export default function SummaryPage() {
  //will need to set total number of rounds that pop up (click more at the bottom), limit of...10 per?
  const previousGame = useSelector((state: any) => state.game);
  const [locations, setLocations] = useState<Location[]>([]);
  const [user, setUser] = useState<string>("");
  const [guesses, setGuesses] = useState<any[]>([]);
  const [scores, setScores] = useState<any[]>([]);
  const [data, setData] = useState<any>();
  
  const params = useParams();
  const router = useRouter();


  const startNewGame = async () => {
    try {
      const response = await api.post("/game/create", {
        rounds: previousGame.rounds,
        time: previousGame.seconds,
        map: { id: previousGame.mapId },
        nmpz: previousGame.NMPZ,
      });
      const { id } = response.data;
      await api.post("/game/play", { id });
      const gameUrl = `/game/${id}`;
      router.push(gameUrl);
    } catch (err: any) {
      console.error(err);
    }
  };

  const gameMenu = () => {
    router.push("/game");
  }

  useEffect(() => {
    if (!params.id) {
      return;
    }
    const fetchGuesses = async () => {
      try {
        const res = await api.get(`/map/summary?session=${params.id}`);
        const guesses = [...Array(res.data.rounds.length).keys()].map((index) => {
          return res.data.users.map((user:any) => {
            return {...user.rounds[index],user:user.user};
          })
        })
        const scores = res.data.users.map((user:any) => {
          return {score:user.score,user:user.user,distance:user.distance,time:user.time};
        })
        setGuesses(guesses);
        setScores(scores);
        setLocations(res.data.rounds);
        setUser(res.data.this_user);
        setData(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchGuesses();
  }, [params.id]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        startNewGame();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!data) {
    return <Loading/>;
  }

  return (
    <ProtectedRoutes>
      <div className="summary-container">
        <Summary locations={locations} guesses={guesses} scores={scores} user={user}>
          <div className="grid grid-cols-3 gap-4 w-full">
            <div className="flex justify-right">
              <button className="btn-selected" onClick={gameMenu}>
                Main Menu
              </button>
            </div>
            <h2 className="text-3xl font-bold text-center text-dark flex-1">
              Game Summary
            </h2>
            <div className= "flex justify-end">
              <button className="ml-1 btn-primary" onClick={startNewGame}>
                Next Game
              </button>
            </div>
          </div>
        </Summary>
      </div>
    </ProtectedRoutes>
  );
}
