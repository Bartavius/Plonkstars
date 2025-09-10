import FitBounds from "@/components/maps/FitBounds";
import MapIcon from "@/components/maps/mapIcon";
import MapTileLayer from "@/utils/leaflet";
import { MapContainer, useMapEvents } from "react-leaflet";
import { useSelector } from "react-redux";
import "./map.css";

export default function TeamGuessingMap({
    guesses,
    plonks,
    users,
    mapBounds,
    onClick,
}:{
    guesses: { [key: string]: any },
    plonks: {[key: string]: any},
    users: {[key: string]: any},
    mapBounds: any,
    onClick: (lat:number, lng:number) => void,
}) {
    const res = useSelector((state: any) => state.settings.miniMapResolution);

    const ClickHandler = () => {
        useMapEvents({
          click(e) {
            onClick(e.latlng.lat, e.latlng.lng);
          },
        });
        return null;
      }

    return (
        <MapContainer
            zoomDelta={2}
            wheelPxPerZoomLevel={2}
            zoomControl={false}
            className="leaflet-map"
        >
            <ClickHandler/>
            <MapTileLayer size={res} offset={8-Math.log2(res)}/>
            <FitBounds locations={[mapBounds.start,mapBounds.end]} summary={false}/>
            <div>
                {Object.keys(plonks).map((key) => {
                    const plonk = plonks[key];
                    const user = users[key];
                    if (!plonk || !user || !plonk.lat || !plonk.lng) return null;
                    return (
                        <MapIcon
                            key={key}
                            pos={plonk}
                            customize={user.user_cosmetics}
                            iconUrl={"/PlonkStarsAvatar.png"}
                            iconPercent={0.55}
                        />
                    );
                })}
            </div>
            <div>
                {Object.keys(guesses).map((key) => {
                    const guess = guesses[key];
                    const user = users[key];
                    if (!guess || !user || !guess.lat || !guess.lng) return null;
                    return (
                        <MapIcon
                            key={key}
                            pos={guess}
                            iconUrl="/PlonkStarsMarker.png"
                            iconPercent={0.55}
                        />
                    );
                })}
            </div>
        </MapContainer>
    )
}
    