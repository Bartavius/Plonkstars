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
            try {
                const res = await api.post("/game/play", {
                id:sessionID,
                });
                router.push(`/game/${sessionID}`);
            } catch (err: any) {
                if (err.response?.status === 404) {
                    dispatch(setError(err.response?.data?.error || "Game not found"));
                    router.push("/game"); 
                }
            }
        };
        joinGame();
    }, []);
    return (
        <ProtectedRoutes>
            <Loading/>
        </ProtectedRoutes>
    );
}