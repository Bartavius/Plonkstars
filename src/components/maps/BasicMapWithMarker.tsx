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
import { useSelector } from "react-redux";
import { UserIconCosmetics } from "@/types/userIconCosmetics";
import Loading from "../loading";

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
  const res = useSelector((state: any) => state.settings.miniMapResolution);

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

  const [userIcon, setUserIcon] = useState<UserIconCosmetics>({
    hue: 0,
    saturation: 100,
    brightness: 100,
    hat: "no_hat",
    body: "no_body",
    face: "no_face",
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAvatar = async () => {
      const response = await api.get("/account/profile");
      const cosmetics = response.data.user_cosmetics;
      setUserIcon(cosmetics);
    }
    fetchAvatar();
    setLoading(false);
  }, [])

  if (loading) {
    return <Loading />;
  }
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
        <MapTileLayer size={res} offset={8-Math.log2(res)}/>
        <LocationMarker setMarkerPosition={setMarkerPosition} />
        {markerPosition && (
          <MapIcon pos={markerPosition} customize={userIcon} iconUrl="/PlonkStarsAvatar.svg" iconPercent={0.1}/>
        )}
        <FitBounds locations={[mapBounds.start,mapBounds.end]} summary={false}/>
      </MapContainer>
    </div>
  );
};