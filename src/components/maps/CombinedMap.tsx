import BasicMapWithMarker from "./BasicMapWithMarker";
import StreetView from "./Streetview";
import "./Streetview.css"

export default function CombinedMap({
  lat,
  lng,
  canChange = true,
  setPos,
  correctLat,
  correctLng,
  reload,
  NMPZ,
  mapBounds,
}: {
  lat?: number;
  lng?: number;
  canChange?: boolean;
  setPos: (lat: number,lng: number) => void;
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
        <BasicMapWithMarker lat={lat} lng={lng} setPos={setPos} mapBounds={mapBounds} canChange={canChange}/>
      </div>
    </div>
  );
}


