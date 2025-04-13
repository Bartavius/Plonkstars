import L from "leaflet";
import { useEffect, useState } from "react";
import { Marker } from "react-leaflet";

interface Location {
    lat:number,
    lng:number
}

const iconCache: { [key: string]: L.Icon } = {};

export default function MapIcon({
    pos,
    clickable=false,
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
    const [icon, setIcon] = useState<L.Icon | null>(null);

    useEffect(() => {
        if (iconCache[iconUrl]) {
        setIcon(iconCache[iconUrl]);
        return;
        }

        const img = new Image();
        img.src = iconUrl;

        img.onload = () => {
            const calculatedSize: [number, number] = iconSize
                ? iconSize
                : iconPercent
                ? [img.width * iconPercent, img.height * iconPercent]
                : [img.width, img.height];

            const newIcon = L.icon({
                iconUrl: iconUrl,
                iconSize: calculatedSize,
                iconAnchor: [calculatedSize[0] / 2, calculatedSize[1]]
            });

            iconCache[iconUrl] = newIcon;
            setIcon(newIcon);
        };
    }, [iconUrl, iconSize, iconPercent]);

  if (!icon) return null;
    return (
        <Marker 
            icon={icon} 
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
    