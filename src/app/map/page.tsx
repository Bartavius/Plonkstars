"use client";

import { useRouter } from "next/navigation";
import MapSearch from "@/components/maps/search/MapSearch"

export default function MapMainPage() {
    const router = useRouter();
    const mapSelect = (id: string,name: string) => {
        router.push(`/map/${id}`); 
    }

    return (
        <div>
            <div className="navbar-buffer"/>
            <MapSearch mapSelect={mapSelect}/>
        </div>
    )
}