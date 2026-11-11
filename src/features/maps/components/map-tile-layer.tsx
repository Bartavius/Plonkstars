import "leaflet/dist/leaflet.css";
import { TileLayer } from "react-leaflet";

import { tileLayers } from "@/features/maps/lib/tile-layers";
import { useAppSelector } from "@/store/use-app-selector";
interface MapTileLayerProps {
  size?: number;
  offset?: number;
}

function MapTileLayer({ size = 256, offset = 0 }: MapTileLayerProps) {
  const mapNumber = useAppSelector((state) => state.settings.mapNumber);
  const url = tileLayers[mapNumber].url;
  const attribution = tileLayers[mapNumber].attribution;
  return (
    <TileLayer
      url={url}
      attribution={attribution}
      tileSize={size}
      zoomOffset={offset}
      detectRetina={true}
      className="leaflet-control-attribution"
    />
  );
}

export { MapTileLayer };
