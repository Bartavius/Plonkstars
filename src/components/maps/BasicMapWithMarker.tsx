"use client";

import { useRef, useState } from "react";
import { MapContainer, useMapEvents } from "react-leaflet";
import L, { LatLngLiteral, map } from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import getTileLayer from "@/utils/leaflet";
import MapIcon from "./mapIcon";
import FitBounds from "./FitBounds";


export default function BasicMapWithMarker({
  setLat,
  setLng,
  mapBounds,
}: {
  setLat: (n: number) => void;
  setLng: (n: number) => void;
  mapBounds: any;
}){
  const [markerPosition, setMarkerPosition] = useState<LatLngLiteral | null>(
    null
  );
  const [isHovered, setIsHovered] = useState(false);
  const [center] = useState({ lat: 20, lng: 0 });
  const ZOOM_LEVEL = 0;
  const mapRef = useRef(null);

  interface LocationMarkerProps {
    setMarkerPosition: (pos: LatLngLiteral) => void;
  }

  function LocationMarker({ setMarkerPosition }: LocationMarkerProps) {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setLat(lat);
        setLng(lng);
        setMarkerPosition({ lat, lng });
      },
    });
    return null;
  }

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      setIsHovered(false);
    }, 1000);
  };

  return (
    <div
      className={`leaflet-container-wrapper ${isHovered ? "hovered" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <MapContainer
        center={center}
        zoom={ZOOM_LEVEL}
        ref={mapRef}
        className="leaflet-map"
      >
        {getTileLayer()}
        <LocationMarker setMarkerPosition={setMarkerPosition} />
        {markerPosition && (
          <MapIcon pos={markerPosition} iconUrl="/PlonkStarsAvatar.png" iconPercent={.5}/>
        )}
        <FitBounds locations={[mapBounds.start,mapBounds.end]}/>
      </MapContainer>
    </div>
  );
};