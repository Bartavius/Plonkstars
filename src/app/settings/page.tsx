"use client";

import maps from "@/utils/maps";
import "./page.css";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMapType } from "@/redux/settingsSlice";
import Popup from "@/components/Popup";

export default function Settings() {
    const mapNumber = useSelector((state: any) => state.settings.mapNumber);
    const [currentMap, setCurrentMap] = useState<number>(mapNumber);
    const [message, setMessage] = useState<string>();
    const [update, setUpdate] = useState<number>(0);
    const dispatch = useDispatch();

    const saveChanges = () => {
        dispatch(setMapType({mapNumber:currentMap}));
        setMessage("Changes saved!");
        setUpdate(update + 1);
    }

    return (
        <div>
            <div className="navbar-buffer"/>
            <Popup message={message} update={update}/>
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
        </div>
    )
}