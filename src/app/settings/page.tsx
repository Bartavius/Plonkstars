"use client";

import maps from "@/utils/maps";
import "./page.css";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMapType } from "@/redux/settingsSlice";
import Popup from "@/components/Popup";
import api from "@/utils/api";
import AvatarCustom from "./avatar";

interface UserIcon {
  hue: number;
  saturation: number;
  brightness: number;
}

const MAX_HUE = 360;
const MAX_SATURATION = 300;
const MAX_BRIGHTNESS = 200;
const colorPresets = [
  { name: "Red", color: "#FF3B4A", hue: 315, saturation: 300, brightness: 100 },
  { name: "Orange", color: "#FF8300", hue: 331, saturation: 255, brightness: 144 },
  { name: "Yellow", color: "#FFFF00", hue: 0, saturation: 300, brightness: 200 },
  { name: "Green", color: "#00f734", hue: 81, saturation: 228, brightness: 116 },
  { name: "Blue", color: "#00d8ff", hue: 183, saturation: 236, brightness: 137 },
  { name: "Bluer", color: "#298fff", hue: 192, saturation: 273, brightness: 97 },
  { name: "Pink", color: "#ff95ff", hue: 254, saturation: 158, brightness: 142 },
  { name: "Lilac", color: "#C77CE0", hue: 240, saturation: 100, brightness: 100 },
  { name: "Purple", color: "#9274ff", hue: 210, saturation: 300, brightness: 97 },
  { name: "Black", color: "#000000", hue: 0, saturation: 0, brightness: 0 },
  { name: "Grey", color: "#A1A1A1", hue: 0, saturation: 0, brightness: 110 },
  { name: "White", color: "#FFFFFF", hue: 0, saturation: 0, brightness: 200 },
];

export default function Settings() {
  const mapNumber = useSelector((state: any) => state.settings.mapNumber);
  const [currentMap, setCurrentMap] = useState<number>(mapNumber);
  const [message, setMessage] = useState<string>();
  const [update, setUpdate] = useState<number>(0);
  const dispatch = useDispatch();

  const saveChanges = () => {
    dispatch(setMapType({ mapNumber: currentMap }));
    setMessage("Changes saved!");
    setUpdate(update + 1);
  };

  return (
    <div>
      <div className="navbar-buffer" />
      <Popup message={message} update={update} />
      <div className="settings-wrapper">
        <div id="top" className="settings-header">
          Settings
        </div>

        <AvatarCustom setMessage={setMessage} />
        
        <div className="settings-box">
          <div className="settings-label">Map Type</div>
          <div className="settings-dropdown">
            <select
              className="settings-dropdown-select"
              defaultValue={currentMap}
              onChange={(e) =>
                setCurrentMap(parseInt((e.target as HTMLSelectElement).value))
              }
            >
              {maps.map((mapValue: any, index: number) => (
                <option key={index} value={index}>
                  {mapValue.name}
                </option>
              ))}
            </select>
            <MapContainer center={[0, 0]} zoom={0} className="leaflet-map">
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
          <button className="form-button-selected mt-2" onClick={saveChanges}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
