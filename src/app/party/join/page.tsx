"use client";
import Loading from "@/components/primitives/loading";
import api from "@/services/api";

import { useSearchParams,useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPartyCode } from "@/store/party-slice";
import { setError } from "@/store/error-slice";
import joinParty from "@/features/party/services/join-party";
import ProtectedRoutes from "@/features/auth/components/protected-routes";

export default function JoinParty() {
    const searchParams = useSearchParams();
    const code = searchParams.get("code") || "";
    const dispatch = useDispatch();
    const router = useRouter();
    useEffect(() => {
        joinParty({
            code,
            setError:(error:string) => {
dispatch(setError(error)); router.push("/game")
},
            router,
            dispatch
        });
    },[])

    return <ProtectedRoutes><Loading/></ProtectedRoutes>
}