import { setPartyCode } from "@/redux/partySlice";
import api from "@/utils/api";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [isFocused, setIsFocused] = useState(false);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const dispatch = useDispatch();
    const router = useRouter();

    function handleKeyDown(e: React.KeyboardEvent,i:number){
        if (e.ctrlKey || e.metaKey) return;
        const newLetters = [...input];
        if (e.key === "Backspace" && i >= 0) {
            newLetters[i] = "";
            setInput(newLetters);
            if (i != 0) setSelectedIndex(i - 1);
        }
        else if (e.key === "ArrowLeft" && i > 0) {
            setSelectedIndex(i - 1);
        } else if (e.key === "ArrowRight" && i < 3) {
            setSelectedIndex(i + 1);
        } else if (e.key === "Enter") {
            joinPartyButton();
        }
    };

    function handleChange(e: React.ChangeEvent<HTMLInputElement>, index: number) {
        const val = e.target.value.toUpperCase().replace(/[^A-Z]/g, "");

        if (!val) return;

        const newInput = [...input];
        newInput[index] = val[0];
        setInput(newInput);

        if (index < 3) {
            setSelectedIndex(index + 1);
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

    function handlePaste(e: React.ClipboardEvent) {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("Text").toUpperCase().replace(/[^A-Z]/g, "");
        const newInput = [...input];

        for (let i = selectedIndex; i < Math.min(4, pasteData.length); i++) {
            newInput[i] = pasteData[i - selectedIndex];
        }

        setInput(newInput);
        setSelectedIndex(Math.min(pasteData.length + selectedIndex, 3));
    }

    useEffect(() =>{
        if (selectedIndex < 0) return;
        inputRefs.current[selectedIndex]?.focus();
    },[selectedIndex]);
    
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
                        onBlur={() => {setIsFocused(false),setSelectedIndex(-1)}}
                        onPaste={handlePaste}
                        className="flex mb-2 gap-2 outline-none"
                    >
                       {Array.from({ length: 4 }).map((_, i) => (
                            <input
                                key={i}
                                type="text"
                                ref={(el) => { inputRefs.current[i] = el; }}
                                maxLength={1}
                                value={input[i]}
                                onPaste={handlePaste}
                                onChange={(e) => handleChange(e, i)}
                                onKeyDown={(e) => handleKeyDown(e, i)}
                                onFocus={() => setSelectedIndex(i)}
                                className={`w-12 h-12 border-2 text-center text-2xl rounded bg-light text-dark
                                focus:outline-none caret-transparent focus:ring-0 ${
                                i === selectedIndex ? "border-blue-500 bg-blue-100" : "border-gray-300"
                                }`}
                                inputMode="text"
                                pattern="[A-Za-z]"
                                autoComplete="off"
                                autoCorrect="off"
                                spellCheck={false}

                            />
                        ))}
                    </div>
                    <button className="form-button-general" onClick={joinPartyButton} disabled={loading}>Join Party</button>
                </div>
            </div>
        </div>
    )
}