import "./ScoreDisplay.css"
const ScoreDisplay = ({
    totalScore,
    roundNumber,
}: {
    totalScore: number;
    roundNumber: number;
}) => {
    return (
        <div className="score-wrapper">
            <div className="score-box">
                <div className="text-center inline p-6">
                    <div className="text-red font-bold">
                        <b>SCORE</b>
                    </div>
                    <div>
                        <b className="text-2xl text-white">
                            {totalScore}
                        </b>
                    </div>
                </div>

                <div className="text-center inline p-6">
                    <div className="text-red font-bold">
                        <b>ROUND</b>
                    </div>
                    <div>
                        <b className="text-2xl text-white">
                            {roundNumber}
                        </b>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ScoreDisplay;