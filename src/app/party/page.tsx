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
import { FaQuestionCircle } from "react-icons/fa";
import { BsInfinity } from "react-icons/bs";
import { BiCheck, BiSolidCheckboxChecked, BiSolidCheckboxMinus } from "react-icons/bi";
import { FaSquareCheck, FaSquareXing } from "react-icons/fa6";

const MIN_ROUNDS = 5;
const MAX_ROUNDS = 20;
const MIN_TIME = 5;
const MAX_TIME = 300;

export default function PartyPage() {
    const [isHost, setIsHost] = useState<boolean>(false);
    const [users, setUsers] = useState<any>();
    const [loading, setLoading] = useState<boolean>(true);
    const [rules, setRules] = useState<any>();
    const [localRules, setLocalRules] = useState<any>();
    const [rulesOpen, setRulesOpen] = useState<boolean>(false);
    const [mapOpen, setMapOpen] = useState<boolean>(false);

    const dispatch = useDispatch();
    const code = useSelector((state: any) => state.party).code;
    const router = useRouter();

    if(!code){
        router.push("/party/temp");
    }
    const socket = useSocket({
        namespace: "/party",
        rooms: {code:code},
        functions:{
            leave:(data)=>{
                dispatch(clearPartyCode());
                router.push("/party/temp");
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
            start: (data) =>{
                router.push(`${data.type.toLowerCase()}/${data.id}`)
            },
        }
    });

    async function fetchData() {
        const isHost = await api.get(`/party/host?code=${code}`);
        setIsHost(isHost.data.is_host);
        const users = await api.get(`/party/users?code=${code}`);
        setUsers(users.data);
        const rules = await api.get(`/party/rules?code=${code}`);
        console.log(rules.data);
        setRules(rules.data);
        setLocalRules(rules.data);
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
    }

    async function gameStart() {
        await api.post("/party/start", { code: code });
    }

    async function setMap(id: string,name: string) {
        setMapOpen(false);
        await api.post("/party/rules", { code, ...rules, map_id: id });
    }

    async function saveRules() {
        setRulesOpen(false);
        await api.post("/party/rules",{code, ...localRules});
    }    

    useEffect(() => {
        fetchData();
    }, []);
    if (loading) {
        return <Loading/>
    }

    const displayRules = {
        Rounds: rules.rounds,
        Time: rules.time === -1? <BsInfinity/>:`${rules.time}s`, 
        NMPZ: rules.nmpz ? <BiSolidCheckboxChecked className="text-green-300 text-xl"/>:<BiSolidCheckboxMinus className="text-red-300 text-xl"/>,
    };

    console.log(displayRules);

    return (
        <div className="relative overflow-hidden">
            <div className="navbar-buffer"/>
            <div className="party-page-content">
                <div>Code:{code}</div>
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
                    {isHost ? <button className="party-page-start-button" onClick={gameStart}>Start</button>:<div>Waiting for host...</div>}
                </div>
            </div>
            <div className="fixed">
                <Modal isOpen={mapOpen} onClose={() => setMapOpen(false)}>
                    <h2 className="text-xl font-semibold text-center">Select Map</h2>
                    <MapSearch mapSelect={setMap} pageSize={12} bodySize="60vh" />
                </Modal>
            </div>
            <div className="fixed">  
                <Modal isOpen={isHost && rulesOpen} onClose={() => {setRulesOpen(false)}}>
                    <h2 className="text-xl font-semibold text-center">Set Rules</h2>
                    <div className="mb-4">
                        <label className="block mb-2 text-white" htmlFor="round-range">
                            No. of Rounds: {localRules.rounds}
                        </label>
                        <input
                            className="focus:outline-none input-field cursor-pointer"
                            style={{ padding: "0px" }}
                            type="range"
                            id="round-range"
                            min={MIN_ROUNDS}
                            max={MAX_ROUNDS}
                            step="1"
                            value={localRules.rounds}
                            onChange={(e) => 
                                setLocalRules((prev:any) => ({...prev,rounds:Number(e.target.value)}))
                            }
                        />
                    </div>
                    <div className="mb-6">
                    <label className="block mb-2 text-white" htmlFor="time-range">
                        Time Limit: {localRules.time >= MAX_TIME + 1 || localRules.time == -1 ? <BsInfinity className="inline"/> : `${localRules.time}s`}
                    </label>
                    <input
                        className="text-dark focus:outline-none input-field cursor-pointer"
                        style={{ padding: "0px" }}
                        type="range"
                        id="time-range"
                        min={MIN_TIME}
                        max={MAX_TIME + 1}
                        step="1"
                        value={localRules.time == -1 ? MAX_TIME + 1 : localRules.time}
                        onChange={(e) => {
                                const val = Number(e.target.value);
                                setLocalRules((prev:any) => ({...prev,time:val === MAX_TIME + 1? -1:val})) 
                            }
                        }
                    />
                    </div>
                    <div className="mb-6">
                        <input
                            type="checkbox"
                            name="NMPZ-toggle"
                            id="NMPZ-toggle"
                            checked={localRules.nmpz}
                            className="mr-2 cursor-pointer"
                            onChange={(e) => 
                                setLocalRules((prev:any) => ({...prev,nmpz:e.target.checked}))
                            }
                        />
                        <label
                            htmlFor="NMPZ-toggle"
                            title="No moving, No panning, No zooming"
                        >
                            <b>NMPZ</b>
                            <FaQuestionCircle className="ml-2 inline" />
                        </label>
                    </div>
                    <button
                        className="btn-primary justify-center flex mx-auto"
                        onClick={saveRules}
                    >
                        Save Rules
                    </button>
                </Modal>
            </div>
        </div>
    );
}