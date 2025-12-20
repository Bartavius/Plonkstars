"use client";

import { MapContainer, Polyline, Tooltip } from "react-leaflet";
import "./map.css";
import MapIcon from "./mapIcon";
import MapTileLayer from "@/utils/leaflet";
import FitBounds from "./FitBounds";

export default function BasicMapResult({
  markers,
  height,
  user,
}: {
  markers: any;
  height?: number;
  user?:any;
}){
  const boundedMarkers = markers.map((marker:any) => {
    const newUsers = marker.users.map(
      (user:any) => {
        if (user.lat === undefined || user.lng === undefined) {
          return;
        }

        let newLng = user.lng;
        if (user.lng - marker.correct.lng > 180) {
          newLng = user.lng - 360;
        } else if (user.lng - marker.correct.lng < -180) {
          newLng = user.lng + 360;
        }
        return {...user, lat: user.lat, lng: newLng };
      }
    ).filter((user:any) => user !== undefined) as { lat: number; lng: number }[];
    return { ...marker, users: newUsers };
  });

  const locations = boundedMarkers.map((marker:any) => [marker.correct, ...marker.users.filter((guess:any)=> (guess.user.username === user))]).flat();
  
  return (
    <div
      className="leaflet-container-result-wrapper"
      style={height ? { height: `${height}dvh` } : undefined}
    >
      <MapContainer
        zoomDelta={2}
        wheelPxPerZoomLevel={2}
        zoomControl={false}
        className="leaflet-result-map"
      >
        <MapTileLayer size={512} offset={-1}/>
        {boundedMarkers.map((markerObj:any, index:number) => (
          <div key={index}>
            {markerObj && (
              <MapIcon
                pos={markerObj.correct}
                clickable={true}
                iconUrl="/PlonkStarsMarker.png"
                iconPercent={1}
              />
            )}
            {markerObj.users.map((user:any, userIndex:number) => (
              <div key={userIndex}>
                {user && user.lat && user.lng && (
                  <>
                    <MapIcon
                      pos={{ lat: user.lat, lng: user.lng }}
                      customize={user.user.user_cosmetics}
                      iconUrl="/PlonkStarsAvatar.png
                      "
                      iconPercent={1.25}
                    >
                      <Tooltip direction="top" offset={[0, -30]}>
                        {user.user.username}
                      </Tooltip>
                    </MapIcon>
                    <div>
                      <Polyline
                        interactive={false}
                        positions={[
                          [user.lat, user.lng],
                          [markerObj.correct.lat, markerObj.correct.lng],
                        ]}
                        pathOptions={{
                          color:"black",
                          weight: 7,
                          opacity: 1,
                          dashArray: "5, 15"
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
        <FitBounds locations={locations} options={{paddingTopLeft: [10, 50],paddingBottomRight: [10, 20]}} summary={true}/>
      </MapContainer>
    </div>
  );
};