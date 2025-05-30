"use client";
import { useState, useEffect } from "react";
import api from "@/utils/api";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";

import "./page.css";
import useSocket from "@/utils/socket";
import UserCard from "@/components/user/UserCard";
import MapCard from "@/components/maps/search/MapCard";
import Modal from "@/components/Modal";
import MapSearch from "@/components/maps/search/MapSearch";
import { clearPartyCode } from "@/redux/partySlice";
import { GiExitDoor } from "react-icons/gi";
import { BsInfinity } from "react-icons/bs";
import { BiSolidCheckboxChecked, BiSolidCheckboxMinus } from "react-icons/bi";
import Popup from "@/components/Popup";
import { setError } from "@/redux/errorSlice";
import UserInput from "@/components/party/userInput";
import { GoTriangleLeft, GoTriangleRight } from "react-icons/go";

console.log(process.env.TESTING);
const modes = process.env.NEXT_PUBLIC_TESTING ? ["Live","Duels"]:["Live"]

export default function PartyPage() {
    const [isHost, setIsHost] = useState<boolean>(false);
    const [users, setUsers] = useState<any>();
    const [loading, setLoading] = useState<boolean>(true);
    const [rules, setRules] = useState<any>();
    const [localRules, setLocalRules] = useState<any>();
    const [rulesOpen, setRulesOpen] = useState<boolean>(false);
    const [mapOpen, setMapOpen] = useState<boolean>(false);
    const [hoverCode, setHoverCode] = useState<boolean>(false);
    const [type, setType] = useState<string>();
    const [message, setMessage] = useState<string>();
    const [update, setUpdate] = useState<number>(0);
    const [state, setState] = useState<any>();
    const [rulesConfig, setRulesConfig] = useState<any>(null);
    const [modeIndex, setModeIndex] = useState<number>(0);

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
                    ...prev,members: [...prev.members, data]
                }))
            },
            remove_user: (data) => {
                setUsers((prev: any) => ({
                  ...prev,
                  members: prev.members.filter((user: any) => user.username !== data.username),
                }));
              },
            update_rules:(data)=>{setRules(data);setLocalRules(data);},
            start: pushGame
        }
    });

    function pushGame(data:any){
        router.push(`/${data.type.toLowerCase()}/${data.id}`);
    }

    async function fetchData() {
        const state = await api.get(`/party/game/state?code=${code}`);
        if (state.data.state === "playing" && state.data.joined) {
            pushGame(state.data);
            return;
        }
        setState(state.data);
        await api.post(`/party/lobby/join`,{code});
        const isHost = await api.get(`/party/host?code=${code}`);
        setIsHost(isHost.data.is_host);
        const users = await api.get(`/party/users?code=${code}`);
        setUsers(users.data);
        const rules = await api.get(`/party/rules?code=${code}`);
        setRules(rules.data);
        setLocalRules(rules.data);
        setModeIndex(modes.findIndex(item => item.toLowerCase() === rules.data.type.toLowerCase()));
        const rulesConfig = await api.get(`/party/rules/config?code=${code}`);
        setRulesConfig(rulesConfig.data);
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
        setType("error");
        setMessage(`Kicked ${username}`);
        setUpdate((prev) => prev + 1);
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
        setType("success");
        setMessage("Saved Map");
        setUpdate((prev) => prev + 1);

    }

    async function saveRules() {
        setRulesOpen(false);
        await api.post("/party/rules",{code, ...localRules});
        setType("success");
        setMessage("Saved Rules");
        setUpdate((prev) => prev + 1);

    }

    function setPageError(error: string) {
        setType("error");
        setMessage(error);
        setUpdate((prev) => prev + 1);
    }
    
    function copyPartyLink(){
        navigator.clipboard.writeText(`${window.location.origin}/party/join?code=${code}`);
        setType("info");
        setMessage("Copied Party Link");
        setUpdate((prev) => prev + 1);
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

    function setSingleRules(key: string, value: any) {
        setLocalRules((prev: any) => ({
            ...prev,
            [key]: value
        }));
    }

    async function changeMode(index: number) {
        index = index % modes.length;
        setModeIndex(index);
        await api.post("/party/rules", { code, type: modes[index] });

        const rulesConfig = await api.get(`/party/rules/config?code=${code}`);
        setRulesConfig(rulesConfig.data);
    }

    const displayRules = {
        Rounds: rules.rounds === -1 ? <BsInfinity/> : rules.rounds,
        Time: rules.time === -1? <BsInfinity/>:`${rules.time}s`, 
        NMPZ: rules.nmpz ? <BiSolidCheckboxChecked className="text-green-300 text-xl"/>:<BiSolidCheckboxMinus className="text-red-300 text-xl"/>,
    };

    console.log(rulesConfig)
    return (
        <div className="relative overflow-hidden">
            <Popup update={update} type={type}>{message}</Popup>
            <div className="navbar-buffer"/>
            <div className="party-page-content">
                <div className="party-page-code-box" onMouseEnter={() => setHoverCode(true)} onMouseLeave={() => setHoverCode(false)} onClick={copyPartyLink}>{hoverCode ? code: "Hover for Code"}</div>
                <div className="party-page-mode-box">
                    <GoTriangleLeft className="party-page-mode-change-arrow" onClick={() => changeMode(modeIndex-1)}/>
                    {modes[modeIndex]}
                    <GoTriangleRight className="party-page-mode-change-arrow" onClick={() => changeMode(modeIndex + 1)}/>
                </div>
                <div className="party-page-user-list">
                    {users.members.map(((user: any) => {
                        return (
                            <div key={user.username} className="party-page-user-card">
                                <UserCard data={user} className={`user-card-style ${user.username === users.this? "user-card-outline":""} ${user.username === users.host? "user-card-gold-name":""}`}>
                                    {user.username !== users.host && isHost && 
                                        <button className="party-kick-button" onClick={() => kickUser(user.username)}>
                                            <GiExitDoor />
                                        </button>
                                    }
                                </UserCard>
                            </div>
                        )
                    }))}
                </div>
            </div>
            <div className="party-page-footer">
                <div className="party-page-footer-content-left">
                    <button className="btn-primary party-page-exit-button" onClick={() => (isHost ? disbandParty() : leaveParty())}>{isHost ? "Disband Party" : "Leave"}</button>
                </div>
                <div className="party-page-footer-content-center">
                    <div className={`party-page-rules-footer ${isHost ? "party-page-rules-footer-host" : ""}`} onClick={isHost ? () => setRulesOpen(true) : undefined}>
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
                    {isHost ? 
                        <button className="party-page-start-button" onClick={gameStart}>Start</button>:
                        (state.state==="playing"?
                            <button className="party-page-start-button" onClick={joinGame}>Join Game</button>:
                            <div>Waiting for host...</div>
                        )
                    }
                </div>
            </div>
            <Modal isOpen={mapOpen} onClose={() => setMapOpen(false)}>
                <h2 className="text-xl font-semibold text-center">Select Map</h2>
                <MapSearch mapSelect={setMap} pageSize={12} bodySize="60vh" />
            </Modal>
            
            <Modal isOpen={isHost && rulesOpen} onClose={() => {setRulesOpen(false)}}>
                <h2 className="text-xl font-semibold text-center">Set Rules</h2>
                {
                    rulesConfig && rulesConfig.map((data:any) => (
                        <div className="py-2" key={data.key}>
                            <UserInput
                                key={data.key}
                                inputType={data.display}
                                data={data}
                                value={localRules ? localRules[data.key] : undefined}
                                setError={setPageError}
                                setInput={(input: any) => setSingleRules(data.key, input)}
                            />
                        </div>
                    ))
                }
                <button
                    className="btn-primary justify-center flex mx-auto"
                    onClick={saveRules}
                >
                    Save Rules
                </button>
            </Modal>
        </div>
    );
}