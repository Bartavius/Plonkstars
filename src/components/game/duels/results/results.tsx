import DuelsMapResult from "@/components/maps/DuelsMapResults";
import DuelsUIOverlay from "../uielement/mapUIOverlay";
import "@/app/game.css"
import "../duels.css"
import "./results.css"

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

    Object.keys(users).forEach((u:any) => (users[u].user_cosmetics.user_team_color = teams[users[u].team]?.color));

    
    const thisTeam = users[thisUser]?.team
    const bestGuess = Object.keys(teamGuesses).filter(t => teamHP[t].hp == teamHP[t].prev_hp);
    const bestTeam = Object.keys(teamGuesses).sort((a,b) => teamHP[b].hp - teamHP[a].hp);

    const leftTeam = thisTeam ?? bestGuess[0];
    const rightTeam = leftTeam !== bestGuess[0] ? bestGuess[0] : (leftTeam !== bestTeam[0] ? bestTeam[0] : bestTeam[1]);

    function getColor(color: number) {
        return `#${color.toString(16).padStart(6, "0")}`
    }

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


    console.log(teamGuesses[leftTeam],teamGuesses[rightTeam]);
    console.log(users);

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
            <div className="footer-grid">
                <div>
                    a
                </div>
                <div>
                    a
                </div>
                <div>
                    a
                </div>
            </div>
        </div>
    )
}