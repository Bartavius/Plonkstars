/* eslint-disable import/order -- Sorting these imports would reorder stylesheets, since
   CSS loads in import order. See "Imports" in CLAUDE.md. */
import "./map-ui-overlay.css";
import { HealthBar } from "./healthbar";

import { GamePanel } from "@/features/game/components/game-panel";
interface DuelsUIOverlayProps {
  time?: Date;
  timeLimit?: number;
  timeOffset?: number;
  roundNumber: number;
  multi: number;
  teamHP?: { [key: string]: { hp: number; prev_hp: number } };
  teams: { [key: string]: any };
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
    <div className="duels-ui-overlay">
      <GamePanel
        time={time}
        timeLimit={timeLimit}
        offset={timeOffset}
        display={[
          { key: "ROUND", value: roundNumber.toString() },
          { key: "MULTI", value: "x" + multi.toPrecision(2) },
        ]}
      />
      <div className="health-bars">
        <div className="left-team">
          <HealthBar
            health={teamHP ? teamHP[leftTeam].hp : teams[leftTeam].hp}
            maxHealth={maxHealth}
            teamInfo={teams[leftTeam]}
            prevHealth={teamHP && teamHP[leftTeam].prev_hp}
          />
        </div>
        <div className="right-team">
          <HealthBar
            health={teamHP ? teamHP[rightTeam].hp : teams[rightTeam].hp}
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
