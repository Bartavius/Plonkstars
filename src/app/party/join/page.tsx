"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import Loading from "@/components/primitives/loading";
import ProtectedRoutes from "@/features/auth/components/protected-routes";
import joinParty from "@/features/party/services/join-party";
import api from "@/services/api";
import { setError } from "@/store/error-slice";
import { setPartyCode } from "@/store/party-slice";

export default function JoinParty() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "";
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    joinParty({
      code,
      setError: (error: string) => {
        dispatch(setError(error));
        router.push("/game");
      },
      router,
      dispatch,
    });
  }, []);

  return (
    <ProtectedRoutes>
      <Loading />
    </ProtectedRoutes>
  );
}
