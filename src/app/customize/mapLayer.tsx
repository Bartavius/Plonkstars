import { setMapType } from "@/redux/settingsSlice";
import maps from "@/utils/maps";
import { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet"
import { useDispatch, useSelector } from "react-redux";

export default function MapDisplay({setMessage}:{setMessage: (message: React.ReactNode) => void}) {
    const mapNumber = useSelector((state: any) => state.settings.mapNumber);
    const [currentMap, setCurrentMap] = useState<number>(mapNumber);
    const dispatch = useDispatch();

    function saveChanges() {
        dispatch(setMapType({ mapNumber: currentMap }));
        setMessage("Changes saved!");
    };
      
    return (
    <div className="settings-box">
        <div className="settings-label">Map Type</div>
        <div className="settings-dropdown">
        <select
            className="settings-dropdown-select"
            defaultValue={currentMap}
            onChange={(e) =>
                setCurrentMap(parseInt((e.target as HTMLSelectElement).value))
            }
        >
            {maps.map((mapValue: any, index: number) => (
            <option key={index} value={index}>
                {mapValue.name}
            </option>
            ))}
        </select>
        <MapContainer center={[0, 0]} zoom={0} className="leaflet-map">
            <TileLayer
            url={maps[currentMap].url}
            attribution={maps[currentMap].attribution}
            tileSize={512}
            zoomOffset={-1}
            detectRetina={true}
            className="leaflet-control-attribution"
            />
        </MapContainer>
        </div>
        <button className="form-button-selected mt-2" onClick={saveChanges}>
            Save Changes
        </button>
    </div>
    );
}
