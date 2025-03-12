"use client";

import { useEffect } from "react";
import {
    MapContainer,
    Marker,
    TileLayer,
    Rectangle,
    useMap,
} from "react-leaflet";
import L, { map, marker } from "leaflet";
import "leaflet/dist/leaflet.css";
import osm from "../../utils/leaflet";
import "./map.css";

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

    const pin = L.icon({
        iconUrl: "/PlonkStarsMarker.png",
        iconSize: [25, 40],
        iconAnchor: [12.5, 40],
    });

    return (
        <div
            className="leaflet-container-result-wrapper"
            style={height ? { height: `${height}dvh` } : undefined}
        >
        <MapContainer
            maxBounds={[           
                [-85, -180],
                [85, 180]
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
            <TileLayer
                url={osm.map.url}
                attribution={osm.map.attribution}
            />
            {points.map((point,index) => (
                <Marker
                    key={index}
                    position={point}
                    icon={pin}
                    eventHandlers={{
                        click: () => {
                            window.open(
                                `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${point.lat},${point.lng}`,
                                "_blank"
                            );
                        },
                    }}
                />
            ))}
            {bounds.map((bound,index) => (
                    <Rectangle
                        key={index}
                        bounds={[[bound.start.lat,bound.start.lng],[bound.end.lat,bound.end.lng]]}
                        color="yellow"
                        weight={1}
                        opacity={1}
                        // dashArray="5, 15"
                    />
                ))
            }
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