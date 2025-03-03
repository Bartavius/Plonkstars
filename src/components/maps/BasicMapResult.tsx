"use client";

import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  Polyline,
  useMap,
} from "react-leaflet";
import L, { setOptions } from "leaflet";
import "leaflet/dist/leaflet.css";
import osm from "../../utils/leaflet";

const BasicMapResult = ({
  userLat,
  userLng,
  correctLat,
  correctLng,
}: {
  userLat: number | null;
  userLng: number | null;
  correctLat: number; // make this not null later
  correctLng: number;
}) => {
  const userMarkerPosition = { lat: userLat, lng: userLng };
  const correctMarkerPosition = { lat: correctLat, lng: correctLng };

  const ZOOM_DELTA = 2;
  const PX_PER_ZOOM_LEVEL = 2;

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
        center={correctMarkerPosition}
        zoom={7}
      >
        <TileLayer
          url={osm.maptiler.url}
          attribution={osm.maptiler.attribution}
        />

        {correctMarkerPosition && (
          <a
            href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${correctMarkerPosition.lat},${correctMarkerPosition.lng}`}
          >
            <Marker position={correctMarkerPosition} icon={correctIcon} />
          </a>
        )}

        {userMarkerPosition.lat && userMarkerPosition.lng && (
          <Marker
            position={{
              lat: userMarkerPosition.lat,
              lng: userMarkerPosition.lng,
            }}
            icon={userIcon}
          />
        )}

        {userMarkerPosition.lat && userMarkerPosition.lng && (
          <div>
            <Polyline
              positions={[
                [userMarkerPosition.lat, userMarkerPosition.lng],
                [correctMarkerPosition.lat, correctMarkerPosition.lng],
              ]}
              pathOptions={dottedLine}
            />
            <FitBounds
              userLat={userLat ?? 0}
              userLng={userLng ?? 0}
              correctLat={correctLat}
              correctLng={correctLng}
            />
          </div>
        )}
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
