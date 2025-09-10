import DuelsMapResult from "@/components/maps/DuelsMapResults";

export default function DuelsSummary({
    users,
    teams,
    teamGuesses,
    locations,
}:{
    users: {[key: string]: any},
    teams: {[key: string]: any},
    teamGuesses: {[key: string]: any},
    locations: {lat:number,lng:number}[],
}){
    return (
        <div className="w-full h-[90dvh]">
            <DuelsMapResult 
                locations={locations}
                teamGuesses={teamGuesses}
                teams={teams}
                users={users}
            />
        </div>
    )
}