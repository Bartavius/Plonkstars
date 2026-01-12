"use client";
import DuelsMapResult from "@/components/maps/DuelsMapResults";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "./summary.css";
import DuelsTeamBox from "./teamBox";

export default function DuelsSummary({
    users,
    thisUser,
    teams,
    teamHP,
    teamGuesses,
    locations,
    startHP,
}:{
    users: {[key: string]: any},
    thisUser: string,
    teams: {[key: string]: any},
    teamHP: {[key: string]: number[]},
    startHP: number,
    teamGuesses: {[key: string]: any},
    locations: {lat:number,lng:number}[],
}){
    const router = useRouter();

    const teamPlacements = Object.keys(teams).sort((a,b) => {
        if (teamHP[b].length != teamHP[a].length){
            return teamHP[b].length - teamHP[a].length;
        }
        else{
            let index = teamHP[a].length - 1;
            while (teamHP[a][index] === teamHP[b][index] && index >= 0){
                index -= 1;
            }
            return teamHP[b][index] - teamHP[a][index];
        }
    });

    const winningTeam = teamPlacements[0];
    const thisTeam = users[thisUser]?.team ?? winningTeam;

    const roundsWon = teamPlacements.reduce((acc, teamId) => {
        acc[teamId] = teamHP[teamId].reduce((acc:any, hp, idx) => {
            if (hp == acc[0]) {
                acc[1].push(idx);
            }
            return [hp, acc[1]];
        }, [startHP, []])[1];
        return acc;
    },{} as {[key: string]: number[]});

    console.log(roundsWon);

    const [displayedGuesses, setDisplayedGuesses] = useState<{[key: string]: any}>(teamGuesses);
    const [displayedLocations, setDisplayedLocations] = useState<{lat:number,lng:number}[]>(locations);
    const [displayTeam, setDisplayTeam] = useState<string>(thisTeam);
    const [displayRound, setDisplayRound] = useState<number | "all">("all");

    function getColor(color: number) {
        return `#${color.toString(16).padStart(6, "0")}`
    }

    function distanceString(distance: number) {
        const m = distance === undefined ? -1 : Math.round(distance * 1000);
        const km = Math.round(m / 10) / 100;
        const userDistance = km > 1 ? km : m;
        const units = km > 1 ? "km" : "m";
        return `${userDistance}${units}`;
    };

    function timeString(time: number){
        const minutes = Math.floor(time / 60);
        const seconds = Math.round(time % 60);
        return minutes > 0
        ? `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`: `${seconds}s`;
    };

    function createTooltips(guess:any) {
        const user = users[guess.user];
        if(user){
            return <div>
                <div className="duels-results-tooltips-name">{user.username}</div>
                <hr/>
                <div><b>Team</b>: <span className="outlined-text" style={{color: getColor(teams[user.team]?.color)}}>{teams[user.team]?.name}</span></div>
                <div><b>Score</b>: {guess.score}</div>
                <div><b>Distance</b>: {distanceString(guess.distance)}</div>
                <div><b>Time</b>: {timeString(guess.time)}</div>
            </div>
        }
    }

    function selectRound(round: number | "all"){
        if (round === "all"){
            setDisplayedGuesses(teamGuesses);
            setDisplayedLocations(locations);
            setDisplayRound("all");
        }
        else{
            const newGuesses: {[key: string]: any} = {};
            Object.keys(teamGuesses).forEach((teamId) => {
                newGuesses[teamId] = [teamGuesses[teamId][round]];
            });
            console.log(newGuesses);
            setDisplayedGuesses(newGuesses);
            setDisplayedLocations([locations[round]]);
            setDisplayRound(round);
        }
    }

    return (
        <div>
            <div className="w-full h-[90dvh]">
                <DuelsMapResult 
                    locations={displayedLocations}
                    teamGuesses={displayedGuesses}
                    teams={teams}
                    users={users}
                    createTooltips={createTooltips}
                    showRound={displayRound === "all"}
                />
            </div>
            <div className="duels-summary-header-container">
                <div></div>
                <div className="duels-summary-header">Game Summary</div>
                <div className="duels-summary-back-to-party-wrapper">
                    <button className="btn-primary" onClick={() => router.push(`/party`)}>
                        Back To Party
                    </button>
                </div>
            </div>
            <div className="duels-team-container">
                {teamPlacements.map((teamId, placement) => 
                    <DuelsTeamBox 
                        key={placement} 
                        placement={placement + 1} 
                        teamInfo={teams[teamId]}
                        teamHP={teamHP[teamId]} 
                        teamGuesses={teamGuesses[teamId]}
                        roundsWon={roundsWon[teamId]}
                        onClick={() => setDisplayTeam(teamId)}
                    />
                )}
            </div>
        </div>
    )
}