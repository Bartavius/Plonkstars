"use client";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoutes from "@/app/ProtectedRoutes";
import Loading from "@/components/loading";
import Summary from "@/components/game/summary/summary";
import { ImLink } from "react-icons/im";
import "./page.css";
import Popup from "@/components/Popup";
import { CgCopy } from "react-icons/cg";
import { FaMedal } from "react-icons/fa";
import { IoIosStats } from "react-icons/io";

interface Location {
  lat: number;
  lng: number;
}

export default function SummaryPage() {
  //will need to set total number of rounds that pop up (click more at the bottom), limit of...10 per?
  const [locations, setLocations] = useState<Location[]>([]);
  const [user, setUser] = useState<string>("");
  const [data, setData] = useState<any>();
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
        const res = await api.get(`/game/summary?session=${params.id}`);
      
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
    return <Loading/>;
  }
  
  return (
    <ProtectedRoutes>
      <Popup update={update}>
        {update=== 0? undefined: "Link Copied"}
      </Popup>
      <div className="summary-container">
        <Summary locations={locations} data={data.users} user={user} leaderboard={leaderboard}>
          <div className="grid grid-cols-3 gap-4 w-full">
            <div className="flex justify-right">
              <button className="summary-leaderboard-button" onClick={()=>setLeaderboard(!leaderboard)}>
                {leaderboard? 
                  <>
                    <IoIosStats className="button-icon"/>
                    Your Stats
                  </>
                  : 
                  <>
                    <FaMedal className="button-icon"/>
                    Leaderboard
                  </>
                }
                
              </button>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-center text-dark flex-1">
                Game Summary
              </h2>
            </div>
            <div className= "flex justify-end">
              <div className={`link-text ${showLink ? "visible" : ""} no-scrollbar`}>
                {challengeLink}
              </div>
              {!showLink && 
              <button className={`link-button`} onClick={()=>setShowLink(true)} title="Challenge Link">
                <ImLink/>
              </button>
              }
              {showLink &&
              <button className={`link-button copy-link-button`} onClick={copyLink} title="Copy Link">
                <CgCopy/>
              </button>
              }
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
