import "./switch.css";

export default function Switch({
    toggle,
    setToggle,
}: {
    toggle: boolean;
    setToggle: (bool: boolean) => void;
}) {
  return (
    <label className="switch">
      <input type="checkbox" onChange={() => setToggle(!toggle)} checked={toggle}/>
      <span className="slider round"></span>
    </label>
  );
}
