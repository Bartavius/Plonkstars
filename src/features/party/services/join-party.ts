import type { Dispatch } from "@reduxjs/toolkit";
import type { useRouter } from "next/navigation";

import { api } from "@/services/api";
import { getErrorResponse } from "@/services/api-error";
import { setPartyCode } from "@/store/party-slice";
interface JoinPartyOptions {
  code: string;
  setError: (error: string) => void;
  router: ReturnType<typeof useRouter>;
  dispatch: Dispatch;
}

export async function joinParty({ code, setError, router, dispatch }: JoinPartyOptions) {
  try {
    await api.post("/party/join", { code });
  } catch (err) {
    if (getErrorResponse(err)?.status === 404) {
      setError(getErrorResponse(err)?.data?.error || "Could not join party");
      return;
    }
  }
  dispatch(setPartyCode(code));
  router.push("/party");
}
