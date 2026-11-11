import { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { useDispatch } from "react-redux";

import { tileLayers } from "@/features/maps/lib/tile-layers";
import { setMapType } from "@/store/settings-slice";
import { useAppSelector } from "@/store/use-app-selector";
interface MapDisplayProps {
  setMessage: (message: React.ReactNode) => void;
}

function MapDisplay({ setMessage }: MapDisplayProps) {
  const mapNumber = useAppSelector((state) => state.settings.mapNumber);
  const [currentMap, setCurrentMap] = useState<number>(mapNumber);
  const dispatch = useDispatch();

  function saveChanges() {
    dispatch(setMapType({ mapNumber: currentMap }));
    setMessage("Changes saved!");
  }

  return (
    <div className="m-4 w-4/5 p-4 rounded-2xl flex flex-col items-center justify-center bg-dark-blue border-white border-2">
      <div className="text-[1.5rem] font-bold mb-[5px]">Map Type</div>
      <div className="w-full text-darkest-blue flex flex-col items-center justify-center">
        <select
          id="map-layer-selector"
          className="settings-dropdown-select"
          defaultValue={currentMap}
          onChange={(e) => setCurrentMap(parseInt((e.target as HTMLSelectElement).value))}
        >
          {tileLayers.map((mapValue, index) => (
            <option key={index} value={index}>
              {mapValue.name}
            </option>
          ))}
        </select>
        <MapContainer center={[0, 0]} zoom={0} className="customize-leaflet-map">
          <TileLayer
            url={tileLayers[currentMap].url}
            attribution={tileLayers[currentMap].attribution}
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

export { MapDisplay };
