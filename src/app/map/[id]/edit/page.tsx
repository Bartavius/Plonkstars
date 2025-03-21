"use client";

import api from "@/utils/api";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import { useParams, useRouter } from "next/navigation";
import { Rectangle, useMap, useMapEvent } from "react-leaflet";
import MapPreview from "@/components/maps/MapPreview";
import MapIcon from "@/components/maps/mapIcon";
import Loading from "@/components/loading";
import StreetView from "@/components/maps/Streetview";
import "@/app/game.css";
import "./page.css";

interface Location {
    lat:number,
    lng:number
}

interface Bounds {
    start: Location,
    end: Location
}

export default function EditMapPage() {
    const [bounds,setBounds] = useState<Bounds[]>([]);
    const [selectedLocation,setSelectedLocation] = useState<Location>();
    const [selectedBound,setSelectedBound] = useState<Bounds>();
    const [buttonDisabled,setButtonDisabled] = useState<boolean>(false);
    const [loading,setLoading] = useState<boolean>(true);
    const MAPID = useParams().id;
    const router = useRouter();

    const getLocations = async () => {
        try{
            const response = await api.get(`/map/info?id=${MAPID}`);
            setBounds(response.data.bounds);
            if(!response.data.can_edit){
                router.push(`/map/${MAPID}`);
            }
            else{
                setLoading(false);
            }
        } catch (error) {
            router.push("/map");
        }
    }

    useEffect(() => {
        getLocations();
    }, []);

    function normalizeBound(bound:Bounds):Bounds{
        bound.start.lat = Math.max(-90,Math.min(90,bound.start.lat));
        bound.start.lng = Math.max(-180,Math.min(180,bound.start.lng));
        bound.end.lat = Math.max(-90,Math.min(90,bound.end.lat));
        bound.end.lng = Math.max(-180,Math.min(180,bound.end.lng));

        const lower_lat = Math.min(bound.start.lat,bound.end.lat);
        const lower_lng = Math.min(bound.start.lng,bound.end.lng);
        const upper_lat = Math.max(bound.start.lat,bound.end.lat);
        const upper_lng = Math.max(bound.start.lng,bound.end.lng);
        return {start:{lat:lower_lat,lng:lower_lng},end:{lat:upper_lat,lng:upper_lng}};
    }

    const ctrlDragLatLngRef = useRef<Location | undefined>(undefined);
    const isDraggingRef = useRef(false);
    const MapEvent = () => {
        const map = useMap();
        useMapEvent("click", (event) => {
            if(isDraggingRef.current) return;
            if(ctrlDragLatLngRef.current){
                setSelectedBound(normalizeBound({start:ctrlDragLatLngRef.current,end:event.latlng}));  
                ctrlDragLatLngRef.current = undefined;
                return;
            }
            if(-90 <= event.latlng.lat && event.latlng.lat <= 90 && -180 <= event.latlng.lng && event.latlng.lng <= 180){
                setSelectedLocation(event.latlng);
            }
            else{
                setSelectedLocation(undefined);
            }
            setSelectedBound(undefined);
        });

        useMapEvent('mousedown', (event) => {
            if (event.originalEvent.ctrlKey && !ctrlDragLatLngRef.current) {
                setButtonDisabled(true);
                ctrlDragLatLngRef.current  = event.latlng;
                setSelectedLocation(undefined);
            }
            isDraggingRef.current = false;
        });

        useMapEvent('mousemove', (event) => {
            if (ctrlDragLatLngRef.current) {
                setSelectedBound(normalizeBound({start:ctrlDragLatLngRef.current,end:event.latlng}));
            }
            isDraggingRef.current = true;
        });

        useMapEvent('mouseup', (event) => {
            if (ctrlDragLatLngRef.current) {
                setSelectedBound(normalizeBound({start:ctrlDragLatLngRef.current,end:event.latlng}));  
            }
        });

        useMapEvent("keydown", (event) => {
            if (event.originalEvent.ctrlKey) {
                map.dragging.disable();
            }
        });

        useMapEvent("keyup", (event) => {
            if (!event.originalEvent.ctrlKey) {
                ctrlDragLatLngRef.current = undefined;
                setButtonDisabled(false);
                map.dragging.enable();
            }
        });
        return null;
    };

    async function buttonClick(){
        if((selectedLocation === undefined && selectedBound === undefined) || buttonDisabled) return;
        const bound = selectedBound ?? {start:selectedLocation!,end:selectedLocation!};
        try{
            const res = await api.post(`/map/bound/add`,{...bound,id:MAPID});
            const retbound = res.data.bound;
            setBounds([...bounds,retbound]);
            setSelectedLocation(undefined);
            setSelectedBound(undefined);
        } catch (error) {}
    }

    function goBack(){
        router.push(`/map/${MAPID}`);
    }

    if(loading) return <Loading/>;

    return (
        <div className="overflow-hidden h-full w-full">
            <div className="navbar-buffer"/>
            <div className="h-[80vh] w-full">
                <MapPreview bounds={bounds} height={80}>
                    <MapEvent/>
                    <Rectangle
                        bounds={[[-90,-1000],[90,-180]]}
                        color="red"
                        opacity={1}
                        weight={0}
                        interactive={false}
                    />
                    <Rectangle
                        bounds={[[-90,180],[90,1000]]}
                        color="red"
                        opacity={1}
                        weight={0}
                        interactive={false}
                    />
                    {selectedLocation && <MapIcon pos={selectedLocation} iconUrl={"/PlonkStarsAvatar.png"}/>}
                    {selectedBound && (
                        <Rectangle
                            bounds = {[[selectedBound.start.lat,selectedBound.start.lng],[selectedBound.end.lat,selectedBound.end.lng]]}
                            color="blue"
                            weight={0}
                            opacity={1}
                        />
                    )}
                </MapPreview>
                {selectedLocation &&(
                    <div 
                        className={`corner-street-view`}
                    >
                        <StreetView lat={selectedLocation.lat} lng={selectedLocation.lng}/>
                    </div>
                )}
            </div>
            <div className="game-footer w-full">
                <div className="edit-grid-footer">
                    <div className="edit-grid-left-elements">
                        <button onClick={goBack} className="edit-back-button">Back to Map Page</button>
                    </div>
                    <div></div>
                    <div className="edit-grid-right-elements">
                        <button onClick={buttonClick} disabled={(selectedLocation === undefined && selectedBound === undefined) || buttonDisabled} className="game-button edit-right-button">Add Bound</button>
                    </div>
                </div>
            </div>
        </div>
    );
}