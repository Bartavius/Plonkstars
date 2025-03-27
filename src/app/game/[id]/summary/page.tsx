"use client";
import "./summary.css";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import ProtectedRoutes from "@/app/ProtectedRoutes";
import Loading from "@/components/loading";
import { setPrevRedirect } from "@/redux/gameSlice";

const BasicMapResult = dynamic(
  () => import("@/components/maps/BasicMapResult"),
  { ssr: false }
);

interface Location {
  lat: number;
  lng: number;
}

interface Guess {
  user: string;
  score: number;
  distance: number | null;
  time: number | null;
  lat: number | null;
  lng: number | null;
}
export default function Summary() {
  const prevRedirect = useSelector((state: any) => state.game.prevRedirect);

  //will need to set total number of rounds that pop up (click more at the bottom), limit of...10 per?
  const previousGame = useSelector((state: any) => state.game);
  const [locations, setLocations] = useState<Location[]>([]);
  const [displayedLocation, setDisplayedLocation] = useState<Location[]>([]);
  const [topGuesses, setTopGuesses] = useState<Guess[][]>([]);
  const [userGuesses, setUserGuesses] = useState<Guess[]>([]);
  const [allGuesses, setAllGuesses] = useState<Guess[][]>([]);
  const [displayedGuesses, setDisplayedGuesses] = useState<Guess[][]>([]);
  const [data, setData] = useState<any>();
  const [redirect, setRedirect] = useState<string|undefined>(prevRedirect);
  
  const dispatch = useDispatch();
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    return () => {
      dispatch(setPrevRedirect({prevRedirect:undefined}));
    };
  }, [dispatch]);

  const getUserMap = (top: Guess[], user: Guess) => {
    if (!top || !user) {
      return [{ lat: 0, lng: 0 }];
    }
    let userIn = false;
    let copy = [...top];
    for (let i = 0; i < copy.length; i++) {
      if (copy[i].user === user.user) {
        userIn = true;
        break;
      }
    }
    if (!userIn) {
      copy.push(user);
    }
    return copy;
  };

  const startNewGame = async () => {
    try {
      const response = await api.post("/game/create", {
        rounds: previousGame.rounds,
        time: previousGame.seconds,
        map: { id: previousGame.mapId },
        NMPZ: previousGame.NMPZ,
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

  const goBack = () => {
    if (redirect){
      router.push(redirect);
    }
  }

  useEffect(() => {
    if (!params.id) {
      return;
    }
    const fetchGuesses = async () => {
      try {
        const res = await api.get(`/game/summary?session=${params.id}`);
        const location = res.data.rounds.map((guess: any) => guess.correct);
        const topGuesses = res.data.rounds.map((guess: any) => guess.top);
        const userGuesses = res.data.rounds.map(
          (guess: any) => guess.this_user
        );
        const allGuesses = topGuesses.map((top: Guess[], index: number) =>
          getUserMap(top, userGuesses[index])
        );
        setLocations(location);
        setDisplayedLocation(location);
        setTopGuesses(topGuesses);
        setUserGuesses(userGuesses);
        setAllGuesses(allGuesses);
        setDisplayedGuesses(allGuesses);
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

  const overallStats = data.stats.this_user;
  return (
    <ProtectedRoutes>
      <div className="summary-container">
        <div id="map-summary" className="map-container absolute">
          <BasicMapResult
            markers={displayedLocation.map((location, index) => {
              return {
                correct: location,
                users: displayedGuesses[index],
              };
            })}
            height={70}
          />
        </div>
        <div className="mx-auto p-6 bg-main-dark shadow-lg rounded-lg">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex justify-right">
              {redirect ? 
              <button className="btn-selected" onClick={goBack}>
                Go Back
              </button>:
              <button className="btn-selected" onClick={gameMenu}>
                Main Menu
              </button>
              }
            </div>

            <h2 className="text-3xl font-bold text-center text-dark flex-1">
              Game Summary
            </h2>
            <div className= "flex justify-end">
              <button className="ml-1 btn-primary" onClick={() => startNewGame()}>
                Next Game
              </button>
            </div>
          </div>
          <div className="mt-5">
            <a
              href="#map-summary"
              className="flex mx-20 justify-between items-center bg-accent1 p-4 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200"
              onClick={() => {
                setDisplayedGuesses(allGuesses);
                setDisplayedLocation(locations);
              }}
            >
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-dark">
                  Overall Stats
                </span>
                <span className="text-dark text-sm">
                  ⏳ {`${overallStats.time}s`}
                </span>
              </div>
              <div className="text-right">
                <span className="block text-lg font-bold text-red">
                  {overallStats.score} pts
                </span>
                <span className="text-dark text-sm">
                  {overallStats.distance && Math.round(overallStats.distance) >= 1 &&
                    `📍 ${Math.round(overallStats.distance * 100)/100} km away`}
                  {overallStats.distance && overallStats.distance < 1 &&
                    `📍 ${Math.round(overallStats.distance * 1000)} m away`}
                </span>
              </div>
            </a>
          </div>
          <ul className="space-y-4 my-5">
            {userGuesses.map((guess, index) => (
              <li key={index}>
                <a
                  href="#map-summary"
                  className="flex mx-20 justify-between items-center bg-accent1 p-4 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200"
                  onClick={() => {
                    setDisplayedGuesses([allGuesses[index]]);
                    setDisplayedLocation([locations[index]]);
                  }}
                >
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-dark">
                      Round {index + 1}
                    </span>
                    <span className="text-dark text-sm">
                      ⏳ {guess.time ? `${guess.time}s` : "Timed Out"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-lg font-bold text-red">
                      {guess.score} pts
                    </span>
                    <span className="text-dark text-sm">
                      {guess.distance && Math.round(guess.distance) >= 1 &&
                        `📍 ${Math.round(guess.distance * 100)/100} km away`}
                      {guess.distance && guess.distance < 1 &&
                        `📍 ${Math.round(guess.distance * 1000)} m away`}
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ProtectedRoutes>
  );
}
