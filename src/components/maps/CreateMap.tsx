"use client";

import React, { useState } from "react";
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
    children
}: {
    bounds: Bounds[],
    children?: React.ReactNode
}) {
    return (
        <div>
            <MapPreview bounds={bounds} iconClick={false}>
                {children}
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
            </MapPreview>
        </div>
    );
}