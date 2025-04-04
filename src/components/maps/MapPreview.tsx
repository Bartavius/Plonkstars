"use client";

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
import { useState } from "react";

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
    onSelect
}: {
    bounds: (Bounds|Location)[];
    children?: React.ReactNode;
    onClick?: (event:LeafletMouseEvent) => void;
    iconClick?: boolean;
    height?: number;
    onSelect?: (location: Bounds|undefined,isRect:boolean) => void;
}) => {
    const [selected,setSelected] = useState<Bounds|Location>();
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
    
    const select = (location: Location|Bounds|undefined,isRect:boolean) => {
        setSelected(location);
        if (location && isRect && onSelect && "lat" in location && "lng" in location) {
            onSelect({start:location,end:location},isRect);
        }
        else if (location && 'start' in location && 'end' in location && onSelect) {
            onSelect(location,isRect);
        }  
        else {
            onSelect && onSelect(undefined,isRect);
        } 
    }

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
                        <div key={index}>
                        {point !== selected && 
                            <MapIcon pos={point} clickable={iconClick || onSelect !== undefined} iconUrl="/PlonkStarsMarker.png" onClick={onSelect ? () => select(point,false) : undefined}/>
                        }
                        {point == selected && 
                            <MapIcon pos={point} clickable={iconClick || onSelect !== undefined} iconUrl="/PlonkStarsAvatar.png" onClick={onSelect ? () => select(undefined,false) : undefined}/>
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
                                eventHandlers={onSelect ? { click: () => select(bound,true) } : undefined}
                                bounds={[[bound.start.lat,bound.start.lng],[bound.end.lat,bound.end.lng]]}
                                color="yellow"
                                opacity={1}
                                weight={0}
                            />
                        }
                        {bound === selected && 
                            <Rectangle
                                interactive = {onSelect !== undefined}
                                eventHandlers={onSelect ? { click: () => select(undefined,true) } : undefined}
                                bounds={[[bound.start.lat,bound.start.lng],[bound.end.lat,bound.end.lng]]}
                                color="blue"
                                opacity={1}
                                weight={0}
                            />
                        }
                        </div>
                    ))}
                </div>
            </MapContainer>
        </div>
    );
    };

    export default MapPreview;