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
    console.log(marker);
    const newUsers = marker.users.map((user: { lat: number | null; lng: number | null }) => {
      let newLng = user.lng;
      if (user.lng !== null) {
        if (user.lng - marker.correct.lng > 180) {
          newLng = user.lng - 360;
        } else if (user.lng - marker.correct.lng < -180) {
          newLng = user.lng + 360;
        }
      }
      return { lat: user.lat, lng: newLng };
    })
    return {...marker,users:newUsers};
  });

  console.log(boundedMarkers);

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
          url={osm.map.url}
          attribution={osm.map.attribution}
        />
        {boundedMarkers.map((markerObj, index) => (
          <div key={index}>
            {markerObj && 
              <Marker
                position={markerObj.correct}
                icon={correctIcon}
                eventHandlers={{
                  click: () => {
                    window.open(
                      `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${markerObj.correct.lat},${markerObj.correct.lng}`,
                      "_blank"
                    );
                  },
                }}
              />
            }
            {markerObj.users.map((user, userIndex) => (
              <div key={userIndex}>
                {user && user.lat && user.lng && (
                  <>
                    <Marker
                      key={index}
                      position={{
                        lat: user.lat,
                        lng: user.lng,
                      }}
                      icon={userIcon}
                    />
                    <div>
                      <Polyline
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
    for (let j = 0; j < markers[i].users.length; j++) {
      
      topLeftLat = Math.min(
        topLeftLat,
        markers[i].users[j].lat ?? 90
      );
      topLeftLng = Math.min(
        topLeftLng,
        markers[i].users[j].lng ?? 180
      );
      bottomRightLat = Math.max(
        bottomRightLat,
        markers[i].users[j].lat ?? -90
      );
      bottomRightLng = Math.max(
        bottomRightLng,
        markers[i].users[j].lng ?? -180
      );
    }
    topLeftLat = Math.min(
      topLeftLat,
      markers[i].correct.lat
    );
    topLeftLng = Math.min(
      topLeftLng,
      markers[i].correct.lng
    );
    bottomRightLat = Math.max(
      bottomRightLat,
      markers[i].correct.lat
    );
    bottomRightLng = Math.max(
      bottomRightLng,
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