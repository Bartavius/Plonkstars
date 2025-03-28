"use client";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { useSelector } from "react-redux";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import ProtectedRoutes from "@/app/ProtectedRoutes";
import Loading from "@/components/loading";
import Summary from "@/components/game/summary";

interface Location {
  lat: number;
  lng: number;
}

export default function SummaryPage() {
  //will need to set total number of rounds that pop up (click more at the bottom), limit of...10 per?
  const [locations, setLocations] = useState<Location[]>([]);
  const [guesses, setGuesses] = useState<any[]>([]);
  const [score, setScore] = useState<any>([]);
  const [data, setData] = useState<any>();
  const [user, setUser] = useState<any>();
  
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const MAPID = params.id;

  const goBack = () => {
    router.push(`/map/${MAPID}/leaderboard`);
  }

  useEffect(() => {
    if (!params.id) {
      return;
    }
    const fetchGuesses = async () => {
      try {
        const res = await api.get(`/map/leaderboard/game?id=${MAPID}&user=${searchParams.get("user")}${searchParams.get("nmpz") ? `&nmpz=${searchParams.get("nmpz")}` : ""}`);
        const scores = {
          score:res.data.score,
          user:res.data.user,
          distance:res.data.distance,
          time:res.data.time
        };

        const guesses = res.data.guesses.map((round:any) => {
          return [{...round, user:res.data.user}];
        });

        setGuesses(guesses);
        setScore(scores);
        setLocations(res.data.rounds);
        setUser(res.data.user);
        setData(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchGuesses();
  }, [params.id]);

  if (!data) {
    return <Loading/>;
  }

  return (
    <ProtectedRoutes>
      <div className="summary-container">
        <Summary locations={locations} guesses={guesses} scores={[score]} user={user}>
          <div className="grid grid-cols-3 gap-4 w-full">
            <div className="flex justify-right">
              <button className="btn-selected" onClick={goBack}>
                Go Back
              </button>
            </div>
            <h2 className="text-3xl font-bold text-center text-dark flex-1">
              Game Summary
            </h2>
            <div className= "flex justify-end">
              
            </div>
          </div>
        </Summary>
      </div>
    </ProtectedRoutes>
  );
}
