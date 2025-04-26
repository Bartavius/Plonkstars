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

export default function PartyPage() {
    const [isHost, setIsHost] = useState<boolean>();
    const [users, setUsers] = useState<any>();
    const [loading, setLoading] = useState<boolean>(true);
    const [rules, setRules] = useState<any>();
    const [mapOpen, setMapOpen] = useState<boolean>(false);

    const dispatch = useDispatch();
    const code = useSelector((state: any) => state.party).code;
    const router = useRouter();

    if(!code){
        router.push("/party/temp");
    }
    const socket = useSocket({
        namespace: "/party",
        room: code,
        functions:{
            leave:(data)=>{
                dispatch(clearPartyCode());
                router.push("/party/temp");
            },
            message:(data)=>console.log(data),
            add_user:(data)=>{
                console.log(data);
                setUsers((prev:any) => ({
                    ...prev,members: [...prev.members, data]
                }))
            },
            remove_user: (data) => {
                console.log(data);
                setUsers((prev: any) => ({
                  ...prev,
                  members: prev.members.filter((user: any) => user.username !== data.username),
                }));
              },
            update_rules:(data)=>setRules(data),
        }
    });

    async function fetchData() {
        const isHost = await api.get(`/party/host?code=${code}`);
        setIsHost(isHost.data.is_host);
        const users = await api.get(`/party/users?code=${code}`);
        setUsers(users.data);
        const rules = await api.get(`/party/rules?code=${code}`);
        setRules(rules.data);
        console.log(users.data);
        setLoading(false);
    }

    async function leaveParty() {
        await api.post("/party/leave", { code: code });
    }

    async function disbandParty() {
        await api.post("/party/delete", { code: code });
    }

    async function gameStart() {
        router.push(`/game`);
    }

    async function setMap(id: string,name: string) {
        setMapOpen(false);
        await api.post("/party/rules", { code: code, ...rules, map_id: id });
    }

    useEffect(() => {
        fetchData();
    }, []);
    if (loading) {
        return <Loading/>
    }
    return (
        <div className="relative overflow-hidden">
            <div className="navbar-buffer"/>
            <div className="party-page-content">
                {/* <div>Code:{code}</div> */}
                <div className="party-page-user-list">
                    {users.members.map(((user: any) => {
                        return (
                            <div key={user.username} className="party-page-user-card">
                                <UserCard data={user} className={`user-card-style ${user.username == users.this? "user-card-outline":""} ${user.username == users.host? "user-card-gold-name":""}`}/>
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
                    <div></div>
                    <MapCard map={rules.map} className={`party-page-map ${isHost ? "party-page-map-host" : ""}`} onClick={isHost ? () => setMapOpen(true) : undefined} />
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
        </div>
    );
}