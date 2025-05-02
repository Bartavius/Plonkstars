import { useEffect, useRef } from "react";
import io, {Socket} from "socket.io-client";
import { useSelector } from "react-redux";


type SocketEvents = {
    [event: string]: (...args: any[]) => void;
};


export default function useSocket({
    namespace,
    rooms,
    functions,
}:{
    namespace: string;
    rooms?: any;
    functions:SocketEvents;
}){
    const token = useSelector((state: any) => state.auth.token); 
    const socketRef = useRef<Socket | null>(null);

    const memorizedFunctions = Object.keys(functions).toString();
    const memorizedRooms = Object.keys(rooms).toString();
    useEffect(() => { 
        const socket = io(`${process.env.NEXT_PUBLIC_BACKEND}/socket${namespace}`, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            auth:{
                token: token,
            }
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            socket.emit("join", {...rooms,token});
            console.log("Connected");
        });
        Object.keys(functions).forEach((event: string) => {socket.on(event, functions[event]);});
        
        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [memorizedRooms, namespace, token, memorizedFunctions]);
    
      return socketRef;
}