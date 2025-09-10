import DuelsMapResult from "@/components/maps/DuelsMapResults";
import DuelsUIOverlay from "../uielement/mapUIOverlay";
import "../duels.css"
import { q } from "framer-motion/client";

export default function DuelsResults({
    teamGuesses,
    location,
    users,
    teams,
    startHP,
    roundNumber,
    multi,
    thisUser,
    teamHP,
}:{
    teamGuesses:{[key:string]:any},
    location:{lat:number,lng:number},
    users:{[key:string]:any},
    teams:{[key:string]:any},
    startHP:number,
    roundNumber:number,
    multi:number,
    thisUser: string,
    teamHP: {[key: string]: {hp:number,prev_hp:number}},
}){
    const guesses = Object.keys(teamGuesses).reduce((acc,teamId:string) => {
        acc[teamId] = [teamGuesses[teamId]]
        return acc
    },{} as {[key:string]:any});

    
    const thisTeam = users[thisUser]?.team
    const bestGuess = Object.keys(teamGuesses).filter(t => teamHP[t].hp == teamHP[t].prev_hp);
    const bestTeam = Object.keys(teamGuesses).sort((a,b) => teamHP[b].hp - teamHP[a].hp);

    const leftTeam = thisTeam ?? bestGuess[0];
    const rightTeam = leftTeam !== bestGuess[0] ? bestGuess[0] : (leftTeam !== bestTeam[0] ? bestTeam[0] : bestTeam[1]);


    function createTooltips(guess:any) {
        const user = users[guess.user];
        if(user){
            return <div>
                <div><b>{user.username}</b></div>
                <div>Team: {teams[user.team]?.name}</div>
            </div>
        }
    }
    return (
        <div>
            <DuelsUIOverlay 
                roundNumber={roundNumber} 
                multi={multi} 
                maxHealth={startHP} 
                teams={teams} 
                users={users} 
                thisUser={thisUser} 
                teamHP={teamHP} 
                leftTeam={thisTeam} 
                rightTeam={rightTeam}
            />
            <div className="duels-results-map-container">
                <DuelsMapResult
                    locations={[location]}
                    teamGuesses={guesses}
                    teams={teams}
                    users={users}
                    createTooltips={createTooltips}
                />
            </div>
        </div>
    )
}