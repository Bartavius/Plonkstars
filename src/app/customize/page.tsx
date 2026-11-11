"use client";

/* eslint-disable import/order -- Sorting these imports would reorder stylesheets, since
   CSS loads in import order. See "Imports" in CLAUDE.md. */
import { useState } from "react";

import ProtectedRoutes from "@/features/auth/components/protected-routes";

import MapDisplay from "./_components/map-layer";

import "./page.css";
import Popup from "@/components/primitives/popup";

import AvatarCustom from "./_components/avatar";
import MapResolution from "./_components/map-resolution";
import "leaflet/dist/leaflet.css";

export default function Settings() {
  const [message, _setMessage] = useState<React.ReactNode>();
  const [type, setType] = useState<string>("");
  const [update, setUpdate] = useState<number>(0);

  const setMessage = (message: React.ReactNode) => {
    _setMessage(message);
    setUpdate((prev) => prev + 1);
  };

  return (
    <ProtectedRoutes allowDemo={true}>
      <div>
        <div className="navbar-buffer" />
        <Popup update={update} type={type}>
          {message}
        </Popup>
        <div className="settings-wrapper">
          <div id="top" className="settings-header">
            Customizations
          </div>
          <AvatarCustom setMessage={setMessage} setType={setType} />
          <MapDisplay setMessage={setMessage} />
          <MapResolution setMessage={setMessage} />
        </div>
      </div>
    </ProtectedRoutes>
  );
}
