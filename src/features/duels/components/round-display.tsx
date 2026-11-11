import { TbMoodSadFilled } from "react-icons/tb";

import { UserIcon } from "@/features/user/components/user-icon";

import { HealthBar } from "./healthbar";
import "./healthbar";
import type { DuelsSummaryGuess } from "../types/duels-guess";
import type { DuelsTeam } from "../types/duels-team";
import type { DuelsUser } from "../types/duels-user";
interface DuelsTeamRoundSummaryProps {
  roundNumber: number;
  teamInfo: DuelsTeam;
  prevHp: number;
  hp: number;
  maxHealth: number;
  bestGuess: DuelsSummaryGuess | null;
  bestTeamGuess?: DuelsSummaryGuess;
  users: Record<string, DuelsUser>;
  teams: Record<string, DuelsTeam>;
  onClick: () => void;
}

function DuelsTeamRoundSummary({
  roundNumber,
  teamInfo,
  prevHp,
  hp,
  maxHealth,
  bestGuess,
  bestTeamGuess,
  users,
  teams,
  onClick,
}: DuelsTeamRoundSummaryProps) {
  function getColor(color: number) {
    return `#${color.toString(16).padStart(6, "0")}`;
  }

  function getBrightness(color: number) {
    const r = (color >> 16) & 0xff;
    const g = (color >> 8) & 0xff;
    const b = color & 0xff;
    return (r * 299 + g * 587 + b * 114) / 1000;
  }

  const bestGuessTeam = bestGuess && teams[users[bestGuess.user].team];
  return (
    <div
      className="bg-theme-blue border-2 border-solid border-plonk-stars-white rounded-2xl flex flex-col justify-center items-center text-plonk-stars-white p-4  dark-hover-button"
      onClick={onClick}
    >
      <div className="text-black text-[1.25rem] font-bold">Round {roundNumber}</div>
      <div className="min-w-[300px] h-[50px]">
        <HealthBar health={hp} maxHealth={maxHealth} teamInfo={teamInfo} prevHealth={prevHp} />
      </div>
      {bestGuess ? (
        <div className="mt-2 flex flex-row gap-2 justify-center w-full">
          <div className="flex flex-col items-center w-full border-2 border-solid border-plonk-stars-white rounded-lg p-2 text-black bg-lighter-blue">
            <div className="text-[0.75rem] font-bold text-center">Best Guess</div>
            <div className="mt-2 w-12">
              <UserIcon data={users[bestGuess.user]} />
            </div>
            <div className="text-[0.6rem] font-bold text-left w-full">User: {bestGuess.user}</div>
            <div className="text-[0.6rem] font-bold text-left w-full">
              Team:{" "}
              <span
                className={`duels-team-summary-round-guess-team ${getBrightness(bestGuessTeam!.color) > 128 ? "text-shadow-dark" : "text-shadow-light"}`}
                style={{ color: getColor(bestGuessTeam!.color) }}
              >
                {bestGuessTeam!.name}
              </span>
            </div>
            <div className="text-[0.6rem] font-bold text-left w-full">Score: {bestGuess.score}</div>
          </div>
          {bestTeamGuess ? (
            <div className="flex flex-col items-center w-full border-2 border-solid border-plonk-stars-white rounded-lg p-2 text-black bg-lighter-blue">
              <div className="text-[0.75rem] font-bold text-center">Best Team Guess</div>
              <div className="mt-2 w-12">
                <UserIcon data={users[bestTeamGuess.user]} />
              </div>
              <div className="text-[0.6rem] font-bold text-left w-full">
                User: {bestTeamGuess.user}
              </div>
              <div className="text-[0.6rem] font-bold text-left w-full">
                Score: {bestTeamGuess.score}
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center justify-center text-[0.75rem] font-bold">
              <div className="text-[0.75rem] font-bold text-center">No Team Guess Made</div>
              <TbMoodSadFilled title="Next time you should click the map!" size={48} />
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-row justify-center items-center text-[1rem] font-bold gap-2">
          No Guesses Made <TbMoodSadFilled title="No one made a guess? Are we for real" />
        </div>
      )}
    </div>
  );
}

export { DuelsTeamRoundSummary };
