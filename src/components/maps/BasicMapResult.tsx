"use client";

import { MapContainer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import MapIcon from "./mapIcon";
import getTileLayer from "@/utils/leaflet";
import FitBounds from "./FitBounds";
import L from "leaflet";
import { useEffect, useState } from "react";
import api from "@/utils/api";

interface GuessPair {
  users: { lat: number|undefined; lng: number|undefined }[];
  correct: { lat: number; lng: number };
}

interface UserIcon {
  hue: number;
  saturation: number;
  brightness: number;
}

export default function BasicMapResult({
  markers,
  height,
}: {
  markers: GuessPair[];
  height?: number;
}){
  const boundedMarkers = markers.map((marker) => {
    const newUsers = marker.users.map(
      (user) => {
        if (user.lat === undefined || user.lng === undefined) {
          return;
        }

        let newLng = user.lng;
        if (user.lng - marker.correct.lng > 180) {
          newLng = user.lng - 360;
        } else if (user.lng - marker.correct.lng < -180) {
          newLng = user.lng + 360;
        }
        return { lat: user.lat, lng: newLng };
      }
    ).filter((user) => user !== undefined) as { lat: number; lng: number }[];
    return { ...marker, users: newUsers };
  });

  const locations = boundedMarkers.map((marker) => [marker.correct, ...marker.users]).flat();
  

  const ZOOM_DELTA = 2;
  const PX_PER_ZOOM_LEVEL = 2;
  const CENTER = { lat: 0, lng: 0 };

  const dottedLine = {
    color: "black",
    weight: 7,
    opacity: 1,
    dashArray: "5, 15",
  };
  
  const [userIcon, setUserIcon] = useState<UserIcon>({hue: 0, saturation: 150, brightness: 100});

  useEffect(() => {
      const fetchAvatar = async () => {
        const response = await api.get("/account/profile");
        const cosmetics = response.data.user_cosmetics;
        setUserIcon(cosmetics);
      }
      fetchAvatar();
  }, [])

  return (
    <div
      className="leaflet-container-result-wrapper"
      style={height ? { height: `${height}dvh` } : undefined}
    >
      <MapContainer
        zoomDelta={ZOOM_DELTA}
        wheelPxPerZoomLevel={PX_PER_ZOOM_LEVEL}
        scrollWheelZoom={true}
        className="leaflet-result-map"
        center={CENTER}
        zoom={7}
      >
        {getTileLayer(512,-1)}
        {boundedMarkers.map((markerObj, index) => (
          <div key={index}>
            {markerObj && (
              <MapIcon
                pos={markerObj.correct}
                clickable={true}
                iconUrl="/PlonkStarsMarker.png"
              />
            )}
            {markerObj.users.map((user, userIndex) => (
              <div key={userIndex}>
                {user && user.lat && user.lng && (
                  <>
                    <MapIcon
                      pos={{ lat: user.lat, lng: user.lng }}
                      customAvatar={userIcon}
                      iconUrl="/PlonkStarsAvatar.png"
                      />
                    <div>
                      <Polyline
                        interactive={false}
                        positions={[
                          [user.lat, user.lng],
                          [markerObj.correct.lat, markerObj.correct.lng],
                        ]}
                        pathOptions={dottedLine}
                      />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
        <FitBounds locations={locations} options={{paddingTopLeft: [10, 50],paddingBottomRight: [10, 20]}} summary={true}/>
      </MapContainer>
    </div>
  );
};