"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, useMapEvents } from "react-leaflet";
import { LatLngLiteral } from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import MapTileLayer from "@/utils/leaflet";
import MapIcon from "./mapIcon";
import FitBounds from "./FitBounds";
import api from "@/utils/api";

export default function BasicMapWithMarker({
  lat,
  lng,
  canChange = true,
  setLat,
  setLng,
  mapBounds,
}: {
  lat?: number,
  lng?: number,
  canChange?: boolean
  setLat: (n: number) => void;
  setLng: (n: number) => void;
  mapBounds: any;
}){
  const [markerPosition, setMarkerPosition] = useState<LatLngLiteral | null>(
    lat !== undefined && lng !== undefined? {lat,lng}: null
  );
  const [isHovered, setIsHovered] = useState(false);
  const [center] = useState({ lat: 20, lng: 0 });
  const ZOOM_LEVEL = 0;
  const mapRef = useRef<L.Map | null>(null);

  interface LocationMarkerProps {
    setMarkerPosition: (pos: LatLngLiteral) => void;
  }

  function LocationMarker({ setMarkerPosition }: LocationMarkerProps) {
    useMapEvents({
      click(e) {
        if(!canChange) return;
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

  useEffect(() => {
    const timeout = setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 150);
  
    return () => clearTimeout(timeout);
  }, [isHovered]);

  const [userIcon, setUserIcon] = useState<any>({hue: 0, saturation: 100, brightness: 100});
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
        <MapTileLayer size={128} offset={1}/>
        <LocationMarker setMarkerPosition={setMarkerPosition} />
        {markerPosition && (
          <MapIcon pos={markerPosition} recolor={userIcon} iconUrl="/PlonkStarsAvatar.svg" iconPercent={0.1}/>
        )}
        <FitBounds locations={[mapBounds.start,mapBounds.end]} summary={false}/>
      </MapContainer>
    </div>
  );
};