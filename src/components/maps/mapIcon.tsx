import L from "leaflet";
import { useEffect, useState } from "react";
import { Marker } from "react-leaflet";
import UserIcon from "@/components/user/UserIcon";
import ReactDOMServer from "react-dom/server";


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
  recolor,
  children,
}: {
  pos: Location;
  clickable?: boolean;
  onClick?: () => void;
  iconUrl: string;
  iconSize?: [number, number];
  iconPercent?: number;
  recolor?: { hue: number; saturation: number; brightness: number };
  children?: React.ReactNode;
}) {
  const [icon, setIcon] = useState<L.Icon | L.DivIcon | null>(null);
  useEffect(() => {
    const cacheKey = JSON.stringify({
      iconUrl,
      size: iconSize?.join("x") ?? iconPercent ?? "default",
      hue: recolor?.hue ?? 0,
      sat: recolor?.saturation ?? 100,
      bright: recolor?.brightness ?? 100,
    });
    if (iconCache[cacheKey]) {
      setIcon(iconCache[cacheKey]);
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

      if(!recolor){
        const newIcon = L.icon({
          className: clickable ? "clickable-icon":"non-clickable-icon",
          iconUrl: iconUrl,
          iconSize: calculatedSize,
          iconAnchor: [calculatedSize[0] / 2, calculatedSize[1]],
        });
        iconCache[cacheKey] = newIcon;
        iconCache[iconUrl] = newIcon;
        setIcon(newIcon);
      }else{
        const newIcon = createColorIcon(
          calculatedSize,
          recolor
        );
        iconCache[cacheKey] = newIcon;
        iconCache[iconUrl] = newIcon;
        setIcon(newIcon);
      };
    };
  }, [iconUrl, iconSize, iconPercent, recolor]);

  const createColorIcon = (
    calculatedSize: [number, number],
    data:any
  ) => {
    const htmlString = ReactDOMServer.renderToString(<UserIcon data={data} />);
    return L.divIcon({
      className: clickable ? "clickable-icon":"non-clickable-icon",
      html: htmlString,
      iconSize: calculatedSize,
      iconAnchor: [calculatedSize[0] / 2, calculatedSize[1]],
    });
  };

  if (!icon) return null;
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