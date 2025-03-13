"use client";

import { useEffect } from "react";
import {
    MapContainer,
    Rectangle,
    useMap,
} from "react-leaflet";
import L from "leaflet";
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
    bounds: markers,
    height
}: {
    bounds: Bounds[];
    height?: number;
}) => {
    const points = markers.filter((marker:Bounds) => {
        return marker.start.lat === marker.end.lat && marker.start.lng === marker.end.lng;
    }).map(map => map.start);

    const bounds = markers.filter((marker:Bounds) => {
        return !(marker.start.lat === marker.end.lat && marker.start.lng === marker.end.lng);
    });

    console.log(points,bounds);

    const ZOOM_DELTA = 2;
    const PX_PER_ZOOM_LEVEL = 2;
    const CENTER = { lat: 0, lng: 0 };

    return (
        <div
            className="leaflet-container-result-wrapper"
            style={height ? { height: `${height}dvh` } : undefined}
        >
        <MapContainer
            maxBounds={[           
                [-85, -240],
                [85, 240]
            ]}
            maxBoundsViscosity= {1.0}
            zoomDelta={ZOOM_DELTA}
            worldCopyJump={false}
            wheelPxPerZoomLevel={PX_PER_ZOOM_LEVEL}
            scrollWheelZoom={true}
            className="leaflet-result-map"
            center={CENTER}
            zoom={2}
        >
            {getTileLayer()}
            <div>
                {points.map((point,index) => (
                    <MapIcon key={index} pos={point} clickable={true} />
                ))}
            </div>
            <div>
                {bounds.map((bound,index) => (
                        <Rectangle
                            key={index}
                            bounds={[[bound.start.lat,bound.start.lng],[bound.end.lat,bound.end.lng]]}
                            color="yellow"
                            weight={1}
                            opacity={1}
                        />
                    ))
                }
            </div>
            <FitBounds
            markers={[{start:{lat:-85,lng:-180},end:{lat:85,lng:180}}]}
            />
        </MapContainer>
        </div>
    );
    };

    export default MapPreview;

const FitBounds = ({ markers }: { markers: Bounds[] }) => {
    const map = useMap();

    let topLeftLat = 90;
    let topLeftLng = 180;
    let bottomRightLat = -90;
    let bottomRightLng = -180;

    for (let i = 0; i < markers.length; i++) {
        topLeftLat = Math.min(
            topLeftLat,
            markers[i].start.lat
        );
        topLeftLng = Math.min(
            topLeftLng,
            markers[i].start.lng
        );
        bottomRightLat = Math.max(
            bottomRightLat,
            markers[i].end.lat
        );
        bottomRightLng = Math.max(
            bottomRightLng,
            markers[i].end.lng
        );
    }

    useEffect(() => {
        if (map && markers.length > 0) {
        const bounds: L.LatLngBoundsExpression = [
            [topLeftLat, topLeftLng],
            [bottomRightLat, bottomRightLng],
        ];
        map.fitBounds(bounds, {
            paddingTopLeft: [10, 50],
            paddingBottomRight: [10, 20],
        });
        }
    }, [map, markers]);

    return null;
    };