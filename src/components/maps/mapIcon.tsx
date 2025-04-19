import L from "leaflet";
import { useEffect, useState } from "react";
import { Marker } from "react-leaflet";

interface Location {
  lat: number;
  lng: number;
}

const iconCache: { [key: string]: L.Icon } = {};

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
  customAvatar?: { hue?: number; saturation?: number; brightness?: number };
}) {
  const [icon, setIcon] = useState<L.Icon | null>(null);

  useEffect(() => {
    const cacheKey = JSON.stringify({ iconUrl, iconSize, iconPercent });
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

      const newIcon = L.icon({
        iconUrl: iconUrl,
        iconSize: calculatedSize,
        iconAnchor: [calculatedSize[0] / 2, calculatedSize[1]],
      });
      iconCache[cacheKey] = newIcon;
      iconCache[iconUrl] = newIcon;
      setIcon(newIcon);
    };
  }, [iconUrl, iconSize, iconPercent]);

  const createColorIcon = (
    hue?: number,
    saturation?: number,
    brightness?: number
  ) => {
    return L.divIcon({
      className: "transparent-icon",
      html: `<img src="/PlonkStarsAvatar.svg" style="filter: hue-rotate(${
        hue ?? 0
      }deg) saturate(${saturation ?? 150}%) brightness(${
        brightness ?? 100
      }%) ;" alt="" />`,
      iconSize: [32 * (iconPercent ?? 1), 32 * (iconPercent ?? 1)],
      iconAnchor: [17 * (iconPercent ?? 1), 45 * (iconPercent ?? 1)],
    });
  };

  if (!icon) return null;
  if (
    customAvatar?.hue &&
    customAvatar?.saturation &&
    customAvatar?.brightness
  ) {
    const { hue, saturation, brightness } = customAvatar;
    return (
      <Marker
        position={pos}
        icon={createColorIcon(hue, saturation, brightness)}
      />
    );
  }
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

