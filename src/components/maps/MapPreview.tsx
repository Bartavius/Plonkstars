"use client";

import { useEffect, useRef } from "react";
import {
    MapContainer,
    Rectangle,
    useMap,
} from "react-leaflet";
import L, { LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";
import MapIcon from "./mapIcon";
import "./map.css";
import getTileLayer from "../../utils/leaflet";

interface Location {
    lat:number,
    lng:number
}

interface Bounds {
    start: Location;
    end: Location;
}

const MapPreview = ({
    bounds,
    children,
    iconClick,
    height,
}: {
    bounds: (Bounds|Location)[];
    children?: React.ReactNode;
    onClick?: (event:LeafletMouseEvent) => void;
    iconClick?: boolean;
    height?: number;
}) => {
    const points = bounds.filter((marker) => {
        return "lat" in marker && "lng" in marker;
    });

    const area = bounds.filter((marker) => {
        return "start" in marker && "end" in marker;
    });

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
                {getTileLayer(512, -1)}
                {children}
                <div>
                    {points.map((point,index) => (
                        <MapIcon key={index} pos={point} clickable={iconClick} iconUrl="/PlonkStarsMarker.png"/>
                    ))}
                </div>
                <div>
                    {area.map((bound,index) => (
                            <Rectangle
                                key={index}
                                bounds={[[bound.start.lat,bound.start.lng],[bound.end.lat,bound.end.lng]]}
                                color="yellow"
                                opacity={1}
                                weight={0}
                            />
                        ))
                    }
                </div>
            </MapContainer>
        </div>
    );
    };

    export default MapPreview;