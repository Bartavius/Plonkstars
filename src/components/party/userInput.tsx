import TextInput from "./textInput"
import SliderInput from "./sliderInput";
import CheckboxInput from "./checkboxInput";

export default function UserInput({
    inputType,
    data,
    value,
    editable = true,
    setInput,
    setError,
}:{
    inputType: "input" | "slider" | "checkbox",
    data:any,
    value?:any,
    editable?: boolean,
    setInput: (data:any) => void,
    setError: (error:string) => void
}){
    function setRestrictions(value:any){
        if (data.type === "number" && typeof(value) === "string") {
            try{
                value = parseFloat(value);
            } catch (e) {
                setError(`${data.name} must be a number`);
                return;
            }
        }

        if (data.type === "integer" && typeof(value) === "string") {
            try{
                value = parseInt(value);
            } catch (e) {
                setError(`${data.name} must be an integer`);
                return;
            }
        }

        if (data.type === "integer" || data.type === "number") {
            if (data.min !== undefined && value < data.min && !(data.infinity && value === -1)){ 
                setError(`${data.name} cannot be less than ${data.min}`); 
                return;
            }
            if (data.max !== undefined && value > data.max){ 
                setError(`${data.name} cannot be greater than ${data.max}`);
                return;
            }
        }
        setInput(value);
    }
    return (
        inputType === "input" ? <TextInput data={data} setInput={setRestrictions} value={value} editable={editable}/> :
        inputType === "slider" ? <SliderInput data={data} setInput={setRestrictions} value={value} editable={editable}/> : 
        inputType === "checkbox" ? <CheckboxInput data={data} setInput={setRestrictions} value={value} editable={editable}/> : null
    )
}