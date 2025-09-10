"use client";
import DuelsGameplay from "@/components/game/duels/gameplay/gameplay";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Loading from "@/components/loading";
import api from "@/utils/api";
import useDuelsSocket from "../duelsSocket";
import Popup from "@/components/Popup";
import UserIcon from "@/components/user/UserIcon";
import calculateOffset from "@/components/time";
import ProtectedRoutes from "@/app/ProtectedRoutes";

export default function DuelsGamePage() {

    const users = useRef<{[key: string]: any}>({});
    const [thisUser, setThisUser] = useState<string>("");
    const [teams, setTeams] = useState<{[key: string]: any}>({});
    const [teamPlonks, setTeamPlonks] = useState<{[key: string]: any}>({});
    const [teamGuesses, setTeamGuesses] = useState<{[key: string]: any}>({});
    const [roundInfo, setRoundInfo] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [guesses, setGuesses] = useState<number>(0);
    const [maxGuesses, setMaxGuesses] = useState<number>(0);
    const [multi, setMulti] = useState<number>(0);
    const [maxHealth, setMaxHealth] = useState<number>(0);
    const [state, setState] = useState<string>();
    const [spectating, setSpectating] = useState<boolean>(false);
    const [canGuess, setCanGuess] = useState<boolean>(false);
    const [popupElement, setPopupElement] = useState<React.ReactNode>();
    const [time, setTime] = useState<any>();
    const [offset, setOffset] = useState<number>(0);

    const params = useParams();
    const id = typeof params.id === "string" ? params.id : "";

    useEffect(() =>{
        async function roundInfo() {
            const round = await api.get(`/game/round?id=${id}`)
            setRoundInfo(round.data);
            if("time" in round.data){
                setTime({
                    time: round.data.time,
                    time_limit: round.data.time_limit,
                });
            }
        }
        async function fetchData() {
            const state = await api.get(`/game/state?id=${id}`)
            setState(state.data.state);
            if(state.data.state != "GUESSING"){
                return;
            }

            setThisUser(state.data.user);
            setGuesses(state.data.guess_count);
            setMaxGuesses(state.data.max_guesses);
            setMulti(state.data.multi);
            setSpectating(state.data.spectator);
            setCanGuess(state.data.can_guess);
            setMaxHealth(state.data.start_hp);

            const plonks = state.data.plonks.reduce((acc: any, item: any) => {
                acc[item.user] = item;
                return acc;
            }, {});
            setTeamPlonks(plonks);

            const guesses = state.data.guesses.reduce((acc: any, item: any) => {
                acc[item.user] = item;
                return acc;
            },{});
            setTeamGuesses(guesses)

            const teams = state.data.teams.reduce((acc: any, item: any) => {
                acc[item.id] = item;
                return acc;
            },{});
            setTeams(teams);

            const userMap = state.data.teams.reduce((acc: any, item: any) => {
                item.members.forEach((member: string) => {
                    acc[member] = {"team": item.id};
                });
                return acc;
            },{});
            const usersQuery = state.data.teams.reduce((acc: any, item: any) => {
                acc += "&username=" + item.members.join("&username=");
                return acc;
            },"");
            const avatars = await api.get(`/account/avatar?${usersQuery}`);
            avatars.data.forEach((avatar: any) => {
                userMap[avatar.username] = {...userMap[avatar.username], ...avatar};
            });
            users.current = userMap;

            setOffset(await calculateOffset(roundInfo));
            setLoading(false);
        }
        fetchData();
    },[])

    const socketFunctions = {
        guess: (data: any) => {
            if("lat" in data && "lng" in data){
                setTeamGuesses((prev) => ({...prev, [data.user]: data}));
                setTeamPlonks((prev:any) => {
                    const prevCopy = {...prev};
                    delete prevCopy[data.user];
                    return prevCopy;
                });
            }
            else{
                setGuesses((prev) => prev + 1);
                setPopupElement(
                    <div className="flex flex-col justify-center items-center">
                        <UserIcon className="w-[1rem]" data={users.current[data.user]}/>
                        <div>{data.user} guessed</div>
                    </div>
                );
            }
        },
        plonk: (data: any) => {
            setTeamPlonks((prev) => ({...prev, [data.user]: data}));
        },
        time: (data: any) => {
            setTime(data);
        }
    }

    const socket = useDuelsSocket({id,state,functions:socketFunctions});
    if (loading) {
        return <Loading/>
    }

    return (
        <ProtectedRoutes>
            <Popup>
                {popupElement}
            </Popup>
            <DuelsGameplay 
                id={id}
                users={users.current} 
                thisUser={thisUser} 
                teams={teams}
                teamPlonks={teamPlonks}
                teamGuesses={teamGuesses}
                roundInfo={roundInfo}
                spectator={spectating}
                canGuess={canGuess}
                guesses={guesses}
                maxGuesses={maxGuesses}
                multi={multi}
                maxHealth={maxHealth}
                endTime={time && new Date(time.time)}
                timeLimit={time && time.time_limit}
                timeOffset={offset}
            />
        </ProtectedRoutes>
    );
}