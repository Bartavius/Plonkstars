"use client";

import { useEffect } from "react";
import { initializeAuth } from "@/redux/authSlice";
import { fetchInitialState } from "@/redux/gameSlice";
import { useDispatch, useSelector } from "react-redux";

export default function ReinstateSession() {
  const dispatch = useDispatch();
  const game = useSelector((state: any) => state.game);
  useEffect(() => {
    dispatch(initializeAuth());
    if (game.mapName === undefined || game.mapId === undefined || game.seconds === undefined || game.rounds === undefined) {
      fetchInitialState(dispatch);
    }

  }, [dispatch]);

  return null;
}
