"use client";


import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Table from "@/components/maps/leaderboard/table";
import Loading from "@/components/loading";
import api from "@/utils/api";

export default function MapLeaderboard(
    {
        mapID,
    }:{
        mapID:string;
    },
){

    const [leaderboard, setLeaderboard] = useState<any[]>();
    const router = useRouter();

    const distanceString = (distance:number) => {
        if(distance < 0) return {stat: "N/A"};
        const m = Math.round(distance * 1000);
        const km = Math.round(m / 10) / 100;
        const num = km > 1 ? km : m;
        const unit = km > 1 ? "km" : "m";
        return {stat:num,unit};
    }

    const timeString = (time:number) => {
        if(time < 0) return {stat:"N/A"};
        const minutes = Math.floor(time / 60);
        const seconds = Math.round(time % 60 * 10)/10;
        return minutes > 0? {stat:`${minutes}:${seconds.toString().padStart(4,"0")}`} : {stat:`${seconds}`,unit:"s"};
    }

    const getLeaderboard = async () => {
        try {
            const response = await api.get(`/map/leaderboard?id=${mapID}&per_page=100`);
            setLeaderboard(response.data.map((row:any) => ({
                user: {stat:row.user.username},
                rounds: {stat:row.rounds},
                average_score: {stat:row.average_score.toFixed(2)},
                average_distance: {...distanceString(row.average_distance)},
                average_time: {...timeString(row.average_time)},
            })));
        } catch (error) {
            router.push("/maps");
        }
    }

    useEffect(() => {
        getLeaderboard();
    },[]);

    const headers = {
        user: "User",
        average_score: "Avg. Score",
        rounds: "Rounds",
        average_time: "Avg. Time",
        average_distance: "Avg. Distance",
    }

    if (!leaderboard){
        return <Loading/>
    }

    return (
        <Table headers={headers} data={leaderboard}/>
    )
}