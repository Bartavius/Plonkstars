"use client";

import maps from "@/utils/maps";
import "./page.css"
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import getTileLayer from "@/utils/leaflet";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { m } from "framer-motion";
import { setMapType } from "@/redux/settingsSlice";
import { useRouter } from "next/navigation";
import Popup from "./popup";

export default function Settings() {
    const mapNumber = useSelector((state: any) => state.settings.mapNumber);
    const [currentMap, setCurrentMap] = useState<number>(mapNumber);
    const [message, setMessage] = useState<string>();
    const [popupFade, setPopupFade] = useState<boolean>(false);
    const dispatch = useDispatch();
    const router = useRouter();

    const saveChanges = () => {
        dispatch(setMapType(currentMap));
        showPopup("Changes saved!");
    }


    const showPopup = (message: string) => {
        setPopupFade(false);
        setMessage(message);
    
        setTimeout(() => {
            setPopupFade(true);
            setTimeout(() => {
            setMessage(undefined);
            }, 1000);
        }, 2000);
    };

    return (
        <div>
            <div className="navbar-buffer"/>
            <div className="settings-wrapper">
                <div id="top" className="settings-header">Settings</div>
                <div className="settings-box">
                    <div className="settings-label">Map Type</div>
                    <div className="settings-dropdown">
                        <select className="settings-dropdown-select" defaultValue={currentMap} onChange={(e) => setCurrentMap(parseInt((e.target as HTMLSelectElement).value))}>
                           {maps.map((mapValue:any, index:number) => 
                                (<option key={index} value={index}>{mapValue.name}</option>)
                           )}
                        </select>
                        <MapContainer
                            center={[0,0]}
                            zoom={0}
                            className="leaflet-map"
                        >
                            <TileLayer 
                                url={maps[currentMap].url} 
                                attribution={maps[currentMap].attribution} 
                                tileSize={256}
                                zoomOffset={0}
                                detectRetina={true}
                                className="leaflet-control-attribution"
                            />
                        </MapContainer>
                    </div>
                    <button className="form-button-selected mt-2" onClick={saveChanges}>Save Changes</button>
                </div>
            </div>
            <div className="popup-wrapper">
                { message &&
                    <Popup message={message} fadeOut={popupFade}/>
                }
            </div>
        </div>
    )
}