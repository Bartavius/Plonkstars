"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Table from "@/components/table/table";
import Loading from "@/components/loading";
import api from "@/utils/api";
import { FaArrowRight } from "react-icons/fa";

export default function MapLeaderboard({ mapID }: { mapID: string }) {
  const [leaderboard, setLeaderboard] = useState<any[]>();
  const [page, setPage] = useState<number>(1);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [NMPZ, setNMPZ] = useState(false);
  const [data, setData] = useState<any>();
  const resultsPerPage = 20;

  const router = useRouter();

  const distanceString = (distance: number) => {
    if (distance < 0) return { stat: "N/A" };
    const m = Math.round(distance * 1000);
    const km = Math.round(m / 10) / 100;
    const num = km > 1 ? km : m;
    const unit = km > 1 ? "km" : "m";
    return { stat: num, unit };
  };

  const timeString = (time: number) => {
    if (time < 0) return { stat: "N/A" };
    const minutes = Math.floor(time / 60);
    const seconds = Math.round((time % 60) * 10) / 10;
    return minutes > 0
      ? {
          stat: `${minutes.toString().padStart(2, "0")}:${seconds
            .toFixed(1)
            .padStart(4, "0")}`,
        }
      : { stat: `${seconds}`, unit: "s" };
  };

  const getLeaderboard = async () => {
    try {
      const response = await api.get(
        `/map/leaderboard?id=${mapID}&per_page=20&page=${page}&nmpz=${NMPZ}`
      );
      setLeaderboard(
        response.data.data.map((row: any) => ({
          user: { stat: row.user.username },
          rounds: { stat: row.rounds },
          average_score: { stat: row.average_score.toFixed(2) },
          average_distance: { ...distanceString(row.average_distance) },
          average_time: { ...timeString(row.average_time) },
          rank: row.rank,
        }))
      );
      setHasNext(page < response.data.pages);
      setData(response.data);
    } catch (error) {
      router.push("/maps");
    }
  };

  const topGame = (rank: number) => {
    if (!data) return;
    console.log(data);
    const row = data.data.find((row: any) => row.rank === rank);
    router.push(`/map/${mapID}/best?user=${row.user.username}&nmpz=${NMPZ}`);
  }

  useEffect(() => {
    getLeaderboard();
  }, [page, NMPZ]);

  const headers = {
    user: "User",
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
        headers={headers}
        data={leaderboard}
        start={resultsPerPage * (page - 1) + 1}
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
