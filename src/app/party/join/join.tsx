import { setPartyCode } from "@/redux/partySlice";
import api from "@/utils/api";

export default async function joinParty({code,setError,router,dispatch}:{code:string,setError:(error:string) => void,router:any,dispatch:any}) {
    try{
        await api.post("/party/join", {code});
    } catch(err:any){
        if (err.response?.status === 404) {
            setError(err.response?.data?.error || "Could not join party");
            return;
        }
    }
    dispatch(setPartyCode(code));
    router.push("/party");
}