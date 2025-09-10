"use client";

import "./page.css";
import { useState } from "react";
import Popup from "@/components/Popup";
import MapDisplay from "./mapLayer";
import AvatarCustom from "./avatar";
import MapResolution from "./mapResolution";
import ProtectedRoutes from "../ProtectedRoutes";
import "leaflet/dist/leaflet.css";


export default function Settings() {
  const [message, _setMessage] = useState<React.ReactNode>();
  const [type, setType] = useState<string>('');
  const [update, setUpdate] = useState<number>(0);

  const setMessage = (message: React.ReactNode) => {
    _setMessage(message);
    setUpdate((prev) => prev + 1);
  }

  return (
    <ProtectedRoutes>
      <div>
        <div className="navbar-buffer" />
        <Popup update={update} type={type}>
          {message}
        </Popup>
        <div className="settings-wrapper">
          <div id="top" className="settings-header">
            Customizations
          </div>
          <AvatarCustom setMessage={setMessage} setType={setType}/>
          <MapDisplay setMessage={setMessage}/>
          <MapResolution setMessage={setMessage}/>
        </div>
      </div>
    </ProtectedRoutes>
  );
}
