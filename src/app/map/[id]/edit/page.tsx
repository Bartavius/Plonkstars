"use client";

import api from "@/utils/api";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";
import { Rectangle, useMapEvent } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";
import MapPreview from "@/components/maps/MapPreview";
import MapIcon from "@/components/maps/mapIcon";
import Loading from "@/components/loading";
import StreetView from "@/components/maps/Streetview";
import "./page.css";

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

    const MapEvent = () => {
        useMapEvent("click", (event: LeafletMouseEvent) => {
            if(-90 <= event.latlng.lat && event.latlng.lat <= 90 && -180 <= event.latlng.lng && event.latlng.lng <= 180){
                setSelectedLocation(event.latlng);
            }
            else{
                setSelectedLocation(undefined);
                setSelectedBound(undefined);
            }
        });
        return null;
    };

    if(!bounds) return <Loading/>;

    return (
        <div className="map-result-container min-h-[90vh] min-w-full">
            <MapPreview bounds={bounds}>
                <MapEvent/>
                <Rectangle
                    bounds={[[-90,-1000],[90,-180]]}
                    color="red"
                    opacity={1}
                    weight={0}
                />
                <Rectangle
                    bounds={[[-90,180],[90,1000]]}
                    color="red"
                    opacity={1}
                    weight={0}
                />
                {selectedLocation && <MapIcon pos={selectedLocation} clickable={true} iconUrl={"/PlonkStarsMarker.png"}/>}
            </MapPreview>
            <div className="corner-street-view">
                {selectedLocation && selectedLocation.lat && selectedLocation.lng &&
                    <StreetView lat={selectedLocation.lat} lng={selectedLocation.lng}/>
                }
            </div>
        </div>
    );
}