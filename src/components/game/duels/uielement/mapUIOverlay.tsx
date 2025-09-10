import Timer from "@/components/game/timer/timer";
import "./mapUIOverlay.css";
import HealthBar from "./healthbar";
import { useEffect, useState } from "react";
import GamePanel from "@/components/game/GamePanel";

export default function DuelsUIOverlay({
    time,
    timeLimit,
    timeOffset,
    roundNumber,
    multi,
    teams,
    teamHP,
    users,
    thisUser,
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
    users: {[key: string]: any},
    thisUser: string,
    maxHealth: number,
    leftTeam: string,
    rightTeam: string,

}) {
    const thisTeam = users[thisUser].team ?? Object.keys(teams).reduce((bestTeam: string | undefined, team) => {
        if(!bestTeam){
            return team;
        }
        if(teams[bestTeam].hp < teams[team].hp){
            return team;
        }
    },Object.keys(teams)[0]);
    const teamsToDisplay = Object.keys(teams).filter(t => t != thisTeam && teams[t].hp > 0);
    
    
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
                        users={users}
                        prevHealth={teamHP&&teamHP[leftTeam].prev_hp}
                    />
                </div>
                <div className="right-team">
                    <HealthBar 
                        health={teamHP ? teamHP[rightTeam].hp : teams[rightTeam].hp} 
                        maxHealth={maxHealth} 
                        teamInfo={teams[rightTeam]} 
                        users={users}
                        prevHealth={teamHP&&teamHP[rightTeam].prev_hp}
                    />
                </div>
            </div>
        </div>
    )
}