/* eslint-disable import/order -- Sorting these imports would reorder stylesheets, since
   CSS loads in import order. See "Imports" in CLAUDE.md. */
import { HealthBar } from "./healthbar";

import { GamePanel } from "@/features/game/components/game-panel";
import type { DuelsTeam } from "../types/duels-team";
interface DuelsUIOverlayProps {
  time?: Date;
  timeLimit?: number;
  timeOffset?: number;
  roundNumber: number;
  multi: number;
  teamHP?: { [key: string]: { hp: number; prev_hp: number } };
  teams: Record<string, DuelsTeam & { hp?: number }>;
  maxHealth: number;
  leftTeam: string;
  rightTeam: string;
}

function DuelsUIOverlay({
  time,
  timeLimit,
  timeOffset,
  roundNumber,
  multi,
  teams,
  teamHP,
  maxHealth,
  leftTeam,
  rightTeam,
}: DuelsUIOverlayProps) {
  return (
    <div className="absolute w-full h-full pointer-events-none">
      <GamePanel
        time={time}
        timeLimit={timeLimit}
        offset={timeOffset}
        display={[
          { key: "ROUND", value: roundNumber.toString() },
          { key: "MULTI", value: "x" + multi.toPrecision(2) },
        ]}
      />
      <div className="pt-4 h-16 flex justify-between px-4 z-[1]">
        <div className="z-[1] h-full w-80">
          <HealthBar
            health={teamHP ? teamHP[leftTeam].hp : teams[leftTeam].hp!}
            maxHealth={maxHealth}
            teamInfo={teams[leftTeam]}
            prevHealth={teamHP && teamHP[leftTeam].prev_hp}
          />
        </div>
        <div className="z-[1] h-full w-80">
          <HealthBar
            health={teamHP ? teamHP[rightTeam].hp : teams[rightTeam].hp!}
            maxHealth={maxHealth}
            teamInfo={teams[rightTeam]}
            prevHealth={teamHP && teamHP[rightTeam].prev_hp}
          />
        </div>
      </div>
    </div>
  );
}

export { DuelsUIOverlay };
