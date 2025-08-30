"use client";
import {
    MapContainer,
    Rectangle,
} from "react-leaflet";
import L from "leaflet";
import MapIcon from "./mapIcon";
import "./map.css";
import MapTileLayer from "../../utils/leaflet";
import FitBounds from "./FitBounds";
import { UserIconCosmetics } from "@/types/userIconCosmetics";

interface Location {
    lat:number,
    lng:number
}

interface Bounds {
    start: Location;
    end: Location;
}

export default function MapPreview({
    bounds,
    children,
    iconClick,
    height,
    onSelect,
    selected,
    user_cosmetics,
}: {
    bounds: (Bounds|Location)[];
    children?: React.ReactNode;
    iconClick?: boolean;
    height?: number;
    onSelect?: (location: Location|Bounds|undefined,isRect:boolean) => void;
    selected?: Location|Bounds|undefined;
    user_cosmetics?: UserIconCosmetics;
}){
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
    const maxBounds = L.latLngBounds({lat:-85, lng:-240},{lat:85, lng:240})

    return (
        <div
            className="leaflet-container-result-wrapper map-result-container"
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
                <MapTileLayer size={512} offset={-1}/>
                {children}
                <div>
                    {points.map((point,index) => (
                        <div key={index}>
                        {point !== selected && 
                            <MapIcon pos={point} clickable={iconClick || onSelect !== undefined} iconUrl="/PlonkStarsMarker.png" onClick={onSelect ? () => onSelect(point,false) : undefined}/>
                        }
                        {point == selected && 
                            <MapIcon pos={point} clickable={iconClick || onSelect !== undefined} iconUrl="/PlonkStarsAvatar.png" onClick={onSelect ? () => onSelect(undefined,false) : undefined} iconPercent={0.2} customize={user_cosmetics}/>
                        }
                        </div>
                    ))}
                </div>
                <div>
                    {area.map((bound,index) => (
                        <div key={index}>
                        {bound !== selected && 
                            <Rectangle
                                interactive = {onSelect !== undefined}
                                eventHandlers={onSelect ? { click: () => onSelect(bound,true) } : undefined}
                                bounds={[[bound.start.lat,bound.start.lng],[bound.end.lat,bound.end.lng]]}
                                color="yellow"
                                opacity={1}
                                weight={0}
                            />
                        }
                        {bound === selected && 
                            <Rectangle
                                interactive = {onSelect !== undefined}
                                eventHandlers={onSelect ? { click: () => onSelect(undefined,true) } : undefined}
                                bounds={[[bound.start.lat,bound.start.lng],[bound.end.lat,bound.end.lng]]}
                                color="blue"
                                opacity={1}
                                weight={0}
                            />
                        }
                        </div>
                    ))}
                </div>
                <FitBounds locations={locations} summary={false}/>
            </MapContainer>
        </div>
    );
};