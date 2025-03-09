"use client";

import { useEffect } from "react";
import { initializeAuth } from "@/redux/authSlice";
import { useDispatch } from "react-redux";
import { initializeSettings } from "@/redux/gameSlice";

export default function ReinstateSession() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
    dispatch(initializeSettings());
  }, [dispatch]);

  return null;
}
