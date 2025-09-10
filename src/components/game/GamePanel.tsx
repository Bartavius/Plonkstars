import Timer from './timer/timer';
import ScoreDisplay from "./ScoreDisplay/ScoreDisplay";
import "./GamePanel.css"
const GamePanel = ({
    time,
    timeLimit,
    timeoutFunction,
    display,
    offset = 0,
}: {
    time?: Date;
    timeLimit?: number ;
    timeoutFunction?: () => void;
    display: [{key:string,value:string}, {key:string,value:string}];
    offset?: number;
}) => {
    return (
        <div className="game-panel">
            <div className="score-wrapper">
                <ScoreDisplay display={display}/>
            </div>
            <div>
                {time && timeLimit && (
                    <div>
                        <Timer time={time} timeLimit={timeLimit} timeoutFunction={timeoutFunction} offset={offset}/>
                    </div>
                )}
            </div>
        </div>
    );
}
export default GamePanel;