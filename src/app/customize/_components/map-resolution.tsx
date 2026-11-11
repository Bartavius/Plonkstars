import { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { useDispatch } from "react-redux";

import "@/app/customize/page.css";
import { tileLayers } from "@/features/maps/lib/tile-layers";
import { setMiniMapResolution } from "@/store/settings-slice";
import { useAppSelector } from "@/store/use-app-selector";
interface MapResolutionProps {
  setMessage: (message: React.ReactNode) => void;
}

function MapResolution({ setMessage }: MapResolutionProps) {
  const res = useAppSelector((state) => state.settings.miniMapResolution);
  const mapNumber = useAppSelector((state) => state.settings.mapNumber);

  const [resolution, setResolution] = useState<number>(Math.log2(res) - 8);
  const dispatch = useDispatch();
  function saveResolution() {
    dispatch(setMiniMapResolution({ miniMapResolution: 2 ** resolution * 256 }));
    setMessage("Changes saved!");
  }

  return (
    <div className="m-4 w-4/5 p-4 rounded-2xl flex flex-col items-center justify-center bg-dark-blue border-white border-2">
      <div className="text-[1.5rem] font-bold mb-[5px]">Minimap Resolution</div>
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
            url={tileLayers[mapNumber].url}
            attribution={tileLayers[mapNumber].attribution}
            tileSize={2 ** resolution * 256}
            zoomOffset={-resolution}
            detectRetina={true}
            className="w-full h-full"
          />
        </MapContainer>
      </div>
      <div className="w-full h-[35vh]" />
      <button className="form-button-selected mt-2" onClick={saveResolution}>
        Save Changes
      </button>
    </div>
  );
}

export { MapResolution };
