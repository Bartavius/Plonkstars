
import { useState } from "react";
import DuelsTeamRoundSummary from "./roundDisplay";
import DuelsTeamBox from "./teamBox";
import "./teamSummary.css";
import UserIcon from "@/components/user/UserIcon";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import playerTitlesJSON from "./playerTitles.json" assert { type: "json" };

const PLAYER_TITLES = (playerTitlesJSON as {[key: string]: any});
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
    const [currentTeamPlayerIdx, _setCurrentTeamPlayerIdx] = useState<number>(0);

    function setDisplayTeam(teamId: string) {
        _setDisplayTeam(teamId);
        _setCurrentTeamPlayerIdx(0);
        router.push("#team-summary");
    }

    function leftPlayer() {
        _setCurrentTeamPlayerIdx((prev) => (prev - 1 + teams[displayTeam].members.length) % teams[displayTeam].members.length);
    }

    function rightPlayer() {
        _setCurrentTeamPlayerIdx((prev) => (prev + 1) % teams[displayTeam].members.length);
    }

    function getRandomTitle(title: string) {
        const titles = PLAYER_TITLES[title]?.titles;
        return titles[Math.floor(Math.random() * titles.length)];
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

    const playerValue: {[key: string]: number} = {}
    const numPlayersInTeam = teams[displayTeam].members.length;
    teamGuesses[displayTeam].forEach((roundGuesses: any, round: number) => {
        roundGuesses.forEach((guess: any, index:number) => {
            if (!(guess.user in playerValue)){
                playerValue[guess.user] = 0;
            }
            if (index == 0){
                if (bestGuesses[round].user == guess.user){
                    playerValue[guess.user] += 4 * numPlayersInTeam;
                }
                else{
                    playerValue[guess.user] += 2 * numPlayersInTeam;
                }
            }
            playerValue[guess.user] += numPlayersInTeam - index;
        });
    });

    console.log(playerValue);


    const playerTitles: {[key:string]: any} = {};

    teams[displayTeam].members.forEach((member: string) => {
        playerTitles[member] = "average";
    });

    if(teams[displayTeam].members.length == 1){
        playerTitles[teams[displayTeam].members[0]] = "lonely";
    }
    else{
        const playersSorted = Object.keys(playerValue).sort((a,b) => playerValue[a] - playerValue[b]);
        playerTitles[playersSorted[0]] = "useless";
        playerTitles[playersSorted[playersSorted.length - 1]] = "mvp";
    }
    
    console.log(playerTitles);
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

    const currentTeamPlayer = teams[displayTeam].members[currentTeamPlayerIdx];

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
                <div className="duels-team-summary-overall-stats">
                    <div className="duels-team-summary-title-container">
                        <div className="duels-team-summary-title-title">{PLAYER_TITLES[playerTitles[currentTeamPlayer]].text}</div>
                        <div className="duels-team-summary-title-subtext">{getRandomTitle(playerTitles[currentTeamPlayer])}</div>
                    </div>
                    <div className="duels-team-summary-stat">
                        <div className="duels-team-summary-stat-title">Team Players</div>
                        <div className="duels-team-summary-stat-players-container">
                            {teams[displayTeam].members.length > 1 && <BiSolidLeftArrow onClick={leftPlayer} className="dark-hover-button"/>}
                            <div className="duels-team-summary-stats-user-icon">
                                <UserIcon data={users[currentTeamPlayer]}/>
                            </div>
                            {teams[displayTeam].members.length > 1 && <BiSolidRightArrow onClick={rightPlayer} className="dark-hover-button"/>}
                        </div>
                         <div className="duels-team-summary-stats-username">{currentTeamPlayer}</div>
                    </div>
                </div>
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