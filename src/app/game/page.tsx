"use client";

import { useRouter } from "next/navigation";

export default function Game() {
  const router = useRouter();
  router.push("/game/fdsafdsaflkhdslkfa");
  // generate and get the matchID here
  // /api/game/create -> matchID : string



  return (
    <div>
      You're not supposed to see this...
    </div>
  );
}
