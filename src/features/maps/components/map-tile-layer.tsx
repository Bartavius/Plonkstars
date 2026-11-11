import "leaflet/dist/leaflet.css";
import { TileLayer } from "react-leaflet";
import { useSelector } from "react-redux";

import { tileLayers } from "@/features/maps/lib/tile-layers";
interface MapTileLayerProps {
  size?: number;
  offset?: number;
}

function MapTileLayer({ size = 256, offset = 0 }: MapTileLayerProps) {
  const mapNumber = useSelector((state: any) => state.settings.mapNumber);
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
