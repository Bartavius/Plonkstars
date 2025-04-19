"use client";

import { MapContainer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import MapIcon from "./mapIcon";
import getTileLayer from "@/utils/leaflet";
import FitBounds from "./FitBounds";
import L from "leaflet";
import { filter } from "framer-motion/client";

interface GuessPair {
  users: { lat: number|undefined; lng: number|undefined }[];
  correct: { lat: number; lng: number };
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
  
  const createColorIcon = (hue?: number, saturation?: number, brightness?: number) => {
    return L.divIcon({
      className: "transparent-icon",
      html: `<img src="/PlonkStarsAvatar.svg" style="filter: hue-rotate(${hue ?? 0}deg) saturate(${saturation ?? 100}%) brightness(${brightness ?? 100}%) ;" alt="" />`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });
  }

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
                    <Marker
                      position={{ lat: user.lat, lng: user.lng }}
                      icon={createColorIcon(0, 100, 100)}
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