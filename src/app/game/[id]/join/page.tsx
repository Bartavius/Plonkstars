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
    const id = useParams().id;
    const dispatch = useDispatch();
    useEffect(() => {
        const joinGame = async () => {
            const state = await api.get(`/game/state?id=${id}`);
            if (state.data.state === "RESULTS") {
                router.push(`/game/${id}/result?round=${state.data.round}`);
                return;
            }
            else if (state.data.state === "FINISHED") {
                router.push(`/game/${id}/summary`);
                return;
            }
            else if (state.data.state === "RESTRICTED"){
                dispatch(setError("Host has not finished the game yet"));
                router.push(`/game`);
                return;
            }
            else if (state.data.state === "NOT_STARTED"){
                await api.post("/game/play", { id }).catch(() => {});
                await api.post("/game/next", {id});
            }
            router.push(`/game/${id}`);
        };
        joinGame();
    }, []);
    return (
        <ProtectedRoutes>
            <Loading/>
        </ProtectedRoutes>
    );
}