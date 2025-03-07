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

interface guessPair {
  user: { lat: number | null; lng: number | null };
  correct: { lat: number; lng: number };
}

const BasicMapResult = ({ markers }: { markers: guessPair[] }) => {

  const boundedMarkers = markers.map((marker: guessPair) => {
    let newLng = marker.user.lng;
    if (marker.user.lng !== null) {
      if (marker.user.lng - marker.correct.lng > 180) {
        newLng = marker.user.lng - 360;
      } else if (marker.user.lng - marker.correct.lng < -180) {
        newLng = marker.user.lng += 360;
      }
    }
    return {...marker, user: { lat: marker.user.lat, lng: newLng }}
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
    <div className="leaflet-container-result-wrapper">
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

        {boundedMarkers.map((marker: guessPair, index: number) => (
          <div key={index}>
            {marker.user.lat && marker.user.lng && (
              <Marker
                key={index}
                position={{
                  lat: marker.user.lat ?? 0,
                  lng: marker.user.lng ?? 0,
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

            {marker.user &&
              marker.user.lat !== null &&
              marker.user.lng !== null && (
                <div>
                  <Polyline
                    positions={[
                      [marker.user.lat, marker.user.lng],
                      [marker.correct.lat, marker.correct.lng],
                    ]}
                    pathOptions={dottedLine}
                  />
                  <FitBounds
                    userLat={marker.user.lat ?? 0}
                    userLng={marker.user.lng ?? 0}
                    correctLat={marker.correct.lat}
                    correctLng={marker.correct.lng}
                  />
                </div>
              )}
          </div>
        ))}
      </MapContainer>
    </div>
  );
};

export default BasicMapResult;

// sets the bound to include both markers
const FitBounds = ({
  userLat,
  userLng,
  correctLat,
  correctLng,
}: {
  userLat: number;
  userLng: number;
  correctLat: number;
  correctLng: number;
}) => {
  const map = useMap();
  useEffect(() => {
    if (map && userLat && userLng && correctLat && correctLng) {
      const bounds: L.LatLngBoundsExpression = [
        [userLat, userLng],
        [correctLat, correctLng],
      ];
      map.fitBounds(bounds, {
        paddingTopLeft: [10, 50],
        paddingBottomRight: [10, 20],
      });
    }
  }, [map, userLat, userLng, correctLat, correctLng]);

  return null;
};
