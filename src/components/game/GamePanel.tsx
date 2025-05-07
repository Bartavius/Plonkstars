import Timer from './timer/timer';
import ScoreDisplay from "./ScoreDisplay/ScoreDisplay";
import "./GamePanel.css"
const GamePanel = ({
    time,
    timeLimit,
    timeoutFunction,
    afterTimeoutFunction,
    totalScore,
    roundNumber,
}: {
    time?: Date;
    timeLimit?: number ;
    timeoutFunction?: () => void;
    afterTimeoutFunction?: () => void;
    totalScore: number;
    roundNumber: number;
}) => {
    return (
        <div className='game-panel'>
            <div className="score-wrapper">
                <ScoreDisplay totalScore={totalScore} roundNumber={roundNumber}/>
            </div>
            <div>
                {time && timeLimit && (
                    <div>
                        <Timer time={time} timeLimit={timeLimit} timeoutFunction={timeoutFunction} afterTimeoutFunction={afterTimeoutFunction}/>
                    </div>
                )}
            </div>
        </div>
    );
}
export default GamePanel;