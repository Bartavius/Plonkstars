import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useSocket } from "@/lib/hooks/use-socket";
import { setError } from "@/store/error-slice";
import { clearPartyCode } from "@/store/party-slice";

type SocketEvents = {
  [event: string]: (...args: any[]) => void;
};
interface UseDuelsSocketOptions {
  id: string;
  state: any;
  functions?: SocketEvents;
}

function useDuelsSocket({ id, state, functions }: UseDuelsSocketOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const code = useSelector((state: any) => state.party).code;

  const fullPath = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;

  const socket = useSocket({
    namespace: "/party",
    rooms: { code, id },
    functions: {
      next: (data) => pushState(data),
      leave: (data) => {
        dispatch(clearPartyCode());
        dispatch(setError(data?.reason));
        router.push("/game");
      },
      ...functions,
    },
  });

  function pushState(state: any) {
    if (typeof state !== "string") {
      state = state.state;
    }
    switch (state) {
      case "GUESSING":
        push(`/duels/${id}`);
        break;
      case "FINISHED":
        push(`/duels/${id}/summary`);
        break;
      case "RESULTS":
        push(`/duels/${id}/result`);
        break;
    }
  }

  function push(url: string) {
    if (url !== fullPath) {
      router.push(url);
    }
  }

  useEffect(() => {
    state && pushState(state);
  }, [state]);

  return socket;
}

export { useDuelsSocket };
