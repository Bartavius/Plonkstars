"use client";

import { useRef, useState } from "react";
import { MapContainer, Marker, useMapEvents } from "react-leaflet";
import L, { LatLngLiteral } from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import getTileLayer from "@/utils/leaflet";


const BasicMapWithMarker = ({
  setLat,
  setLng,
}: {
  setLat: (n: number) => void;
  setLng: (n: number) => void;
}) => {
  const [markerPosition, setMarkerPosition] = useState<LatLngLiteral | null>(
    null
  );
  const [isHovered, setIsHovered] = useState(false);

  const [center] = useState({ lat: 20, lng: 0 });
  const ZOOM_LEVEL = 0.5;
  const mapRef = useRef(null);

  const customIcon = L.icon({
    iconUrl: "/PlonkStarsAvatar.png",
    iconSize: [15, 25],
    iconAnchor: [9, 30],
  });

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
          <Marker position={markerPosition} icon={customIcon} />
        )}
      </MapContainer>
    </div>
  );
};

export default BasicMapWithMarker;
