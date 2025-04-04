import L from "leaflet";
import { useState } from "react";
import { Marker } from "react-leaflet";

interface Location {
    lat:number,
    lng:number
}
export default function MapIcon({
    pos,
    clickable,
    onClick,
    iconUrl,
    iconSize,
    iconPercent
  }: {
    pos: Location,
    clickable?: boolean,
    onClick?: () => void;
    iconUrl: string;
    iconSize?: [number, number];
    iconPercent?: number;
  }) {
    const [newIconSize, setNewIconSize] = useState<[number,number]>([0,0]);
    
    if(!iconSize){
        const img = new Image();
        img.src = iconUrl;
        img.onload = () => {
            setNewIconSize(iconSize? iconSize: (iconPercent? [img.width * iconPercent, img.height * iconPercent]: [img.width, img.height]));
        };
    }
    else{
        setNewIconSize(iconSize);
    }

    const correctIcon = L.icon({
        iconUrl: iconUrl,
        iconSize: newIconSize,
        iconAnchor: [newIconSize[0] / 2, newIconSize[1]]
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
            interactive={clickable}
        />
    );
}
    