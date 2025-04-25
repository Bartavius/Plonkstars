"use client";
import { setPartyCode } from "@/redux/partySlice";
import api from "@/utils/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";

export default function Temp(){
    const [input, setInput] = useState<string>("");

    const dispatch = useDispatch();
    const router = useRouter();
    async function createParty(){
        const res = await api.post("/party/create");
        const code =  res.data.code;
        dispatch(setPartyCode(code));
        router.push(`/party`);
    }
    
    async function joinParty(){
        const res = await api.post("/party/join", {code:input});
        if(res.status == 200){
            dispatch(setPartyCode(input));
            router.push(`/party`);
        }
        else{
            alert("Invalid party code")
        }
    }
    return (
        <div className="relative flex justify-center items-center flex-col h-screen">
            <button className="form-button-general" onClick={createParty}>Create Party</button>
            <input onChange={(e)=>setInput(e.target.value)}/>
            <button className="form-button-general" onClick={joinParty}>Join Party</button>
        </div>
    )
}