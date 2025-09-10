"use client";
import { useParams,useRouter } from "next/navigation";
import useDuelsSocket from "../../duelsSocket";
import api from "@/utils/api";
import { useEffect, useState } from "react";
import ProtectedRoutes from "@/app/ProtectedRoutes";
import DuelsResults from "@/components/game/duels/results/results";
import Loading from "@/components/loading";

export default function DuelsResultsPage() {
    const params = useParams();
    const id = typeof params.id === "string" ? params.id : "";
    const router = useRouter();

    const [location, setLocation] = useState<{lat:number,lng:number}>({lat:0,lng:0});
    const [teams, setTeams] = useState<{[key: string]: any}>({});
    const [users, setUsers] = useState<{[key: string]: any}>({});
    const [state, setState] = useState<string>();
    const [startHP, setStartHP] = useState<number>(0);
    const [teamGuesses, setTeamGuesses] = useState<{[key: string]: any}>({});
    const [roundNumber, setRoundNumber] = useState<number>(0);
    const [teamHP, setTeamHP] = useState<{[key: string]: any}>({});
    const [loading, setLoading] = useState(true);
    const [thisUser, setThisUser] = useState<string>("");
    const [multi, setMulti] = useState<number>(0);
    

    useEffect(() => {
        async function fetchData() {
            const state = await api.get(`/game/state?id=${id}`)
            setState(state.data.state);

            const res = await api.get(`/game/results?id=${id}`);
            console.log(res.data);
            setLocation({lat:res.data.lat,lng:res.data.lng});
            setStartHP(res.data.start_hp);
            setRoundNumber(res.data.round_number);
            setMulti(res.data.multi);

            const teams = res.data.teams.reduce((acc: any, item: any) => {
                acc[item.team.id] = item.team;
                return acc;
            },{});
            setTeams(teams);

            const teamGuesses = res.data.teams.reduce((acc: any, item: any) => {
                acc[item.team.id] = item.guesses;
                return acc;
            },{});
            setTeamGuesses(teamGuesses);

            const teamHP = res.data.teams.reduce((acc: any, item: any) => {
                acc[item.team.id] = {hp:item.hp,prev_hp:item.prev_hp};
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

    const socket = useDuelsSocket({id, state: state});

    if (loading) {
        return <Loading/>
    }

    console.log({teamGuesses,location,users,teams,startHP,roundNumber,thisUser,teamHP,multi});

    return (
        <ProtectedRoutes>
            <DuelsResults
                teamGuesses={teamGuesses}
                location={location}
                users={users}
                teams={teams}
                startHP={startHP}
                multi={multi}
                roundNumber={roundNumber}
                thisUser={thisUser}
                teamHP={teamHP}
            />
        </ProtectedRoutes>
    )
}