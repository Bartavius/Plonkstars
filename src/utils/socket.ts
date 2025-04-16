import { useEffect, useRef } from "react";
import io, {Socket} from "socket.io-client";
import { useSelector } from "react-redux";


type SocketEvents = {
    [event: string]: (...args: any[]) => void;
};


export default function useSocket({
    namespace,
    room,
    functions,
}:{
    namespace: string;
    room?: string;
    functions:SocketEvents;
}){
    const token = useSelector((state: any) => state.auth.token); 
    const socketRef = useRef<Socket | null>(null);

    const memorizedFunctions = Object.keys(functions).toString();
    useEffect(() => {
        if (!socketRef.current) {
            const socket = io(`${process.env.NEXT_PUBLIC_BACKEND}/socket${namespace}`, {
                transports: ['websocket', 'polling'],
                reconnection: true,
                auth:{
                    token: token,
                }
            });
            socketRef.current = socket;
            socket.on("connect", () => {
                socket.emit("join", {id:room,token});
            });
            Object.keys(functions).forEach((event: string) => {socket.on(event, functions[event]);});
        }
        return () => {
            if (socketRef.current) {
              socketRef.current.disconnect();
              socketRef.current = null;
            }
        };
    }, [room, namespace, memorizedFunctions]);
    
      return socketRef.current;
}