import "./score-display.css";
interface ScoreDisplayProps {
  display: [{ key: string; value: string }, { key: string; value: string }];
}

function ScoreDisplay({ display }: ScoreDisplayProps) {
  return (
    <div className="score-wrapper">
      <div className="score-box">
        <div className="text-center inline p-6">
          <div className="text-red font-bold">
            <b>{display[0].key}</b>
          </div>
          <div>
            <b className="text-2xl text-white">{display[0].value}</b>
          </div>
        </div>

        <div className="text-center inline p-6">
          <div className="text-red font-bold">
            <b>{display[1].key}</b>
          </div>
          <div>
            <b className="text-2xl text-white">{display[1].value}</b>
          </div>
        </div>
      </div>
    </div>
  );
}

export { ScoreDisplay };
