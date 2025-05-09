"use client";
import Loading from "@/components/loading";
import api from "@/utils/api";

import { useSearchParams,useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPartyCode } from "@/redux/partySlice";
import { setError } from "@/redux/errorSlice";

export default function JoinParty() {
    const searchParams = useSearchParams();
    const code = searchParams.get("code") || "";
    const dispatch = useDispatch();
    const router = useRouter();
    useEffect(() => {
        async function joinParty(){
            try{
                await api.post("/party/join", {code});
                dispatch(setPartyCode(code));
                router.push(`/party`);
            } catch(err:any){
                dispatch(setError(err.response?.data?.error || "Could not join party"));
            }
        }
        joinParty();
    },[])

    return <Loading/>
}