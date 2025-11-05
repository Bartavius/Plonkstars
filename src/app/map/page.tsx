"use client";

import { useRouter } from "next/navigation";
import MapSearch from "@/components/maps/search/MapSearch"
import { useState } from "react";
import "./page.css";
import api from "@/utils/api";
import ProtectedRoutes from "../ProtectedRoutes";

export default function MapMainPage() {
    const [loading, setLoading] = useState<boolean>(false);
    const [name, setName] = useState<string>("");

    const router = useRouter();
    const mapSelect = (id: string) => {
        if (loading) return;
        router.push(`/map/${id}`); 
    }

    const cleanName = (text: string): string => text.replace(/[^\S ]+/g, "");
    const createMap = async () => {
        if (loading) return;
        setLoading(true);
        const newName = cleanName(name);
        if (newName.length > 0){
            const res = await api.post(`/map/edit/create`, {name: newName});
            router.push(`/map/${res.data.id}`);
        }
        setLoading(false);
    }


    return (
        <ProtectedRoutes>
            <div className="navbar-buffer"/>
            <div className="map-page-header">Create a Map</div>
            <div className="search-bar-wrapper p-4">
                <div className="flex">
                    <input
                        id="map-search-bar"
                        className="focus:outline-none focus:ring-2 focus:ring-blue-500 input-field-1 text-dark"
                        type="text"
                        placeholder="Insert a map name..." 
                        onChange={(e) =>{
                                setName(e.target.value)
                            }
                        }
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.currentTarget.blur();
                            }
                        }}
                    />
                    <button
                        disabled={loading}
                        className={`btn px-2 rounded-r-md ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={createMap}
                    >
                        Create
                    </button>
                </div>
            </div>
            <div className="map-page-header">Map Search</div>
            <MapSearch mapSelect={mapSelect}/>
        </ProtectedRoutes>
    )
}