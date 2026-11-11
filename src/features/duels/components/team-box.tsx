import type { DuelsSummaryGuess } from "../types/duels-guess";
import type { DuelsTeam } from "../types/duels-team";
interface DuelsTeamBoxProps {
  placement: number;
  teamInfo: DuelsTeam;
  teamHP: number[];
  teamGuesses: DuelsSummaryGuess[][];
  roundsWon: number[];
  onClick?: () => void;
}

function DuelsTeamBox({
  placement,
  teamInfo,
  teamHP,
  teamGuesses,
  roundsWon,
  onClick,
}: DuelsTeamBoxProps) {
  function getPlacementColor(placement: number): string {
    switch (placement) {
      case 1:
        return "#ffd700"; // gold
      case 2:
        return "#c0c0c0"; // silver
      case 3:
        return "#cd7f32"; // bronze
      default:
        return "white";
    }
  }

  function getColor(color: number) {
    return `#${color.toString(16).padStart(6, "0")}`;
  }

  function getBrightness(color: number) {
    const r = (color >> 16) & 0xff;
    const g = (color >> 8) & 0xff;
    const b = color & 0xff;
    return (r * 299 + g * 587 + b * 114) / 1000;
  }

  const brightness = getBrightness(teamInfo.color) > 128;
  const numWon = roundsWon.length;
  const avgScore =
    teamGuesses.reduce<number>((acc, guesses) => acc + (guesses[0]?.score ?? 0), 0) /
    teamGuesses.length;
  return (
    <div
      className="bg-dark-blue border-2 border-solid border-plonk-stars-white rounded-2xl flex flex-col justify-center items-center text-plonk-stars-white p-4 dark-hover-button"
      style={{
        borderColor: getPlacementColor(placement),
        backgroundColor: getColor(teamInfo.color),
        color: brightness ? "black" : "white",
      }}
      onClick={onClick}
    >
      <div
        className="text-[1rem] font-bold [-webkit-text-stroke:0.5px_gray]"
        style={{ color: getPlacementColor(placement) }}
      >
        #{placement}
      </div>
      <div className="text-[1.25rem] font-bold mt-2">{teamInfo.name}</div>
      <div className="flex flex-row gap-4 mt-2">
        <div className="duels-team-box-stat-box">
          <div className="text-[0.75rem] font-bold text-center">Players</div>
          <div className="text-[1rem] text-center">{teamInfo.members.length}</div>
        </div>
        <div className="duels-team-box-stat-box">
          <div className="text-[0.75rem] font-bold text-center">Rounds Won</div>
          <div className="text-[1rem] text-center">
            {numWon} / {teamGuesses.length}
          </div>
        </div>
        <div className="duels-team-box-stat-box">
          <div className="text-[0.75rem] font-bold text-center">Avg. Score</div>
          <div className="text-[1rem] text-center">{avgScore.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}

export { DuelsTeamBox };
