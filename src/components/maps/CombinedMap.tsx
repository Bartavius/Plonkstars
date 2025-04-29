import BasicMapWithMarker from "./BasicMapWithMarker";
import StreetView from "./Streetview";
import "./Streetview.css"

export default function CombinedMap({
  lat,
  lng,
  canChange = true,
  setLat,
  setLng,
  correctLat,
  correctLng,
  reload,
  NMPZ,
  mapBounds,
}: {
  lat?: number;
  lng?: number;
  canChange?: boolean;
  setLat: (n: number) => void;
  setLng: (n: number) => void;
  correctLat: number;
  correctLng: number;
  reload: number;
  NMPZ: boolean;
  mapBounds:any;
}) {
  return (
    <div className="relative">
      <div className={`${NMPZ ? "NMPZ" : ""} street-view-container`} key={reload}>
        <StreetView lat={correctLat} lng={correctLng}/>
      </div>
      <div style={{ position: "absolute", bottom: "1.5%", right: "0.8%" }}>
        <BasicMapWithMarker lat={lat} lng={lng} setLat={setLat} setLng={setLng} mapBounds={mapBounds} canChange={canChange}/>
      </div>
    </div>
  );
}


