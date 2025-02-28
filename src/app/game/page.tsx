"use client";

import { useRouter } from "next/navigation";
import api from "../../utils/api";
import { useEffect } from "react";

export default function Game() {
  const router = useRouter();

  // page for starting NEW game

  useEffect(() => {
    const fetchMatchID = async () => {
      const response = await api.post("/game/create",{"rounds":-1});
      const { id } = response.data;
      await api.post("/game/play", {id: id});
      router.push(`/game/${id}`);
    }
    fetchMatchID();
  }, [])


  return (
    <div>
      You're not supposed to see this...[insert loading page here]
    </div>
  );
}
