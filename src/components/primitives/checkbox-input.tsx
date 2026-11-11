interface CheckboxInputProps {
  data: any;
  setInput: (input: boolean) => void;
  value?: any;
  editable?: boolean;
}
function CheckboxInput({ data, setInput, value, editable = true }: CheckboxInputProps) {
  return (
    <div className="w-full relative flex flex-row gap-2">
      <label htmlFor={data.name}>{data.name}:</label>
      <input
        type="checkbox"
        id={data.name}
        checked={value}
        className="mr-2 cursor-pointer"
        onChange={(e) => setInput(e.target.checked)}
        disabled={!editable}
      />
    </div>
  );
}

export { CheckboxInput };
