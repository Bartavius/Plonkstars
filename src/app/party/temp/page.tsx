"use client";
import { setPartyCode } from "@/redux/partySlice";
import api from "@/utils/api";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";

export default function Temp(){
    const [input, setInput] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);

    const dispatch = useDispatch();
    const router = useRouter();
    async function createParty(){
        const res = await api.post("/party/create");
        const code =  res.data.code;
        dispatch(setPartyCode(code));
        router.push(`/party`);
    }
    
    async function joinParty(){
        try{
            await api.post("/party/join", {code:input});
        } catch(err:any){
            if(err.response?.status == 404){
                alert("Invalid party code");
                return;
            }
        }
        dispatch(setPartyCode(input));
        router.push(`/party`);
    }
    return (
        <div className="relative flex justify-center items-center flex-col h-screen">
            <button className="form-button-general" onClick={createParty}>Create Party</button>
            <div onClick={() => inputRef?.current?.focus()} className="flex gap-2">
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="absolute opacity-0 pointer-events-none"
                    autoFocus
                />
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="w-12 h-12 border-2 border-gray-400 rounded text-center text-2xl flex items-center justify-center bg-dark-blue"
                    >
                    {input[i] ?? ""}
                    </div>
                ))}
            </div>
            <button className="form-button-general" onClick={joinParty}>Join Party</button>
        </div>
    )
}