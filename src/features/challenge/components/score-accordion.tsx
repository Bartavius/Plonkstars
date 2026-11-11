import { Table } from "@/components/primitives/table";
import { UserIcon } from "@/features/user/components/user-icon";
import type { RoundResultUser } from "@/features/challenge/types/round-results";

import { ScoreBox } from "./score-box";
interface ScoreAccordionProps {
  open: boolean;
  className?: string;
  guesses: RoundResultUser[];
  user?: string;
}

function ScoreAccordion({ open, className = "", guesses, user }: ScoreAccordionProps) {
  const headers = {
    total: "Total",
    guess: "Guess",
  };

  const data = guesses.map((guess) => {
    return {
      total: <ScoreBox data={guess} />,
      guess: <ScoreBox data={guess.guess} />,
      heading: (
        <div className="w-full flex flex-col items-center justify-center">
          <div className="text-white text-[2rem] flex flex-row justify-center gap-2 items-center">
            #{guess.rank}
            <UserIcon data={guess.user.user_cosmetics} className="w-8" />
          </div>

          <div className="text-lightest-blue text-[1rem] h-full">{guess.user.username}</div>
        </div>
      ),
      style: guess.user.username === user && "bg-dark-blue",
    };
  });
  return (
    <div className={`${className} bottom-20 left-4`}>
      {open && (
        <div className="overflow-y-auto rounded-[4px] p-2 min-w-[30vw] max-h-[50vh] bg-theme-blue">
          <Table data={data} headers={headers} rowHeader="heading" className="w-full" />
        </div>
      )}
    </div>
  );
}

export { ScoreAccordion };
