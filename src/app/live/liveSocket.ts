import { setError } from "@/redux/errorSlice";
import { clearPartyCode } from "@/redux/partySlice";
import useSocket from "@/utils/socket";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

type SocketEvents = {
    [event: string]: (...args: any[]) => void;
};

export default function useLiveSocket({
    id,
    state,
    functions
}:{
    id:string,
    state:any,
    functions?:SocketEvents
}){
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const code = useSelector((state: any) => state.party).code;

    const fullPath = searchParams.toString() ? `${pathname}?${searchParams.toString()}`: pathname;

    const socket = useSocket({
        namespace: "/party",
        rooms: {code,id},
        functions:{
            next: (data) => pushState(data),
            leave:(data)=>{
                dispatch(clearPartyCode());
                dispatch(setError(data?.reason));
                router.push("/game");
            },
            ...functions,
        }
    })

    function pushState(state: any){
        switch (state.state) {
            case "GUESSING":
                push(`/live/${id}`);
                break;
            case "FINISHED":
                push(`/live/${id}/summary`);
                break;
            case "RESULTS":
                push(`/live/${id}/result`);
                break;
        }
    }

    function push(url:string){
        if(url !== fullPath){
            router.push(url);
        }
    }
    
    useEffect(() =>{
        state && pushState(state);
    },[state])
    

    return socket;
}