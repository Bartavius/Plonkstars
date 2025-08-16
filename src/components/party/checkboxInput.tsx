export default function CheckboxInput({
    data,
    setInput,
    value,
    editable = true,
}:{
    data: any,
    setInput: (input:boolean) => void,
    value?:any,
    editable?: boolean,
}) {
    return (
        <div className="w-full relative flex flex-row gap-2">
            <label
                htmlFor={data.name}
            >
                {data.name}:
            </label>
            <input
                type="checkbox"
                id={data.name}
                checked={value}
                className="mr-2 cursor-pointer"
                onChange={(e) => 
                    setInput(e.target.checked)
                }
                disabled={!editable}
            />
        </div>
    );
}