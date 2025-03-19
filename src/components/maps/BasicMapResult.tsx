"use client";

import { useEffect } from "react";
import { MapContainer, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import MapIcon from "./mapIcon";
import getTileLayer from "@/utils/leaflet";

interface GuessPair {
  users: { lat: number | null; lng: number | null }[];
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
    const newUsers = marker.users.map(
      (user: { lat: number | null; lng: number | null }) => {
        let newLng = user.lng;
        if (user.lng !== null) {
          if (user.lng - marker.correct.lng > 180) {
            newLng = user.lng - 360;
          } else if (user.lng - marker.correct.lng < -180) {
            newLng = user.lng + 360;
          }
        }
        return { lat: user.lat, lng: newLng };
      }
    );
    return { ...marker, users: newUsers };
  });


  const ZOOM_DELTA = 2;
  const PX_PER_ZOOM_LEVEL = 2;
  const CENTER = { lat: 0, lng: 0 };

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
        {getTileLayer(512,-1)}
        {boundedMarkers.map((markerObj, index) => (
          <div key={index}>
            {markerObj && (
              <MapIcon
                pos={markerObj.correct}
                clickable={true}
                iconUrl="/PlonkStarsMarker.png"
              />
            )}
            {markerObj.users.map((user, userIndex) => (
              <div key={userIndex}>
                {user && user.lat && user.lng && (
                  <>
                    <MapIcon
                      pos={{ lat: user.lat, lng: user.lng }}
                      iconUrl="/PlonkStarsAvatar.png"
                    />
                    <div>
                      <Polyline
                        interactive={false}
                        positions={[
                          [user.lat, user.lng],
                          [markerObj.correct.lat, markerObj.correct.lng],
                        ]}
                        pathOptions={dottedLine}
                      />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
        <FitBounds markers={boundedMarkers} />
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
    for (let j = 0; j < markers[i].users.length; j++) {
      topLeftLat = Math.min(topLeftLat, markers[i].users[j].lat ?? 90);
      topLeftLng = Math.min(topLeftLng, markers[i].users[j].lng ?? 180);
      bottomRightLat = Math.max(bottomRightLat, markers[i].users[j].lat ?? -90);
      bottomRightLng = Math.max(
        bottomRightLng,
        markers[i].users[j].lng ?? -180
      );
    }
    topLeftLat = Math.min(topLeftLat, markers[i].correct.lat);
    topLeftLng = Math.min(topLeftLng, markers[i].correct.lng);
    bottomRightLat = Math.max(bottomRightLat, markers[i].correct.lat);
    bottomRightLng = Math.max(bottomRightLng, markers[i].correct.lng);
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
