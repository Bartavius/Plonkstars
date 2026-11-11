"use client";
import L from "leaflet";
import { MapContainer, Rectangle } from "react-leaflet";

import type { UserIconCosmetics } from "@/features/cosmetics/types/user-icon-cosmetics";

import { FitBounds } from "./fit-bounds";
import { MapIcon } from "./map-icon";
import "./map.css";
import { MapTileLayer } from "./map-tile-layer";

interface Location {
  lat: number;
  lng: number;
}

interface Bounds {
  start: Location;
  end: Location;
}
interface MapPreviewProps {
  bounds: (Bounds | Location)[];
  children?: React.ReactNode;
  iconClick?: boolean;
  height?: number;
  onSelect?: (location: Location | Bounds | undefined, isRect: boolean) => void;
  selected?: Location | Bounds | undefined;
  user_cosmetics?: UserIconCosmetics;
}

function MapPreview({
  bounds,
  children,
  iconClick,
  height,
  onSelect,
  selected,
  user_cosmetics,
}: MapPreviewProps) {
  const points = bounds.filter((marker) => {
    return "lat" in marker && "lng" in marker;
  });

  const area = bounds.filter((marker) => {
    return "start" in marker && "end" in marker;
  });
  const locations = [...points, ...area.map((bound) => [bound.start, bound.end])].flat();

  const ZOOM_DELTA = 2;
  const PX_PER_ZOOM_LEVEL = 2;
  const CENTER = { lat: 0, lng: 0 };
  const maxBounds = L.latLngBounds({ lat: -85, lng: -240 }, { lat: 85, lng: 240 });

  return (
    <div
      className="w-full h-[90vh] overflow-hidden max-[720px]:h-[80vh] max-[720px]:z-[1000] max-[720px]:transition-[transform] max-[720px]:duration-300 max-[720px]:ease-[ease-in-out] max-[720px]:origin-bottom-right relative z-0 max-[720px]:top-[-5vh]"
      style={height ? { height: `${height}vh` } : undefined}
    >
      <MapContainer
        maxBounds={maxBounds}
        zoomDelta={ZOOM_DELTA}
        worldCopyJump={false}
        wheelPxPerZoomLevel={PX_PER_ZOOM_LEVEL}
        scrollWheelZoom={true}
        className="leaflet-result-map"
        center={CENTER}
        zoom={2}
      >
        <MapTileLayer size={512} offset={-1} />
        {children}
        <div>
          {points.map((point, index) => (
            <div key={index}>
              {point !== selected && (
                <MapIcon
                  pos={point}
                  clickable={iconClick || onSelect !== undefined}
                  iconUrl="/PlonkStarsMarker.png"
                  onClick={onSelect ? () => onSelect(point, false) : undefined}
                />
              )}
              {point == selected && (
                <MapIcon
                  pos={point}
                  clickable={iconClick || onSelect !== undefined}
                  iconUrl="/PlonkStarsAvatar.png"
                  onClick={onSelect ? () => onSelect(undefined, false) : undefined}
                  customize={user_cosmetics}
                  iconPercent={1.25}
                />
              )}
            </div>
          ))}
        </div>
        <div>
          {area.map((bound, index) => (
            <div key={index}>
              {bound !== selected && (
                <Rectangle
                  interactive={onSelect !== undefined}
                  eventHandlers={onSelect ? { click: () => onSelect(bound, true) } : undefined}
                  bounds={[
                    [bound.start.lat, bound.start.lng],
                    [bound.end.lat, bound.end.lng],
                  ]}
                  color="yellow"
                  opacity={1}
                  weight={0}
                />
              )}
              {bound === selected && (
                <Rectangle
                  interactive={onSelect !== undefined}
                  eventHandlers={onSelect ? { click: () => onSelect(undefined, true) } : undefined}
                  bounds={[
                    [bound.start.lat, bound.start.lng],
                    [bound.end.lat, bound.end.lng],
                  ]}
                  color="blue"
                  opacity={1}
                  weight={0}
                />
              )}
            </div>
          ))}
        </div>
        <FitBounds locations={locations} summary={false} />
      </MapContainer>
    </div>
  );
}

export { MapPreview };
