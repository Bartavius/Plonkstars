import { BsInfinity } from "react-icons/bs"
import "@/app/game.css";

export default function SliderInput({
    data,
    setInput,
    value,
    editable = true,
}:{
    data: any,
    setInput: (input:any) => void,
    value?:any
    editable?: boolean
}) {
    const valueDisplay = value === -1 ? <BsInfinity className="inline" /> : value;

    let label;
    if (data.format) {
        const parts = data.format.split("<value>");
        label = (
            <>
            {parts[0]}
            {valueDisplay}
            {parts[1]}
            </>
        );
    } else {
        label = valueDisplay;
    }

    return (
        <div className="w-full relative flex flex-col gap-2">
           <label className="block text-white" htmlFor={data.name}>
                {data.name}: {label}
            </label>
            <input
                className="focus:outline-none input-field cursor-pointer"
                style={{ padding: "0px" }}
                type="range"
                id={data.name}
                min={data.min}
                max={data.infinity? data.max+1:data.max}
                step={data.step || 1}
                value={value === -1 ? data.max + 1 : value}
                onChange={(e) => {
                    const newValue = Number(e.target.value);
                    setInput(newValue === data.max + 1 ? -1 : newValue);
                }}
                disabled={!editable}
            />
        </div>
    )
}