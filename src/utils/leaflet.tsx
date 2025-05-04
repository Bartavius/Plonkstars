import maps from "./maps";
import { TileLayer } from "react-leaflet";
import { useSelector } from "react-redux";
import "leaflet/dist/leaflet.css";

export default function MapTileLayer({
    size = 256,
    offset = 0
}:{
    size?: number,
    offset?: number
}){
    const mapNumber = useSelector((state: any) => state.settings.mapNumber);
    const url = maps[mapNumber].url;
    const attribution =  maps[mapNumber].attribution;
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