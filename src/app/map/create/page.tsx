"use client";

import api from "@/utils/api";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const BasicMapResult = dynamic(() => import("@/components/maps/BasicMapResult"), { ssr: false });

const MAPID = "c5ce2041-a992-44f1-a8e6-104c6d6d4a43"
export default function Results() {
    const [locations,setLocations] = useState([{correct:{lat:0,lng:0},users: []}]);

    const getLocations = async () => {
        const response = await api.get(`/map/info?id=${MAPID}`);
        const bounds = response.data.bounds.map((bound: any) => ({correct: bounds.start, users: []}));
        console.log(bounds);
        setLocations(bounds);
    }

    useEffect(() => {
        getLocations();
    }, []);

  return (
    <div className="map-result-container min-h-[90vh] min-w-full">
       <BasicMapResult markers={locations}/>
    </div>
  );
}