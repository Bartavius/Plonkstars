"use client";
import { useParams,useRouter } from "next/navigation";
import { setError } from "@/redux/errorSlice";
import "./page.css";
import "@/app/game.css";
import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import api from "@/utils/api";
import { useDispatch } from "react-redux";
import MapCard from "@/components/maps/search/MapCard";

export default function challengePage() {
    const [data,setData] = useState<any>(); 
    const [loading,setLoading] = useState<boolean>(false);

    const sessionID = useParams().id;
    const router = useRouter();
    const dispatch = useDispatch();

    async function getData(){
        try{
            const res = await api.get(`/session/info?id=${sessionID}`)
            setData(res.data);
        }catch (error) {
            dispatch(setError("Session not found"));
            router.push("/game");
        }

    }
   
    useEffect(()=>{
        getData();
    },[]);

    if (!data){
        return <Loading/>
    }
    const host = data.user;
    const rules = data.rules;
    const map = data.map;

    return (
        <div className="centered-elements">
            <div className="challenge-title">You got challenged by {host.username}</div>
            <div className="session-info-box">
                <button className="map-wrapper" onClick={()=>{setLoading(true); router.push(`/map/${map.id}`)}} disabled={loading}>
                    <MapCard map={map}/>
                </button>
                <div className="challenge-text">Rounds: {rules.rounds}</div>
                <div className="challenge-text">Time: {rules.time} seconds</div>
                <div className="challenge-text">NMPZ: {rules.NMPZ ? "Yes" : "No"}</div>
                <div className="button-wrapper">
                    <button onClick={()=>{setLoading(true); router.push(`/game/${sessionID}/join`)}} className="game-button" disabled={loading}>Play</button>
                </div>
            </div>
        </div>
    )
}