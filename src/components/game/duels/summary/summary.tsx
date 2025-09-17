"use client";
import DuelsMapResult from "@/components/maps/DuelsMapResults";
import { useRouter } from "next/navigation";

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
    const router = useRouter();
    return (
        <div>
        <div className="w-full h-[90dvh]">
            <DuelsMapResult 
                locations={locations}
                teamGuesses={teamGuesses}
                teams={teams}
                users={users}
            />
        </div>
            <button className="ml-1 btn-primary" onClick={() => router.push(`/party`)}>
                Back To Party
            </button>
        </div>
    )
}