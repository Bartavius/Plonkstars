import "./summary.css";
export default function formatGuess({
    data
}:{
    data:{score: number, distance: number, time: number}
}){
    function distanceString(distance: number){
        if (distance === undefined) return "N/A";
        const m = Math.round(distance * 1000);
        const km = Math.round(m / 10) / 100;
        const num = km > 1 ? km : m;
        const unit = km > 1 ? "km" : "m";
        return `${num}${unit}`;
      };
    
    function timeString(time: number){
        if (time === undefined) return "Timed Out";
        const minutes = Math.floor(time / 60);
        const seconds = Math.round(time % 60);
        return minutes > 0 ? `${minutes.toString().padStart(2, "0")}:${seconds}`: `${seconds}s`;
    };
    return (
      <div className="summary-score-box">
        <div className="summary-score-text">{data.score}</div>
        <div className="summary-other-stats">{distanceString(data.distance)}</div>
        <div className="summary-other-stats">{timeString(data.time)}</div>
      </div>
    );
}