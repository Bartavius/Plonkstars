"use client";

import ProtectedRoutes from "@/app/ProtectedRoutes";
import Loading from "@/components/loading";
import { setError } from "@/redux/errorSlice";
import api from "@/utils/api";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function JoinGame() {
    const router = useRouter();
    const sessionID = useParams().id;
    const dispatch = useDispatch();
    useEffect(() => {
        const joinGame = async () => {
            const state = await api.get(`/game/state?id=${sessionID}`);
            if (state.data.state === "results") {
                router.push(`/game/${sessionID}/result?round=${state.data.round}`);
                return;
            }
            else if (state.data.state === "finished") {
                router.push(`/game/${sessionID}/summary`);
                return;
            }
            else if (state.data.state === "not_playing"){
                try{
                    await api.post("/game/play", {id:sessionID});
                }catch(err:any){} 
                await api.post("/game/next", {id:sessionID});
            }
            router.push(`/game/${sessionID}`);
        };
        joinGame();
    }, []);
    return (
        <ProtectedRoutes>
            <Loading/>
        </ProtectedRoutes>
    );
}