import HealthBar from "@/components/game/duels/uielement/healthbar";
import UserIcon from "@/components/user/UserIcon";
import "./teamSummary.css";
import "@/components/game/duels/uielement/healthbar";
import { TbMoodSadFilled } from "react-icons/tb";
export default function DuelsTeamRoundSummary({
    roundNumber,
    teamInfo,
    prevHp,
    hp,
    maxHealth,
    bestGuess,
    bestTeamGuess,
    users,
    teams,
    onClick
}:{
    roundNumber: number,
    teamInfo: any,
    prevHp: number,
    hp: number,
    maxHealth: number,
    bestGuess: any,
    bestTeamGuess: any,
    users: {[key: string]: any},
    teams: {[key: string]: any},
    onClick: () => void,
}){
    function getColor(color: number) {
        return `#${color.toString(16).padStart(6, "0")}`
    }

    function getBrightness(color: number) {
        const r = (color >> 16) & 0xff;
        const g = (color >> 8) & 0xff;
        const b = color & 0xff;
        return (r * 299 + g * 587 + b * 114) / 1000;
    }

    const bestGuessTeam = bestGuess && teams[users[bestGuess.user].team];
    return (
        <div className="duels-team-summary-round-box  dark-hover-button" onClick={onClick}>
            <div className="duels-team-summary-round-header">Round {roundNumber}</div>
            <div className="duels-team-summary-round-healthbar">
                <HealthBar 
                    health={hp}
                    maxHealth={maxHealth}
                    teamInfo={teamInfo}
                    prevHealth={prevHp}
                />
            </div>
            {bestGuess ?
            <div className="duels-team-summary-round-guesses-wrapper">
                <div className="duels-team-summary-round-guess">
                    <div className="duels-team-summary-round-guess-title">Best Guess</div>
                    <div className="duels-team-summary-round-guess-user-icon">
                        <UserIcon data={users[bestGuess.user]}/>
                    </div>
                    <div className="duels-team-summary-round-guess-stat">
                        User: {bestGuess.user}
                    </div>
                    <div className="duels-team-summary-round-guess-stat">
                        Team: <span className={`duels-team-summary-round-guess-team ${getBrightness(bestGuessTeam.color) > 128 ? "text-shadow-dark" : "text-shadow-light"}`} style={{color: getColor(bestGuessTeam.color)}}>{bestGuessTeam.name}</span>
                    </div>
                     <div className="duels-team-summary-round-guess-stat">
                        Score: {bestGuess.score}
                    </div>
                </div>
                {bestTeamGuess ? 
                <div className="duels-team-summary-round-guess">
                    <div className="duels-team-summary-round-guess-title">Best Team Guess</div>
                    <div className="duels-team-summary-round-guess-user-icon">
                        <UserIcon data={users[bestTeamGuess.user]}/>
                    </div>
                    <div className="duels-team-summary-round-guess-stat">
                        User: {bestTeamGuess.user}
                    </div>
                    <div className="duels-team-summary-round-guess-stat">
                        Score: {bestTeamGuess.score}
                    </div>
                </div>:
                <div className="duels-team-summary-round-guess-no-guess">
                    <div className="duels-team-summary-round-guess-title">No Team Guess Made</div>
                    <TbMoodSadFilled title="Next time you should click the map!" size={48}/>
                </div>
                }
            </div>:
            <div className="duels-team-summary-round-no-guess">
                No Guesses Made <TbMoodSadFilled title="No one made a guess? Are we for real"/>
            </div>
            }
        </div>
    )
}