import L from "leaflet";
import { useEffect, useState } from "react";
import { Marker } from "react-leaflet";
import ReactDOMServer from "react-dom/server";
import UserIcon from "@/components/user/UserIcon";
import { UserIconCosmetics } from "@/types/userIconCosmetics";

import "./mapIcon.css";

interface Location {
  lat: number;
  lng: number;
}

const iconCache: { [key: string]: L.Icon | L.DivIcon } = {};

export default function MapIcon({
  pos,
  clickable = false,
  onClick,
  iconUrl,
  iconSize,
  iconPercent,
  customize,
  children,
}: {
  pos: Location;
  clickable?: boolean;
  onClick?: () => void;
  iconUrl: string;
  iconSize?: [number, number];
  iconPercent?: number;
  customize?: UserIconCosmetics;
  children?: React.ReactNode;
}) {
  const [icon, setIcon] = useState<L.Icon | L.DivIcon | null>(null);

  useEffect(() => {
    const cacheKey = JSON.stringify({
      iconUrl,
      size: iconSize?.join("x") ?? iconPercent ?? "default",
      hue: customize?.hue ?? 0,
      sat: customize?.saturation ?? 100,
      bright: customize?.brightness ?? 100,
      face: customize?.face ?? null,
      body: customize?.body ?? null,
      hat: customize?.hat ?? null,
    });

    // Check if icon is cached
    if (iconCache[cacheKey]) {
      setIcon(iconCache[cacheKey]);
      return;
    }

    const loadIcon = () => {
      const img = new Image();
      img.src = iconUrl;

      img.onload = () => {
        const calculatedSize: [number, number] = iconSize
          ? iconSize
          : iconPercent
          ? [img.width * iconPercent, img.height * iconPercent]
          : [img.width, img.height];

        let newIcon;

        if (!customize) {
          // If no customization, use the default image icon
          newIcon = L.icon({
            className: clickable ? "clickable-icon" : "non-clickable-icon",
            iconUrl: iconUrl,
            iconSize: calculatedSize,
            iconAnchor: [calculatedSize[0] / 2, calculatedSize[1]],
          });
        } else {
          // Create a divIcon with the UserIcon for customization
          const htmlString = ReactDOMServer.renderToString(<UserIcon data={customize} />);
          newIcon = L.divIcon({
            className: `${clickable ? "clickable-icon" : "non-clickable-icon"}`,
            html: htmlString,
            iconSize: calculatedSize,
            iconAnchor: [calculatedSize[0] / 2, calculatedSize[1]],
          });
        }

        iconCache[cacheKey] = newIcon;
        setIcon(newIcon); // Set the new icon
      };
    };

    loadIcon(); // Trigger the image load

  }, [iconUrl, iconSize, iconPercent, customize, clickable]);

  if (!icon) return null; // Don't render if icon is not yet loaded

  return (
    <Marker
      icon={icon}
      position={pos}
      eventHandlers={
        clickable
          ? {
              click: onClick
                ? onClick
                : () => {
                    window.open(
                      `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${pos.lat},${pos.lng}`,
                      "_blank"
                    );
                  },
            }
          : {}
      }
    >
      {children}
    </Marker>
  );
}
