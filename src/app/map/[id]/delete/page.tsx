"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import "../page.css";
import "./page.css";
import api from "@/utils/api";
import Loading from "@/components/loading";
import ProtectedRoutes from "@/app/ProtectedRoutes";

export default function DeletePage(){
    const [loading,setLoading] = useState(false); 
    const [data,setData] = useState<any>();
    const [input,setInput] = useState<string>("");
    const router = useRouter();
    const params = useParams();

    function goBack(){
        setLoading(true);
        router.push(`/map/${params.id}`);
    }

    async function getData(){
        try {
            const permission = await api.get(`/map/edit?id=${params.id}`);
            if(permission.data.permission < 3){
                router.push(`/map/${params.id}`);
                return;
            }
            const res = await api.get(`/map/stats?id=${params.id}`);
            setData(res.data);
        } catch (error) {
            router.push("/map");
        }
    }

    async function deleteMap(){
        setLoading(true);
        try {
            await api.delete("/map/edit/delete", { data: { id: params.id } });
        } catch (error) {console.log(error)}
        router.push("/map");
    }

    useEffect(()=>{
        getData();
    },[]);

    if(!data){
        return <Loading/>;
    }
    
    return (
        <ProtectedRoutes>
            <div className="relative h-[80vh]">
                <div className="navbar-buffer"/>
                <button disabled={loading} className="map-search-back-button" onClick={goBack}>
                    <IoMdArrowRoundBack className="map-search-back dark-hover-button"/>
                </button>
                <div className="centered-elements">
                    <div className="delete-box">
                        <div className="delete-map-title"> Are you sure you want to delete {data.name}?</div>
                        <div className="delete-map-text">
                            All games, scores, sessions, and bounds associated with the map will be deleted. This action cannot be undone.
                        </div>
                        <div className="delete-map-text">To confirm, type "{data.name}":</div>
                        <input placeholder={data.name} className="input-field" onChange={(e)=>setInput(e.target.value)}/>
                        {data.name === input && <button className="delete-map-button" onClick={deleteMap} disabled={loading}>Delete Map</button>}
                    </div>
                </div>
            </div>
        </ProtectedRoutes>
    )
}