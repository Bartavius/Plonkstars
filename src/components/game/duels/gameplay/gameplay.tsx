export default function GameplayDuels({
    users,
    thisUser,
    teams,
    teamPlonks,
    teamGuesses,
    roundInfo,
    gameState,
    spectator,
    canGuess,
}: {
    users: {[key: string]: any},
    thisUser: string,
    teams: {[key: string]: any},
    teamPlonks: {[key: string]: any[]},
    teamGuesses: {[key: string]: any[]},
    roundInfo: any,
    gameState: any,
    spectator?: boolean,
    canGuess?: boolean,
}) {
    
}