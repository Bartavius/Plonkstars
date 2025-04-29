import { clearPartyCode } from "@/redux/partySlice";
import api from "@/utils/api";
import useSocket from "@/utils/socket";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function useLiveSocket({
    id,
}:{
    id:string,
}){
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const room = useSelector((state: any) => state.party).code;

    const fullPath = searchParams.toString() ? `${pathname}?${searchParams.toString()}`: pathname;

    const socket = useSocket({
        namespace: "/party",
        room: room,
        functions:{
            next: (data) => next(),
            leave:(data)=>{
                dispatch(clearPartyCode());
                router.push("/party/temp");
            },
        }
    })

    async function next() {
        const state = await api.get(`/game/state?id=${id}`);
        console.log(state.data);
        pushState(state.data);
    }

    function pushState(state: any){
        switch (state.state) {
            case "waiting":
            case "playing":
                push(`/live/${id}`);
                break;
            case "results":
            case "finished":
                push(`/live/${id}/result?round=${state.round}`);
                break;
            default:
                break;
        }
    }

    function push(url:string){
        if(url !== fullPath){
            router.push(url);
        }
    }
    
    useEffect(() =>{
        next();
    },[])
    

    return socket;
}