"use client";

import maps from "@/utils/maps";
import "./page.css";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMapType } from "@/redux/settingsSlice";
import Popup from "@/components/Popup";
import MapDisplay from "./mapLayer";
import AvatarCustom from "./avatar";
import MapResolution from "./mapResolution";

export default function Settings() {
  const mapNumber = useSelector((state: any) => state.settings.mapNumber);
  const [currentMap, setCurrentMap] = useState<number>(mapNumber);
  const [message, _setMessage] = useState<React.ReactNode>();
  const [update, setUpdate] = useState<number>(0);
  const dispatch = useDispatch();

  const setMessage = (message: React.ReactNode) => {
    _setMessage(message);
    setUpdate((prev) => prev + 1);
  };

  return (
    <div>
      <div className="navbar-buffer" />
      <Popup update={update}>
        {message}
      </Popup>
      <div className="settings-wrapper">
        <div id="top" className="settings-header">
          Customizations
        </div>
        <AvatarCustom setMessage={setMessage}/>
        <MapDisplay setMessage={setMessage}/>
        <MapResolution setMessage={setMessage}/>
      </div>
    </div>
  );
}
