"use client";

import api from "@/utils/api";
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
    id?:number,
    weight?:number,
    lat:number,
    lng:number,
}

interface Bounds {
    weight?:number,
    id?:number,
    start: Location,
    end: Location
}

export default function EditMapPage() {
    const [bounds,setBounds] = useState<(Bounds|Location)[]>([]);
    const [selectedBound,setSelectedBound] = useState<Bounds|Location>();
    const [buttonDisabled,setButtonDisabled] = useState<boolean>(false);
    const [loading,setLoading] = useState<boolean>(true);
    const [existingBound,setExistingBound] = useState<boolean>(false);
    const [weight, setWeight] = useState<number>();
    const rectangleClickedRef = useRef(false);
    const MAPID = useParams().id;
    const router = useRouter();


    const getLocations = async () => {
        try{
            const canEdit = await api.get(`/map/edit?id=${MAPID}`);
            if(!canEdit.data.can_edit){
                router.push(`/map/${MAPID}`);
            }
            const response = await api.get(`/map/bounds?id=${MAPID}`);
            setBounds(response.data);
            setLoading(false);
        } catch (error) {
            router.push("/map");
        }
    }

    useEffect(() => {
        getLocations();
    }, []);

    const onSelect = (location: Location|Bounds|undefined,rectSelected:boolean) => {
        if(rectSelected){
            rectangleClickedRef.current = true;
        }
        setSelectedBound(location);
        setExistingBound(location !== undefined);
    }

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
            if (rectangleClickedRef.current) {
                rectangleClickedRef.current = false;
                return;
            }
            setExistingBound(false);
            if(isDraggingRef.current) return;
            if(ctrlDragLatLngRef.current){
                setSelectedBound(normalizeBound({start:ctrlDragLatLngRef.current,end:event.latlng}));  
                ctrlDragLatLngRef.current = undefined;
                return;
            }
            if(-90 <= event.latlng.lat && event.latlng.lat <= 90 && -180 <= event.latlng.lng && event.latlng.lng <= 180){
                setSelectedBound(event.latlng);
            }
            else{
                setSelectedBound(undefined);
            }
        });

        useMapEvent('mousedown', (event) => {
            if (rectangleClickedRef.current) {
                return;
            }
            if (event.originalEvent.ctrlKey || event.originalEvent.metaKey && !ctrlDragLatLngRef.current) {
                setButtonDisabled(true);
                ctrlDragLatLngRef.current  = event.latlng;
                setSelectedBound(undefined);
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
            if (event.originalEvent.ctrlKey || event.originalEvent.metaKey) {
                map.dragging.disable();
            }

            if (event.originalEvent.code === 'Space'){
                buttonClick();
            }
        });

        useMapEvent("keyup", (event) => {
            if (!event.originalEvent.ctrlKey && !event.originalEvent.metaKey) {
                ctrlDragLatLngRef.current = undefined;
                setButtonDisabled(false);
                map.dragging.enable();
            }
        });
        return null;
    };

    async function buttonClick(){
        if(selectedBound === undefined || buttonDisabled) return;
        try{
            if(existingBound){
                const res = await api.delete("/map/edit/bound/remove",{data:{b_id:selectedBound.id,id:MAPID}});
                setBounds(bounds.filter((bound) => bound.id != res.data.id));
            }
            else{
                const res = await api.post("/map/edit/bound/add",{...selectedBound,id:MAPID,weight:weight});
                setBounds([...bounds,res.data]);
            }
            setExistingBound(false);
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
                <MapPreview bounds={bounds} height={80} onSelect={onSelect} selected={selectedBound}>
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
                    {selectedBound && "lat" in selectedBound && "lng" in selectedBound && <MapIcon pos={selectedBound} iconUrl={"/PlonkStarsAvatar.png"}/>}
                    {selectedBound && "start" in selectedBound && "end" in selectedBound &&
                        <Rectangle
                            bounds = {[[selectedBound.start.lat,selectedBound.start.lng],[selectedBound.end.lat,selectedBound.end.lng]]}
                            color="blue"
                            weight={0}
                            opacity={1}
                        />
                    }
                </MapPreview>
                {selectedBound && "lat" in selectedBound && "lng" in selectedBound &&(
                    <div 
                        className={`corner-street-view`}
                    >
                        <StreetView lat={selectedBound.lat} lng={selectedBound.lng}/>
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
                        <div className="bound-weight-display">
                            <label className="weight-input-wrapper">
                                <div className="weight-title">Weight</div>
                                <input type="number" className="weight-input-box" value={existingBound? selectedBound && selectedBound.weight: weight??""} disabled={existingBound} onChange={(e) => !existingBound && setWeight(e.target.value===""?undefined:parseInt(e.target.value))}/>
                            </label>
                        </div>
                        <button onClick={buttonClick} disabled={(selectedBound === undefined) || buttonDisabled} className="game-button edit-right-button">
                            {existingBound? "Remove": "Add"} {selectedBound && "lat" in selectedBound && "lng" in selectedBound ? "Point": "Bound"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}