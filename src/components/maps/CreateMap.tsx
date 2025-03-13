"use client";

import { useState } from "react";
import MapPreview from "./MapPreview";
import { Rectangle, useMapEvent } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";
import { on } from "events";
import MapIcon from "./mapIcon";

interface Location {
    lat:number,
    lng:number
}

interface Bounds {
    start: Location,
    end: Location
}

export default function CreateMap(
{
    bounds,
    getSelectedLocation,
    getSelectedBound,
    onClick,
}: {
    bounds: Bounds[],
    getSelectedLocation: () => Location|undefined,
    getSelectedBound: () => Bounds|undefined,
    onClick: (click?:Location) => void;
}) {
    const SetLatLng = () => {
        useMapEvent("click", (event: LeafletMouseEvent) => {
            if(-90 <= event.latlng.lat && event.latlng.lat <= 90 && -180 <= event.latlng.lng && event.latlng.lng <= 180){
                onClick(event.latlng);
            }
            else{
                onClick();
            }
        });
        return null;
    };
    const location = getSelectedLocation();
    return (
        <div>
            <MapPreview bounds={bounds} iconClick={false}>
                <SetLatLng/>
                <Rectangle
                    bounds={[[-90,-1000],[90,-180]]}
                    color="red"
                    opacity={1}
                    weight={0}
                />
                <Rectangle
                    bounds={[[-90,180],[90,1000]]}
                    color="red"
                    opacity={1}
                    weight={0}
                />
                {location && <MapIcon pos={location} iconUrl="/logo.png"/>}
            </MapPreview>
        </div>
    );
}