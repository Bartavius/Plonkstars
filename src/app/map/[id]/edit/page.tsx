"use client";

import api from "@/utils/api";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import CreateMap from "@/components/maps/CreateMap";
import { useParams, useRouter } from "next/navigation";

interface Location {
    lat:number,
    lng:number
}

interface Bounds {
    start: Location,
    end: Location
}

export default function CreateMapPage() {
    const [bounds,setLocations] = useState<Bounds[]>();
    const MAPID = useParams().id;
    const router = useRouter();

    const getLocations = async () => {
        try{
            const response = await api.get(`/map/info?id=${MAPID}`);
            const bounds = response.data.bounds;
            console.log(bounds);
            setLocations(response.data.bounds);
        } catch (error) {
            router.push("/map");
            console.log(error);
        }
    }

    useEffect(() => {
        getLocations();
    }, []);

    const [selectedLocation,setSelectedLocation] = useState<Location>();
    const [selectedBound,setSelectedBound] = useState<Bounds>();

    function getSelectedLocation() {
        return selectedLocation;
    }

    function getSelectedBound() {
        return selectedBound;
    }

    function onClick(location?:Location) {
        if(!location){
            setSelectedLocation(undefined);
            setSelectedBound(undefined);
            return;
        }
        setSelectedLocation(location);
    }    

    return (
        <div className="map-result-container min-h-[90vh] min-w-full">
            {bounds && <CreateMap bounds={bounds} getSelectedBound={getSelectedBound} getSelectedLocation={getSelectedLocation} onClick={onClick}/>}
        </div>
    );
}