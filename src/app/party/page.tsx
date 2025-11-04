"use client";
import { useState, useEffect } from "react";
import api from "@/utils/api";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";

import "./page.css";
import useSocket from "@/utils/socket";
import MapCard from "@/components/maps/search/MapCard";
import Modal from "@/components/Modal";
import MapSearch from "@/components/maps/search/MapSearch";
import { clearPartyCode } from "@/redux/partySlice";
import { BsInfinity } from "react-icons/bs";
import { BiSolidCheckboxChecked, BiSolidCheckboxMinus } from "react-icons/bi";
import Popup from "@/components/Popup";
import { setError } from "@/redux/errorSlice";
import UserInput from "@/components/party/userInput";
import { GoTriangleLeft, GoTriangleRight } from "react-icons/go";
import PlayerDisplay from "./PlayerDisplay";
import TeamDisplay from "./TeamDisplay";
import { Team } from "./structs";
import ProtectedRoutes from "../ProtectedRoutes";

const modes = ["Live","Duels"]

export default function PartyPage() {
    const [users, setUsers] = useState<any>();
    const [host, setHost] = useState<string>("");
    const [thisUser, setThisUser] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [rules, setRules] = useState<any>();
    const [localRules, setLocalRules] = useState<any>();
    const [rulesOpen, setRulesOpen] = useState<boolean>(false);
    const [mapOpen, setMapOpen] = useState<boolean>(false);
    const [hoverCode, setHoverCode] = useState<boolean>(false);
    const [type, setType] = useState<string>();
    const [message, _setMessage] = useState<string>();
    const [update, setUpdate] = useState<number>(0);
    const [state, setState] = useState<any>();
    const [rulesConfig, setRulesConfig] = useState<any>(null);
    const [modeIndex, setModeIndex] = useState<number>(0);
    const [teams, setTeams] = useState<{[key:string]:Team}>({});

    const dispatch = useDispatch();
    const code = useSelector((state: any) => state.party).code;
    const router = useRouter();

    const socket = useSocket({
        namespace: "/party",
        rooms: {code:code},
        functions:{
            leave:(data)=>{
                dispatch(clearPartyCode());
                dispatch(setError(data?.reason));
                router.push("/game");
            },
            message:(data)=>console.log(data),
            add_user:(data)=>{
                setUsers((prev:any) => ({
                    ...prev,
                    [data.username]: data,
                }));
            },
            remove_user: (data) => {
                setUsers((prev:any) => {
                    const prevCopy = {...prev};
                    delete prevCopy[data.username];
                    return prevCopy;
                });
            },
            add_team:(data)=>{
                setTeams((prev:any) => ({
                    ...prev,
                    [data.id]: data
                }));
            },
            update_team:(data)=>{
                setTeams((prev:any) => ({
                    ...prev,
                    [data.id]: {
                        ...prev[data.id],
                        ...data
                    }
                }));
            },
            add_team_user:(data)=>{
                setTeams((prev:any) => ({
                    ...prev,
                    [data.id]: {
                        ...prev[data.id],
                        members: [...prev[data.id].members, data.username]
                    }
                }));
            },
            remove_team_user:(data)=>{
                setTeams((prev:any) => ({
                    ...prev,
                    [data.id]: {
                        ...prev[data.id],
                        members: prev[data.id].members.filter((username: string) => username !== data.username)
                    }
                }));
            },
            delete_team:(data)=>{
                setTeams((prev:any) => {
                    const newTeams = {...prev};
                    delete newTeams[data.id];
                    return newTeams;
                });
            },
            update_rules:(data)=>{
                setRules(data);
                setLocalRules(data);
                setModeIndex(modes.findIndex(item => item.toLowerCase() === data.type.toLowerCase()));
            },
            start: pushGame,
            summary: updateGameState
        }
    });

    function setMessage(message: string, type: string = "success") {
        setType(type);
        _setMessage(message);
        setUpdate((prev) => prev + 1);
    }

    async function updateGameState(data:any){
        const state = await api.get(`/party/game/state?code=${code}`);
        setState(state.data);
    }
    function pushGame(data:any){
        router.push(`/${data.type.toLowerCase()}/${data.id}`);
    }
    async function fetchData() {
        const state = await api.get(`/party/game/state?code=${code}`);
        setState(state.data);
        await api.post(`/party/lobby/join`,{code});
        const users = await api.get(`/party/users?code=${code}`);
        const members = users.data.members.reduce((acc: any, item: any) => {
            acc[item.username] = item;
            return acc;
        }, {});
        setUsers(members);
        setHost(users.data.host);
        setThisUser(users.data.this);
        const rules = await api.get(`/party/rules?code=${code}`);
        setRules(rules.data);
        setLocalRules(rules.data);
        setModeIndex(modes.findIndex(item => item.toLowerCase() === rules.data.type.toLowerCase()));
        const rulesConfig = await api.get(`/party/rules/config?code=${code}`);
        setRulesConfig(rulesConfig.data);
        const team = await api.get(`/party/teams?code=${code}`)
        setTeams(team.data.reduce((acc: any, item: any) => {
            acc[item.id] = item;
            return acc;
        }, {}));
        setLoading(false);
    }

    async function leaveParty() {
        await api.post("/party/leave", { code: code });
    }

    async function disbandParty() {
        await api.post("/party/delete", { code: code });
    }

    async function kickUser(username: string) {
        await api.post("/party/users/remove", { code: code, username: username });
        setMessage(`Kicked ${username}`,"error");
    }

    async function gameStart() {
        await api.post("/party/game/start", { code: code });
    }

    async function joinGame(){
        await api.post("/party/game/join", { code: code });
        pushGame(state);
    }

    async function setMap(id: string,name: string) {
        setMapOpen(false);
        await api.post("/party/rules", { code, ...rules, map_id: id });
        setMessage("Saved Map");
    }

    async function saveRules() {
        setRulesOpen(false);
        await api.post("/party/rules",{code, ...localRules});
        setMessage("Saved Rules");

    }
    
    function copyPartyLink(){
        navigator.clipboard.writeText(`${window.location.origin}/party/join?code=${code}`);
        setMessage("Copied Party Link","info");
    }

    function setSingleRules(key: string, value: any) {
        setLocalRules((prev: any) => ({
            ...prev,
            [key]: value
        }));
    }

    async function changeMode(index: number) {
        index = (index + modes.length) % modes.length;
        setModeIndex(index);
        await api.post("/party/rules", { code, type: modes[index] });

        const rulesConfig = await api.get(`/party/rules/config?code=${code}`);
        setRulesConfig(rulesConfig.data);
    }

    useEffect(() => {
        if(!code){
            router.push("/game");
            return;
        }

        function leaveLobby(){
            api.post("/party/lobby/leave", {code});
        };

        try{
            fetchData();
        }
        catch (err: any) {
            dispatch(clearPartyCode());
            dispatch(setError(err?.response?.data?.error || "An error occurred while fetching party data."));
            router.push("/game");
        }

        window.addEventListener("beforeunload", leaveLobby);
        return () => {
            window.removeEventListener("beforeunload", leaveLobby);
        };
    }, []);

    if (loading) {
        return <Loading/>
    }

    const displayRules = {
        Rounds: rules.rounds === -1 ? <BsInfinity/> : rules.rounds,
        Time: rules.time === -1? <BsInfinity/>:`${rules.time}s`, 
        NMPZ: rules.nmpz ? <BiSolidCheckboxChecked className="text-green-300 text-xl"/>:<BiSolidCheckboxMinus className="text-red-300 text-xl"/>,
    };

    const isHost = host == thisUser;
    return (
        <ProtectedRoutes>
            <div className="relative overflow-hidden">
                <Popup update={update} type={type} duration={750} fadeOut={1000}>{message}</Popup>
                <div className="navbar-buffer"/>
                <div className="party-page-content">
                    <div className="party-page-code-box" onMouseEnter={() => setHoverCode(true)} onMouseLeave={() => setHoverCode(false)} onClick={copyPartyLink}>{hoverCode ? code: "Hover for Code"}</div>
                    <div className="party-page-mode-box">
                        {isHost ? <GoTriangleLeft className="party-page-mode-change-arrow" onClick={() => changeMode(modeIndex-1)}/>:<div/>}
                        {modes[modeIndex]}
                        {isHost ? <GoTriangleRight className="party-page-mode-change-arrow" onClick={() => changeMode(modeIndex + 1)}/>:<div/>}
                    </div>
                    {rules.team_type == "solo" ? <PlayerDisplay users={users} host={host} thisUser={thisUser} kickUser={kickUser}/>:
                    rules.team_type == "team" ? <TeamDisplay code={code} users={users} host={host} thisUser={thisUser} teams={teams} kickUser={kickUser} setMessage={setMessage}/>:undefined}
                </div>
                <div className="party-page-footer">
                    <div className="party-page-footer-content-left">
                        <button className="btn-primary party-page-exit-button" onClick={() => (isHost ? disbandParty() : leaveParty())}>{isHost ? "Disband Party" : "Leave"}</button>
                    </div>
                    <div className="party-page-footer-content-center">
                        <div className="party-page-rules-footer" onClick={() => setRulesOpen(true)}>
                            {Object.entries(displayRules).map(([key, value]) => (
                                <div key={key} className="party-page-rule-item">
                                    <div className="party-page-rule-key-text">{key}</div> 
                                    <div className="party-page-rule-value-text">{value}</div>
                                </div>
                            ))}
                        </div>
                        <MapCard map={rules.map} className={`party-page-map ${isHost ? "party-page-map-host" : ""}`} onClick={isHost ? () => {setMapOpen(true);setLocalRules(rules);} : undefined} />
                    </div>
                    <div className="party-page-footer-content-right">
                        {
                            (state.state==="playing"?
                                (state.joined ? 
                                    <button className="party-page-start-button" onClick={() => pushGame(state)}>Rejoin Game</button>:
                                    <button className="party-page-start-button" onClick={joinGame}>Join Game</button> 
                                ):
                                (isHost ? 
                                <button className="party-page-start-button" onClick={gameStart}>Start</button>:
                                <div>Waiting for host...</div>)
                            )
                        }
                    </div>
                </div>
                <Modal isOpen={mapOpen} onClose={() => setMapOpen(false)}>
                    <h2 className="party-page-modal-title">Select Map</h2>
                    <MapSearch mapSelect={setMap} pageSize={12} bodySize="60vh" />
                </Modal>
                
                <Modal isOpen={rulesOpen} onClose={() => {setRulesOpen(false)}}>
                    <h2 className="party-page-modal-title">Rules</h2>
                    {
                        rulesConfig && rulesConfig.map((data:any) => (
                            <div className="py-2" key={data.key}>
                                <UserInput
                                    key={data.key}
                                    inputType={data.display}
                                    data={data}
                                    value={localRules ? localRules[data.key] : undefined}
                                    setError={(error) => setMessage(error,"error")}
                                    setInput={(input: any) => setSingleRules(data.key, input)}
                                    editable={isHost}
                                />
                            </div>
                        ))
                    }
                    {isHost &&
                        <button
                            className="btn-primary justify-center flex mx-auto"
                            onClick={saveRules}
                        >
                            Save Rules
                        </button>
                    }
                </Modal>
            </div>
        </ProtectedRoutes>
    );
}