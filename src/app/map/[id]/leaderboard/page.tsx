"use client";

import MapLeaderboard from "@/components/maps/leaderboard/leaderboard";
import { useParams, useRouter } from "next/navigation";

export default function MapLeaderboardPage(){
    const MAPID = useParams().id;
    const router = useRouter();

    if(!MAPID){
        router.push("/map");
        return;
    }

    return (
        <div>
            <div className="navbar-buffer"/>
            <MapLeaderboard mapID={MAPID.toString()}/>
        </div>
    )
}