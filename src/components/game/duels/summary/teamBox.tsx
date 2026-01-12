import "./teamBox.css";
export default function DuelsTeamBox({
    placement,
    teamInfo,
    teamHP,
    teamGuesses,
    roundsWon,
    onClick,
}:{
    placement: number,
    teamInfo: any,
    teamHP: number[],
    teamGuesses: any,
    roundsWon: number[],
    onClick?: () => void,
}){
    function getPlacementColor(placement: number): string {
        switch (placement) {
            case 1:
                return "#ffd700"; // gold
            case 2:
                return "#c0c0c0"; // silver
            case 3:
                return "#cd7f32"; // bronze
            default:
                return "white";
        }
    }

    function getColor(color: number) {
        return `#${color.toString(16).padStart(6, "0")}`
    }

    function getBrightness(color: number) {
        const r = (color >> 16) & 0xff;
        const g = (color >> 8) & 0xff;
        const b = color & 0xff;
        return (r * 299 + g * 587 + b * 114) / 1000;
    }

    console.log(teamGuesses);
    const brightness = getBrightness(teamInfo.color) > 128;
    const numWon = roundsWon.length;
    const avgScore = teamGuesses.reduce((acc: number, guesses:any) => acc + (guesses[0]?.score ?? 0), 0) / teamGuesses.length
    return (
        <div 
            className="duels-team-box-container dark-hover-button" 
            style={{
                borderColor:getPlacementColor(placement), 
                backgroundColor:getColor(teamInfo.color), 
                color: brightness ? "black": "white"
            }}
            onClick={onClick}
        >
            <div className="duels-team-box-placement" style={{color:getPlacementColor(placement)}}>#{placement}</div>
            <div className="duels-team-box-name">{teamInfo.name}</div>
            <div className="duels-team-box-stats">
                <div className="duels-team-box-stat-box">
                    <div className="duels-team-box-stat-title">
                        Num. Players
                    </div>
                    <div className="duels-team-box-stat-stat">
                        {teamInfo.members.length}
                    </div>
                </div>
                <div className="duels-team-box-stat-box">
                    <div className="duels-team-box-stat-title">
                        Rounds Won
                    </div>
                    <div className="duels-team-box-stat-stat">
                        {numWon} / {teamGuesses.length}
                    </div>
                </div>
                <div className="duels-team-box-stat-box">
                    <div className="duels-team-box-stat-title">
                        Avg. Score
                    </div>
                    <div className="duels-team-box-stat-stat">
                        {avgScore.toFixed(2)}
                    </div>
                </div>
            </div>
        </div>
    );
}