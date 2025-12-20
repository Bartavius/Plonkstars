import UserIcon from "@/components/user/UserIcon";
import "./results.css";

export default function GuessFooter({
    team,
    bestGuess,
    bestGuessUserCosmetics,
}:{
    team:any
    bestGuess?: any,
    bestGuessUserCosmetics?: any,
}){
    function getColor(color: number) {
        return `#${color.toString(16).padStart(6, "0")}`
    }

    function getTextColor(color: number) {
        const r = (color >> 16) & 0xff;
        const g = (color >> 8) & 0xff;
        const b = color & 0xff;
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128 ? "#000000" : "#FFFFFF";
    }

    const textColor = getTextColor(team.color);
    const user = bestGuess ? bestGuess.user :  "None";
    const score = bestGuess ? bestGuess.score : 0;

    return (
        <div className="duels-results-footer-guess-display" style={{backgroundColor: getColor(team.color), color: textColor}}>
            {bestGuess && <UserIcon data={bestGuessUserCosmetics} className="w-[100px]"/>}
            <div className={`duels-results-footer-guess-display-item`}>
                <div className="duels-results-footer-guess-display-header">
                    User
                </div>
                {user}
            </div>
            <div className="duels-results-footer-guess-display-item">
                <div className="duels-results-footer-guess-display-header">
                    Score
                </div>
                {score}
            </div>
        </div>
    )
}