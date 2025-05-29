import { useEffect, useState } from "react";

export default function TextInput({
    data,
    setInput,
    value
}:{
    data: any,
    setInput: (input:string) => void,
    value?:any
}) {
    const [input, setInputState] = useState(value || "");

    useEffect(() => {
        if (value !== undefined) {
            setInputState(value);
        }
    },[value]);


    return (
        <div className="w-full relative flex flex-row gap-2">
            <label
                className="block text-white"
                htmlFor={data.name}
            >
                {data.name}
            </label>
            <input
                type={data.type==="integer" ? "number":"text"}
                id={data.name}
                className="bg-dark text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={input === -1 ? "" : input}
                onChange={(e) => setInputState(e.target.value)}
                onBlur={() => setInput(input)}
            />
        </div>
    );
}