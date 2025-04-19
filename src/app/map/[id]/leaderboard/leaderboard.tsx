"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Table from "@/components/table/table";
import Loading from "@/components/loading";
import api from "@/utils/api";
import { FaArrowRight } from "react-icons/fa";

import "./page.css";

export default function MapLeaderboard({ mapID }: { mapID: string }) {
  const [leaderboard, setLeaderboard] = useState<any[]>();
  const [page, setPage] = useState<number>(1);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [NMPZ, setNMPZ] = useState(false);
  const [data, setData] = useState<any>();
  const resultsPerPage = 20;

  const router = useRouter();

  const distanceString = (distance: number) => {
    if (distance < 0) return "N/A";
    const m = Math.round(distance * 1000);
    const km = Math.round(m / 10) / 100;
    const num = km > 1 ? km : m;
    const unit = km > 1 ? "km" : "m";
    return `${num}${unit}`;
  };

  const timeString = (time: number) => {
    if (time < 0) return "N/A";
    const minutes = Math.floor(time / 60);
    const seconds = Math.round((time % 60) * 10) / 10;
    return minutes > 0
      ? `${minutes.toString().padStart(2, "0")}:${seconds
            .toFixed(1)
            .padStart(4, "0")}`: `${seconds}s`;
  };

  const getLeaderboard = async () => {
    try {
      const user = await api.get("/account/profile");

      const response = await api.get(
        `/map/leaderboard?id=${mapID}&per_page=${resultsPerPage}&page=${page}&nmpz=${NMPZ}`
      );
      setLeaderboard(
        response.data.data.map((row: any) => ({
          heading: 
          <div className="rank-box">
            <div className="rank-number-text">#{row.rank}</div>
            <div className="user-name-text">{row.user.username}</div>
          </div>,
          rounds: row.rounds,
          average_score: row.average_score.toFixed(2),
          average_distance: distanceString(row.average_distance),
          average_time: timeString(row.average_time),
          style: row.user.username === user.data.username ? "highlight-self-row" : "",
        }))
      );
      setHasNext(page < response.data.pages);
      setData(response.data);
    } catch (error) {
      router.push("/map");
    }
  };

  const topGame = (rowNumber: number) => {
    if (!data) return;
    const row = data.data[rowNumber];
    router.push(`/map/${mapID}/best?user=${row.user.username}&nmpz=${NMPZ}`);
  }

  useEffect(() => {
    getLeaderboard();
  }, [page, NMPZ]);

  console.log(leaderboard);
  const headers = {
    average_score: "Avg. Score",
    rounds: "Rounds",
    average_time: "Avg. Time",
    average_distance: "Avg. Distance",
  };

  if (!leaderboard) {
    return <Loading />;
  }


  return (
    <div>
      <button
        className={`mr-2 nmpz-toggle-btn ${NMPZ ? "toggled" : ""}`}
        name="nmpz-leaderboard-toggle"
        id="nmpz-leaderboard-toggle"
        onClick={() => {
          setNMPZ(!NMPZ);
          setPage(1);
        }}
      >{NMPZ ? "Normal" : "NMPZ"} <FaArrowRight className="inline"/> </button>
      <Table
        rowHeader="heading"
        className="leaderboard-table"
        headers={headers}
        data={leaderboard}
        onClickRow={topGame}
      />
      <div className="flex justify-between">
        {page != 1 ? (
          <button onClick={() => setPage(page - 1)} className="btn next-button">
            Prev Page
          </button>
        ) : (
          <div></div>
        )}
        {hasNext ? (
          <button onClick={() => setPage(page + 1)} className="btn next-button">
            Next Page
          </button>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}
