"use client";

import { useEffect } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  Polyline,
  useMap,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import osm from "../../utils/leaflet";
import "./map.css";

interface GuessPair {
  user: { lat: number | null; lng: number | null };
  correct: { lat: number; lng: number };
}

interface GuessPairValid {
  user: { lat: number; lng: number };
  correct: { lat: number; lng: number };
}

const BasicMapResult = ({
  markers,
  height,
}: {
  markers: GuessPair[];
  height?: number;
}) => {
  const boundedMarkers = markers.map((marker: GuessPair) => {
    let newLng = marker.user.lng;
    if (marker.user.lng !== null) {
      if (marker.user.lng - marker.correct.lng > 180) {
        newLng = marker.user.lng - 360;
      } else if (marker.user.lng - marker.correct.lng < -180) {
        newLng = marker.user.lng += 360;
      }
    }
    return { ...marker, user: { lat: marker.user.lat, lng: newLng } };
  });

  const ZOOM_DELTA = 2;
  const PX_PER_ZOOM_LEVEL = 2;
  const CENTER = { lat: 0, lng: 0 };

  const userIcon = L.icon({
    iconUrl: "/PlonkStarsAvatar.png",
    iconSize: [25, 40],
    iconAnchor: [12.5, 40],
  });
  const correctIcon = L.icon({
    iconUrl: "/PlonkStarsMarker.png",
    iconSize: [25, 40],
    iconAnchor: [12.5, 40],
  });

  const dottedLine = {
    color: "black",
    weight: 7,
    opacity: 1,
    dashArray: "5, 15",
  };

  return (
    <div
      className="leaflet-container-result-wrapper"
      style={height ? { height: `${height}dvh` } : undefined}
    >
      <MapContainer
        zoomDelta={ZOOM_DELTA}
        wheelPxPerZoomLevel={PX_PER_ZOOM_LEVEL}
        scrollWheelZoom={true}
        className="leaflet-result-map"
        center={CENTER}
        zoom={7}
      >
        <TileLayer
          url={osm.maptiler.url}
          attribution={osm.maptiler.attribution}
        />

        {boundedMarkers.map((marker: GuessPair, index: number) => (
          <div key={index}>
            {marker.user && marker.user.lat && marker.user.lng && (
              <Marker
                key={index}
                position={{
                  lat: marker.user.lat,
                  lng: marker.user.lng,
                }}
                icon={userIcon}
              />
            )}

            {marker.correct && (
              <Marker
                position={marker.correct}
                icon={correctIcon}
                eventHandlers={{
                  click: () => {
                    window.open(
                      `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${marker.correct.lat},${marker.correct.lng}`,
                      "_blank"
                    );
                  },
                }}
              />
            )}

            {marker.user && marker.user.lat && marker.user.lng && (
              <div>
                <Polyline
                  positions={[
                    [marker.user.lat, marker.user.lng],
                    [marker.correct.lat, marker.correct.lng],
                  ]}
                  pathOptions={dottedLine}
                />
              </div>
            )}
          </div>
        ))}
        <FitBounds
          markers={boundedMarkers}
        />
      </MapContainer>
    </div>
  );
};

export default BasicMapResult;

const FitBounds = ({ markers }: { markers: GuessPair[] }) => {
  const map = useMap();

  let topLeftLat = 90;
  let topLeftLng = 180;
  let bottomRightLat = -90;
  let bottomRightLng = -180;

  for (let i = 0; i < markers.length; i++) {
    topLeftLat = Math.min(
      topLeftLat,
      markers[i].user.lat ?? 90,
      markers[i].correct.lat
    );
    topLeftLng = Math.min(
      topLeftLng,
      markers[i].user.lng ?? 180,
      markers[i].correct.lng
    );
    bottomRightLat = Math.max(
      bottomRightLat,
      markers[i].user.lat ?? -90,
      markers[i].correct.lat
    );
    bottomRightLng = Math.max(
      bottomRightLng,
      markers[i].user.lng ?? -180,
      markers[i].correct.lng
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
