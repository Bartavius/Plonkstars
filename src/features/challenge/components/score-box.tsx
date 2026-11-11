import "./summary.css";
interface ScoreBoxProps {
  data: { score: number; distance?: number; time?: number };
}

function ScoreBox({ data }: ScoreBoxProps) {
  function distanceString(distance: number | undefined) {
    if (distance === undefined) {
      return "N/A";
    }
    const m = Math.round(distance * 1000);
    const km = Math.round(m / 10) / 100;
    const num = km > 1 ? km : m;
    const unit = km > 1 ? "km" : "m";
    return `${num}${unit}`;
  }

  function timeString(time: number | undefined) {
    if (time === undefined) {
      return "Timed Out";
    }
    const minutes = Math.floor(time / 60);
    const seconds = Math.round(time % 60);
    return minutes > 0
      ? `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      : `${seconds}s`;
  }
  return (
    <div className="flex justify-center flex-col items-center w-full">
      <div className="text-[1rem] font-bold">{data.score}</div>
      <div className="text-[0.75rem] text-[gray]">{distanceString(data.distance)}</div>
      <div className="text-[0.75rem] text-[gray]">{timeString(data.time)}</div>
    </div>
  );
}

export { ScoreBox };
