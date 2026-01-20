import "./mapUIOverlay.css";
import HealthBar from "./healthbar";
import GamePanel from "@/components/game/GamePanel";

export default function DuelsUIOverlay({
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
}:{
    time?: Date,
    timeLimit?: number,
    timeOffset?: number,
    roundNumber: number,
    multi: number,
    teamHP?: {[key: string]: {hp:number,prev_hp:number}},
    teams: {[key: string]: any},
    maxHealth: number,
    leftTeam: string,
    rightTeam: string,

}) {
    return (
        <div className="duels-ui-overlay">
            <GamePanel 
                time={time} 
                timeLimit={timeLimit} 
                offset={timeOffset} 
                display={[{key:"ROUND",value:roundNumber.toString()},{key:"MULTI", value:"x" + multi.toPrecision(2)}]}
            />
            <div className="health-bars">
                <div className="left-team">
                    <HealthBar 
                        health={teamHP ? teamHP[leftTeam].hp : teams[leftTeam].hp} 
                        maxHealth={maxHealth} 
                        teamInfo={teams[leftTeam]} 
                        prevHealth={teamHP&&teamHP[leftTeam].prev_hp}
                    />
                </div>
                <div className="right-team">
                    <HealthBar 
                        health={teamHP ? teamHP[rightTeam].hp : teams[rightTeam].hp} 
                        maxHealth={maxHealth} 
                        teamInfo={teams[rightTeam]} 
                        prevHealth={teamHP&&teamHP[rightTeam].prev_hp}
                    />
                </div>
            </div>
        </div>
    )
}