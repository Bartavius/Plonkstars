"use client";
import { useState, useEffect } from "react";
import api from "@/utils/api";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";

import "./page.css";
import useSocket from "@/utils/socket";
import UserCard from "@/components/user/UserCard";

export default function PartyPage() {
    const [isHost, setIsHost] = useState<boolean>();
    const [users, setUsers] = useState<any>();
    const [loading, setLoading] = useState<boolean>(true);
    const code = useSelector((state: any) => state.party).code;
    const router = useRouter();

    if(!code){
        router.push("/party/temp");
    }
    const socket = useSocket({
        namespace: "/party",
        room: code,
        functions:{
            leave:(data)=>router.push("/party/temp"),
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
        }
    });

    async function fetchData() {
        const isHost = await api.get(`/party/host?code=${code}`);
        setIsHost(isHost.data.is_host);
        const users = await api.get(`/party/users?code=${code}`);
        setUsers(users.data);
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

    useEffect(() => {
        fetchData();
    }, []);
    if (loading) {
        return <Loading/>
    }
    return (
        <div className="relative">
            <div className="navbar-buffer"/>
            <div className="party-page-content">
                <div>Code:{code}</div>
                <div className="party-page-user-list">
                    {users.members.map(((user: any) => {
                        return (
                            <div key={user.username} className="party-page-user-card">
                                <UserCard data={user} className={`${user.username == users.this? "user-card-outline":""} ${user.username == users.host? "user-card-gold-name":""}`}/>
                            </div>
                        )
                    }))}
                </div>
            </div>
            <div className="party-page-footer">
                <div className="party-page-footer-content-left">
                    <button className="btn-primary party-page-exit-button" onClick={() => (isHost ? disbandParty() : leaveParty())}>{isHost ? "Disband Party" : "Leave"}</button>
                </div>
                <div>a</div>
                <div className="party-page-footer-content-right">
                    <button className="party-page-start-button" onClick={gameStart}>Start</button>
                </div>
            </div>
        </div>
    );
}