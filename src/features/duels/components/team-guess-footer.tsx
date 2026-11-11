import { UserIcon } from "@/features/user/components/user-icon";
import type { UserIconCosmetics } from "@/features/cosmetics/types/user-icon-cosmetics";
import "./results.css";

import type { DuelsGuess } from "../types/duels-guess";
import type { DuelsTeam } from "../types/duels-team";
interface GuessFooterProps {
  team: DuelsTeam;
  bestGuess?: DuelsGuess;
  bestGuessUserCosmetics?: UserIconCosmetics;
}

function GuessFooter({ team, bestGuess, bestGuessUserCosmetics }: GuessFooterProps) {
  function getColor(color: number) {
    return `#${color.toString(16).padStart(6, "0")}`;
  }

  function getTextColor(color: number) {
    const r = (color >> 16) & 0xff;
    const g = (color >> 8) & 0xff;
    const b = color & 0xff;
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? "#000000" : "#FFFFFF";
  }

  const textColor = getTextColor(team.color);
  const user = bestGuess ? bestGuess.user : "None";
  const score = bestGuess ? bestGuess.score : 0;

  return (
    <div
      className="w-[90%] h-[80%] rounded-2xl py-1 px-2 flex justify-between"
      style={{ backgroundColor: getColor(team.color), color: textColor }}
    >
      {bestGuess && <UserIcon data={bestGuessUserCosmetics!} className="w-[100px]" />}
      <div className={`w-full h-full text-center`}>
        <div className="w-full font-[1000]">User</div>
        {user}
      </div>
      <div className="w-full h-full text-center">
        <div className="w-full font-[1000]">Score</div>
        {score}
      </div>
    </div>
  );
}

export { GuessFooter };
