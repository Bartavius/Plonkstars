import L from "leaflet";
import { cache, useEffect, useState } from "react";
import { Marker } from "react-leaflet";

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
  customAvatar,
}: {
  pos: Location;
  clickable?: boolean;
  onClick?: () => void;
  iconUrl: string;
  iconSize?: [number, number];
  iconPercent?: number;
  customAvatar?: { hue: number; saturation: number; brightness: number };
}) {
  const [icon, setIcon] = useState<L.Icon | L.DivIcon | null>(null);
  useEffect(() => {
    const cacheKey = JSON.stringify({
      iconUrl,
      size: iconSize?.join("x") ?? iconPercent ?? "default",
      hue: customAvatar?.hue ?? 0,
      sat: customAvatar?.saturation ?? 100,
      bright: customAvatar?.brightness ?? 100,
    });
    if (iconCache[cacheKey]) {
      setIcon(iconCache[cacheKey]);
      return;
    }
    console.log(cacheKey);

    const img = new Image();
    img.src = iconUrl;

    img.onload = () => {
      const calculatedSize: [number, number] = iconSize
        ? iconSize
        : iconPercent
        ? [img.width * iconPercent, img.height * iconPercent]
        : [img.width, img.height];

      if(!customAvatar){
        const newIcon = L.icon({
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
          customAvatar.hue,
          customAvatar.saturation,
          customAvatar.brightness,
        );
        iconCache[cacheKey] = newIcon;
        iconCache[iconUrl] = newIcon;
        setIcon(newIcon);
      };
    };
  }, [iconUrl, iconSize, iconPercent, customAvatar]);

  const createColorIcon = (
    calculatedSize: [number, number],
    hue: number,
    saturation: number,
    brightness: number
  ) => {
    return L.divIcon({
      className: "transparent-icon",
      html: `<img src=${iconUrl} style="filter: hue-rotate(${hue}deg) saturate(${saturation}%) brightness(${brightness}%) ;" alt="" />`,
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
      interactive={clickable}
    />
  );
}

