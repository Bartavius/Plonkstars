"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CgCopy } from "react-icons/cg";
import { FaMedal } from "react-icons/fa";
import { ImLink } from "react-icons/im";
import { IoIosStats } from "react-icons/io";

import { Loading } from "@/components/primitives/loading";
import { ProtectedRoutes } from "@/features/auth/components/protected-routes";
import { Summary } from "@/features/challenge/components/summary";
import { api } from "@/services/api";
import "./page.css";
import { Popup } from "@/components/primitives/popup";
import type { GameSummary } from "@/features/challenge/types/game-summary";

interface Location {
  lat: number;
  lng: number;
}

export default function SummaryPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [user, setUser] = useState<string>("");
  const [data, setData] = useState<GameSummary>();
  const [showLink, setShowLink] = useState(false);
  const [update, setUpdate] = useState(0);
  const [leaderboard, setLeaderboard] = useState<boolean>(false);

  const params = useParams();
  const router = useRouter();
  const challengeLink = `${window.location.origin}/game/${params.id}/challenge`;

  const copyLink = () => {
    navigator.clipboard.writeText(challengeLink);
    setUpdate(update + 1);
  };

  useEffect(() => {
    if (!params.id) {
      return;
    }
    const fetchGuesses = async () => {
      try {
        const res = await api.get<GameSummary>(`/game/summary?id=${params.id}`);

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
        router.push("/party");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!data) {
    return <Loading />;
  }

  return (
    <ProtectedRoutes>
      <Popup update={update}>{update === 0 ? undefined : "Link Copied"}</Popup>
      <div className="summary-container">
        <Summary locations={locations} data={data.users} user={user} leaderboard={leaderboard}>
          <div className="grid grid-cols-3 gap-4 w-full">
            <div className="flex justify-right">
              <button
                className="bg-leaderboard-yellow flex items-center justify-center flex-row text-[1rem] font-bold text-white px-6 rounded-2xl mx-1"
                onClick={() => setLeaderboard(!leaderboard)}
              >
                {leaderboard ? (
                  <>
                    <IoIosStats className="text-[1rem] mr-2" />
                    Your Stats
                  </>
                ) : (
                  <>
                    <FaMedal className="text-[1rem] mr-2" />
                    Leaderboard
                  </>
                )}
              </button>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-center text-dark flex-1">Game Summary</h2>
            </div>
            <div className="flex justify-end">
              <div
                className={`link-text ${showLink ? "visible opacity-100 translate-x-0" : "opacity-0 invisible translate-x-[40px]"} whitespace-nowrap transition-all duration-500 ease-[ease] text-[1rem] font-medium max-w-[50%] z-[1] flex items-center bg-dark-blue text-lightest-blue rounded-l-2xl no-scrollbar`}
              >
                {challengeLink}
              </div>
              {!showLink && (
                <button
                  className={`bg-dark-blue rounded-2xl p-4 text-white transition-all duration-200 ease-[ease-in-out] z-[2] hover:bg-darker-blue hover:scale-[1.02] hover:shadow-[0px_3px_10px_rgba(0,25,51,0.3)] active:scale-[0.97]`}
                  onClick={() => setShowLink(true)}
                  title="Challenge Link"
                >
                  <ImLink />
                </button>
              )}
              {showLink && (
                <button
                  className={`bg-darkest-blue rounded-r-2xl rounded-l-none p-4 text-white transition-all duration-200 ease-[ease-in-out] z-[2] hover:bg-darker-blue hover:scale-[1.02] hover:shadow-[0px_3px_10px_rgba(0,25,51,0.3)] active:scale-[0.97]`}
                  onClick={copyLink}
                  title="Copy Link"
                >
                  <CgCopy />
                </button>
              )}
              <button className="ml-1 btn-primary" onClick={() => router.push(`/party`)}>
                Back To Party
              </button>
            </div>
          </div>
        </Summary>
      </div>
    </ProtectedRoutes>
  );
}
