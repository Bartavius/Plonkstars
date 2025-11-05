"use client";
import Loading from "@/components/loading";
import api from "@/utils/api";

import { useSearchParams,useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPartyCode } from "@/redux/partySlice";
import { setError } from "@/redux/errorSlice";
import joinParty from "./join";
import ProtectedRoutes from "@/app/ProtectedRoutes";

export default function JoinParty() {
    const searchParams = useSearchParams();
    const code = searchParams.get("code") || "";
    const dispatch = useDispatch();
    const router = useRouter();
    useEffect(() => {
        joinParty({
            code,
            setError:(error:string) => {dispatch(setError(error)); router.push("/game")},
            router,
            dispatch
        });
    },[])

    return <ProtectedRoutes><Loading/></ProtectedRoutes>
}