"use client";
import ProtectedRoutes from "@/app/ProtectedRoutes";
import Loading from "@/components/loading";
import api from "@/utils/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useDuelsSocket from "../../duelsSocket";
import DuelsSummary from "@/components/game/duels/summary/summary";

// http://localhost:3000/duels/c30c33d3-0578-4e6e-adec-13a4640a14f3/summary

export default function DuelsSummaryPage() {
    const router = useRouter();
    const [locations, setLocations] = useState<{lat:number,lng:number}[]>([]);
    const [teams, setTeams] = useState<{[key: string]: any}>({});
    const [users, setUsers] = useState<{[key: string]: any}>({});
    const [teamGuesses, setTeamGuesses] = useState<{[key: string]: any}>({});
    const [teamHP, setTeamHP] = useState<{[key: string]: any}>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [state, setState] = useState<string>();
    const [thisUser, setThisUser] = useState<string>("");
    const [startHP, setStartHP] = useState<number>(0);

    const params = useParams();
    const id = typeof params.id === "string" ? params.id : "";

    useEffect(() => {
        async function fetchData() {
            const state = await api.get(`/game/state?id=${id}`)
            setState(state.data.state);

            const res = await api.get(`/game/summary?id=${id}`);
            setLocations(res.data.rounds);
            setStartHP(res.data.start_hp);

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
                    acc[member] = {"team": item.team.id};
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

            const thisUser = await api.get("/account/user");
            setThisUser(thisUser.data.user);

            setLoading(false);
        }
        fetchData();
    }, []);
    
    const socket = useDuelsSocket({id,state});
    if(loading) {
        return <Loading/>;
    }
    return (
        <ProtectedRoutes>
            <DuelsSummary
                users={users}
                thisUser={thisUser}
                startHP={startHP}
                teams={teams}
                teamHP={teamHP}
                teamGuesses={teamGuesses}
                locations={locations}
            />
        </ProtectedRoutes>
    )
}
