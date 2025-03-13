import L from "leaflet";
import { Marker } from "react-leaflet";

interface Location {
    lat:number,
    lng:number
}
export default function MapIcon({
    pos,
    clickable,
    onClick
  }: {
    pos: Location,
    clickable?: boolean,
    onClick?: () => void;
  }) {
    const correctIcon = L.icon({
        iconUrl: "/PlonkStarsMarker.png",
        iconSize: [25, 40],
        iconAnchor: [12.5, 40],
    });
    clickable = clickable || false;

    return (
        <Marker 
            icon={correctIcon} 
            position={pos} 
            eventHandlers={
                clickable ? {click: onClick?
                    onClick: 
                    (() => {
                        window.open(
                            `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${pos.lat},${pos.lng}`,
                            "_blank"
                        );
                    })} 
                    : {}
            }
        />
    );
}
    