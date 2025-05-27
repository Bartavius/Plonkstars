export default function CheckboxInput({
    data,
    setInput,
    value
}:{
    data: any,
    setInput: (input:boolean) => void,
    value:any
}) {
    return (
        <div className="w-full relative">
            <input
                type="checkbox"
                id={data.name}
                checked={value}
                className="mr-2 cursor-pointer"
                onChange={(e) => 
                    setInput(e.target.checked)
                }
            />
            <label
                htmlFor={data.name}
            >
                {data.name}
            </label>
        </div>
    );
}