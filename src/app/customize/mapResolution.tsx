import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMiniMapResolution } from "@/redux/settingsSlice";
import { MapContainer, TileLayer } from "react-leaflet";
import maps from "@/utils/maps";
import "./page.css";

export default function MapResolution({setMessage}:{setMessage: (message: React.ReactNode) => void}) {
    const res = useSelector((state: any) => state.settings.miniMapResolution);
    const mapNumber = useSelector((state: any) => state.settings.mapNumber);

    const [resolution,setResolution] = useState<number>(Math.log2(res)-8);
    const dispatch = useDispatch();
    function saveResolution() {
        dispatch(setMiniMapResolution({ miniMapResolution:  2 ** resolution * 256 }));
        setMessage("Changes saved!");
    }

    return (
        <div className="settings-box">
            <div className="settings-label">Minimap Resolution</div>
            <label className="block mb-2 text-white" htmlFor="resolution-range">
                  Zoom: {resolution}
            </label>
            <input
                className="focus:outline-none input-field cursor-pointer"
                style={{ padding: "0px" }}
                type="range"
                id="resolution-range"
                min={-2}
                max={1}
                step="1"
                value={resolution}
                onChange={(e) => setResolution(Number(e.target.value))}
            />
            <div className="map-resolution-buffer">
                <MapContainer center={[0, 0]} zoom={0} className="resolution-map-container">
                    <TileLayer
                        key={`tile-${resolution}`}
                        url={maps[mapNumber].url}
                        attribution={maps[mapNumber].attribution}
                        tileSize={2 ** resolution * 256}
                        zoomOffset={-resolution}
                        detectRetina={true}
                        className="w-full h-full"
                    />
                </MapContainer>
            </div>
            <div className="resolution-map-buffer"/>
            <button className="form-button-selected mt-2" onClick={saveResolution}>
                Save Changes
            </button>
        </div>
    )
}
