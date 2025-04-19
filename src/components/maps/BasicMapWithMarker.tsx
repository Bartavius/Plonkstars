"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, useMapEvents } from "react-leaflet";
import L, { LatLngLiteral } from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import getTileLayer from "@/utils/leaflet";
import MapIcon from "./mapIcon";
import FitBounds from "./FitBounds";
import api from "@/utils/api";

interface UserIcon {
  hue: number;
  saturation: number;
  brightness: number;
}


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
          <MapIcon pos={markerPosition} customAvatar={userIcon} iconUrl="/PlonkStarsAvatar.svg" iconPercent={0.1}/>
        )}
        <FitBounds locations={[mapBounds.start,mapBounds.end]} summary={false}/>
      </MapContainer>
    </div>
  );
};