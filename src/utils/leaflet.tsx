import maps from "./maps";
import { TileLayer } from "react-leaflet";
import { useSelector } from "react-redux";
import "leaflet/dist/leaflet.css";

export default function getTileLayer(size?: number, offset?: number){
    const mapNumber = useSelector((state: any) => state.settings.mapNumber);
    const url = maps[mapNumber].url;
    const attribution =  maps[mapNumber].attribution;
    return (
        <TileLayer 
            url={url} 
            attribution={attribution} 
            tileSize={size ?? 256}
            zoomOffset={offset ?? 0}
            detectRetina={true}
            className="leaflet-control-attribution"
        />
    );
}