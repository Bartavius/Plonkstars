import { colorGradient } from "@/lib/color-gradient";

import type { DuelsTeam } from "../types/duels-team";
interface HealthBarProps {
  health: number;
  maxHealth: number;
  fontSize?: string;
  teamInfo: DuelsTeam;
  prevHealth?: number;
}

function HealthBar({ health, maxHealth, fontSize = "1rem", teamInfo, prevHealth }: HealthBarProps) {
  function getColor(color: number) {
    return `#${color.toString(16).padStart(6, "0")}`;
  }

  function getBrightness(color: number) {
    const r = (color >> 16) & 0xff;
    const g = (color >> 8) & 0xff;
    const b = color & 0xff;
    return (r * 299 + g * 587 + b * 114) / 1000;
  }

  const healthPercentage = health / maxHealth;
  const healthLost = prevHealth ? prevHealth - health : 0;
  const brightness = getBrightness(teamInfo.color);
  const color = getColor(teamInfo.color);

  return (
    <div className="flex flex-col [align-items:start] [justify-content:left] w-full h-full">
      <div
        style={{ backgroundColor: color }}
        className={`px-1 text-[0.5rem] h-[20%] inline-block w-auto rounded-[0.5rem_1rem_0_0] ${brightness > 128 ? "text-black" : "text-white"}`}
      >
        {teamInfo.name}
      </div>
      <div
        style={{ backgroundColor: color }}
        className="w-full h-[80%] relative rounded-[0rem_0.5rem_0.5rem_0.5rem] p-[3px]"
      >
        <div
          className="relative h-full rounded-lg z-[1]"
          style={{
            backgroundColor: colorGradient({ percent: healthPercentage }),
            width: `${healthPercentage * 100}%`,
          }}
        />
        <div
          className="top-0 absolute text-white w-full h-full flex text-center items-center justify-center [text-shadow:0_0_3px_rgba(0,0,0,0.7)] font-bold z-[2]"
          style={{ fontSize }}
        >
          {health}{" "}
          {healthLost !== 0 && (
            <div className="text-plonk-stars-red text-[0.75rem] font-bold p-4 [text-shadow:0_0_5px_#ff1a1a,0_0_10px_#ff1a1a,0_0_20px_#ff4d4d,0_0_40px_#ff6666]">
              -{healthLost}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { HealthBar };
