"use client";

import { MapContainer, useMapEvents } from "react-leaflet";
import "./map.css";
import MapTileLayer from "@/utils/leaflet";
import MapIcon from "./mapIcon";
import FitBounds from "./FitBounds";
import { useSelector } from "react-redux";
import { UserIconCosmetics } from "@/types/userIconCosmetics";

export default function BasicMapWithMarker({
  lat,
  lng,
  setPos,
  mapBounds,
  cosmetics,
}: {
  lat?: number,
  lng?: number,
  setPos: (lat: number,lng:number) => void;
  mapBounds: any;
  cosmetics?: UserIconCosmetics;
}){
  const res = useSelector((state: any) => state.settings.miniMapResolution);


  const ClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPos(lat,lng);
      },
    });
    return null;
  }

  return (
    <MapContainer
      zoomDelta={2}
      wheelPxPerZoomLevel={2}
      zoomControl={false}
      className="leaflet-map"
    >
      <MapTileLayer size={res} offset={8-Math.log2(res)}/>
      <ClickHandler />
      {lat && lng && (
        <MapIcon pos={{lat,lng}} customize={cosmetics} iconUrl="/PlonkStarsAvatar.png" iconPercent={0.55}/>
      )}
      <FitBounds locations={[mapBounds.start,mapBounds.end]} summary={false}/>
    </MapContainer>
  );
};