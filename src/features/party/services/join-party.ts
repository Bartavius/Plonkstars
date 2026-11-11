import { api } from "@/services/api";
import { setPartyCode } from "@/store/party-slice";
interface JoinPartyOptions {
  code: string;
  setError: (error: string) => void;
  router: any;
  dispatch: any;
}

export async function joinParty({ code, setError, router, dispatch }: JoinPartyOptions) {
  try {
    await api.post("/party/join", { code });
  } catch (err: any) {
    if (err.response?.status === 404) {
      setError(err.response?.data?.error || "Could not join party");
      return;
    }
  }
  dispatch(setPartyCode(code));
  router.push("/party");
}
