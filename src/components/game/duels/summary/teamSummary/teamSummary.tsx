
import { useState } from "react";
import DuelsTeamRoundSummary from "./roundDisplay";
import DuelsTeamBox from "./teamBox";
import "./teamSummary.css";

export default function DuelsTeamSummary({
    users,
    thisUser,
    teams,
    teamHP,
    startHP,
    teamGuesses,
    locations,
    router,
    setDisplayRound,
}:{
    users: {[key: string]: any},
    thisUser: string,
    teams: {[key: string]: any},
    teamHP: {[key: string]: number[]},
    startHP: number,
    teamGuesses: {[key: string]: any},
    locations: {lat:number,lng:number}[],
    router: any,
    setDisplayRound: (round: number | "all") => void,
}){
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

    const [displayTeam, _setDisplayTeam] = useState<string>(thisTeam);

    function setDisplayTeam(teamId: string) {
        _setDisplayTeam(teamId);
        router.push("#team-summary");
    }

    const numRounds = locations.length;
    const bestGuesses = Array(numRounds).fill(null);

    teamPlacements.forEach((teamId) => {
        teamGuesses[teamId].forEach((roundGuesses: any, roundIndex: number) => {
            roundGuesses.forEach((guess: any) => {
                if (bestGuesses[roundIndex] === null || guess.distance < bestGuesses[roundIndex].distance){
                    bestGuesses[roundIndex] = guess;
                }
            });
        });
    });


    const roundsWon = teamPlacements.reduce((acc, teamId) => {
        acc[teamId] = teamHP[teamId].reduce((acc:any, hp, idx) => {
            if (hp == acc[0]) {
                acc[1].push(idx);
            }
            return [hp, acc[1]];
        }, [startHP, []])[1];
        return acc;
    },{} as {[key: string]: number[]});

    const displayTeamInfo = teams[displayTeam];
    const displayTeamGuesses = teamGuesses[displayTeam];
    const displayTeamHP = teamHP[displayTeam];
    return (
        <div>
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
            <div className="duels-team-summary-container" id="team-summary">
                <div className="duels-team-summary-title">{displayTeamInfo.name} Summary</div>
                <div className="duels-team-summary-rounds">
                    {displayTeamGuesses.map((guesses:any,round:number) =>
                        <DuelsTeamRoundSummary 
                            key={round}
                            roundNumber={round + 1}
                            teamInfo={displayTeamInfo}
                            prevHp={round == 0 ? startHP: displayTeamHP[round - 1]}
                            hp={displayTeamHP[round]}
                            maxHealth={startHP}
                            bestGuess={bestGuesses[round]}
                            bestTeamGuess={guesses[0]} 
                            users={users}
                            teams={teams}
                            onClick={() => setDisplayRound(round)}
                        />
                    )}  
                </div>
            </div>
        </div>
    )
}