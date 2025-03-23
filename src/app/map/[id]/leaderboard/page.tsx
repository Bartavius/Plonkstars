"use client";

import MapLeaderboard from "@/components/maps/leaderboard/leaderboard";
import { useParams, useRouter } from "next/navigation";
import "./page.css";

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
            <div className="title-header-wrapper">
                <div className="title-header">Leaderboard</div>
            </div>
            <div className="map-leaderboard-wrapper">
                <div className="map-leaderboard-box">
                    <MapLeaderboard mapID={MAPID.toString()}/>
                </div>
            </div>
        </div>
    )
}