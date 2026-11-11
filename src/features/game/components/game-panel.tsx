import { Timer } from "./timer";
import { ScoreDisplay } from "./score-display";
import "./game-panel.css";
interface GamePanelProps {
  time?: Date;
  timeLimit?: number;
  timeoutFunction?: () => void;
  display: [{ key: string; value: string }, { key: string; value: string }];
  offset?: number;
}

function GamePanel({ time, timeLimit, timeoutFunction, display, offset = 0 }: GamePanelProps) {
  return (
    <div className="game-panel">
      <div className="score-wrapper">
        <ScoreDisplay display={display} />
      </div>
      <div>
        {time && timeLimit && (
          <div>
            <Timer
              time={time}
              timeLimit={timeLimit}
              timeoutFunction={timeoutFunction}
              offset={offset}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export { GamePanel };
