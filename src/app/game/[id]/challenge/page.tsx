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
import { BsInfinity } from "react-icons/bs";
import ProtectedRoutes from "@/app/ProtectedRoutes";

export default function challengePage() {
    const [data,setData] = useState<any>(); 
    const [loading,setLoading] = useState<boolean>(false);

    const sessionID = useParams().id;
    const router = useRouter();
    const dispatch = useDispatch();

    async function getData(){
        try{
            const res = await api.get(`/session/info?id=${sessionID}`)
            if (res.data.state === "FINISHED") {
                router.push(`/game/${sessionID}/summary`);
                return;
            }
            setData(res.data);
        }catch (error:any) {
            dispatch(setError(error?.response?.data?.error ?? "Session not found"));
            router.push("/game");
        }

    }
   
    useEffect(()=>{
        getData();
    },[]);

    if (!data){
        return <Loading/>
    }
    const rules = data.rules;
    const map = data.map;

    return (
        <ProtectedRoutes>
            <div className="centered-elements">
                <div className="challenge-title">You got challenged by {data.host}</div>
                <div className="session-info-box">   
                    <MapCard map={map} onClick={()=>{setLoading(true); router.push(`/map/${map.id}`)}}/>
                    <div className="challenge-text">Rounds: {rules.rounds}</div>
                    <div className="challenge-text">Time: {rules.time === -1? <BsInfinity/>:`${rules.time} seconds`}</div>
                    <div className="challenge-text">NMPZ: {rules.NMPZ ? "Yes" : "No"}</div>
                    <div className="button-wrapper">
                        <button onClick={()=>{setLoading(true); router.push(`/game/${sessionID}/join`)}} className="game-button" disabled={loading}>{data.state === "NOT_STARTED"?"Play":"Continue"}</button>
                    </div>
                </div>
            </div>
        </ProtectedRoutes>
    )
}