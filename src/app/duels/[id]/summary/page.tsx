"use client";
import ProtectedRoutes from "@/app/ProtectedRoutes";
import Loading from "@/components/loading";
import api from "@/utils/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useDuelsSocket from "../../duelsSocket";
import DuelsSummary from "@/components/game/duels/summary/summary";

export default function DuelsSummaryPage() {
    const router = useRouter();
    const [locations, setLocations] = useState<{lat:number,lng:number}[]>([]);
    const [teams, setTeams] = useState<{[key: string]: any}>({});
    const [users, setUsers] = useState<{[key: string]: any}>({});
    const [teamGuesses, setTeamGuesses] = useState<{[key: string]: any}>({});
    const [teamHP, setTeamHP] = useState<{[key: string]: any}>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [state, setState] = useState<string>();

    const params = useParams();
    const id = typeof params.id === "string" ? params.id : "";

    useEffect(() => {
        async function fetchData() {
            const state = await api.get(`/game/state?id=${id}`)
            setState(state.data.state);

            const res = await api.get(`/game/summary?id=${id}`);
            console.log(res.data);
            setLocations(res.data.rounds);

            const teams = res.data.teams.reduce((acc: any, item: any) => {
                acc[item.team.id] = item.team;
                return acc;
            },{});
            setTeams(teams);

            const teamGuesses = res.data.teams.reduce((acc: any, item: any) => {
                acc[item.team.id] = item.rounds.map((round: any) => round.guesses);
                return acc;
            },{});
            setTeamGuesses(teamGuesses);

            const teamHP = res.data.teams.reduce((acc: any, item: any) => {
                acc[item.team.id] = item.rounds.map((round: any) => round.hp);
                return acc;
            },{});
            setTeamHP(teamHP);

            const userMap = res.data.teams.reduce((acc: any, item: any) => {
                item.team.members.forEach((member: string) => {
                    acc[member] = {"team": item.id};
                });
                return acc;
            },{});
            const usersQuery = res.data.teams.reduce((acc: any, item: any) => {
                acc += "&username=" + item.team.members.join("&username=");
                return acc;
            },"");
            const avatars = await api.get(`/account/avatar?${usersQuery}`);
            avatars.data.forEach((avatar: any) => {
                userMap[avatar.username] = {...userMap[avatar.username], ...avatar};
            });
            setUsers(userMap);
            setLoading(false);
        }
        fetchData();
    }, []);
    
    const socket = useDuelsSocket({id,state});
    if(loading) {
        return <Loading/>;
    }
    console.log(teamGuesses);
    console.log(teamHP);
    return (
        <ProtectedRoutes>
            <DuelsSummary
                users={users}
                teams={teams}
                teamGuesses={teamGuesses}
                locations={locations}
            />
        </ProtectedRoutes>
        
        // <div className="flex items-center justify-center w-full h-full">
        //     <button onClick={() => router.push("/party")}>Go Back</button>
        // </div>
    )
}
