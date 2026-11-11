import { useEffect, useRef } from "react";
import io, { type Socket } from "socket.io-client";

import { getToken } from "@/features/auth/services/session";

// Payloads arrive as untyped JSON; each handler annotates the payload it expects.
type SocketHandler = (data: never) => void;
type SocketHandlers = Record<string, SocketHandler>;
interface UseSocketOptions {
  namespace: string;
  rooms: Record<string, string | undefined>;
  functions: SocketHandlers;
}

function useSocket({ namespace, rooms, functions }: UseSocketOptions) {
  const token = getToken();
  const socketRef = useRef<Socket | null>(null);

  const memorizedFunctions = Object.keys(functions).toString();
  const memorizedRooms = Object.keys(rooms).toString();
  useEffect(() => {
    const socket = io(`${process.env.NEXT_PUBLIC_BACKEND}/socket${namespace}`, {
      transports: ["websocket", "polling"],
      reconnection: true,
      auth: {
        token: token,
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join", { ...rooms, token });
    });
    Object.keys(functions).forEach((event: string) => {
      socket.on(event, functions[event] as (...args: unknown[]) => void);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [memorizedRooms, namespace, token, memorizedFunctions]);

  return socketRef;
}

export { useSocket, type SocketHandlers };
