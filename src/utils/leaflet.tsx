import { TileLayer } from "react-leaflet";
import { useSelector } from "react-redux";
import "leaflet/dist/leaflet.css";

const API_KEY = process.env.NEXT_PUBLIC_MAP_API;

export default function getTileLayer(){
    const mapNumber = useSelector((state: any) => state.settings.mapNumber);
    const maps = [
        {
            url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CartoDB</a>'
        },
        {
            url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            attribution: "<a href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\">&copy; OpenStreetMap contributors</a>"
        },
        {
            url: `https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=${API_KEY}`,
            attribution: "<a href=\"https://www.maptiler.com/copyright/\" target=\"_blank\">&copy; MapTiler</a> <a href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\">&copy; OpenStreetMap contributors</a>"
        }
    ]
    const url = maps[mapNumber].url;
    const attribution =  maps[mapNumber].attribution;
    return (
        <TileLayer 
            url={url} 
            attribution={attribution} 
            tileSize={512}
            zoomOffset={-1}
            detectRetina={true}
            className="leaflet-control-attribution"
        />
    );
}