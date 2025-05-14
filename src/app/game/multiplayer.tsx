import { setPartyCode } from "@/redux/partySlice";
import api from "@/utils/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import joinParty from "@/app/party/join/join";

export default function Multiplayer({
    loading,
    setLoading,
    setError
}:{
    loading:boolean
    setLoading: (loading:boolean) => void
    setError: (error:string) => void
}) {
    const [input, setInput] = useState<string[]>(["","","",""]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isFocused, setIsFocused] = useState(false);

    const dispatch = useDispatch();
    const router = useRouter();

    const handleKeyDown = (e: React.KeyboardEvent) => {
        const newLetters = [...input];
        if (/^[a-zA-Z]$/.test(e.key)) {
            newLetters[selectedIndex] = e.key.toUpperCase();
            setInput(newLetters);
            if (selectedIndex < 3) setSelectedIndex(selectedIndex + 1);
        } else if (e.key === "Backspace" && selectedIndex >= 0) {
            newLetters[selectedIndex] = "";
            setInput(newLetters);
            if (selectedIndex != 0) setSelectedIndex(selectedIndex - 1);
        }
        else if (e.key === "ArrowLeft" && selectedIndex > 0) {
            setSelectedIndex(selectedIndex - 1);
        } else if (e.key === "ArrowRight" && selectedIndex < 3) {
            setSelectedIndex(selectedIndex + 1);
        } else if (e.key === "Enter") {
            joinPartyButton();
        }
      };


    async function createParty(){
        if (loading) return;
        try{
            setLoading(true);
            const res = await api.post("/party/create");
            const code =  res.data.code;
            dispatch(setPartyCode(code));
            setLoading(true);
            router.push(`/party`);
        } catch(err:any){
            setError(err.response?.data?.error || "Could not create party");
            setLoading(false);
        }
    }
    
    function joinPartyButton(){
        if (loading) return;
        joinParty({code:input.join(""),setError,router,dispatch});
    }

    return (
        <div className="w-full px-4">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Multiplayer
            </h2>
            <div className="flex flex-col w-full">
                <div className="gap-2 flex flex-col items-center w-full mb-10">
                    <div>Start your own party: </div>
                    <button 
                        className={`game-setup-btn w-full py-2 rounded-lg font-semibold ${
                            loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={loading}
                        onClick={createParty}
                    >
                        Create Party
                    </button>
                </div>
                <div className="gap-2 flex flex-col items-center w-full">
                    <div>Join an existing party: </div>
                    <div 
                        tabIndex={0}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onKeyDown={handleKeyDown} 
                        className="flex mb-2 gap-2 outline-none"
                    >
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className={`w-12 h-12 border-2 flex items-center justify-center text-2xl rounded bg-light text-dark ${
                                    isFocused && i === selectedIndex ? "border-blue-500 bg-blue-100" : "border-gray-300"
                                  }`}
                                  onClick={()=>setSelectedIndex(i)}
                            >
                            {input[i] ?? ""}
                            </div>
                        ))}
                    </div>
                    <button className="form-button-general" onClick={joinPartyButton} disabled={loading}>Join Party</button>
                </div>
            </div>
        </div>
    )
}