import BasicMapWithMarker from "./BasicMapWithMarker";
import StreetView from "./Streetview";
import "./Streetview.css"

export default function CombinedMap({
  setLat,
  setLng,
  lat,
  lng,
  reload,
}: {
  setLat: (n: number) => void;
  setLng: (n: number) => void;
  lat: number;
  lng: number;
  reload: number;
}) {
  return (
    <div className="relative">
      <div className="street-view-container" key={reload}>
        <StreetView lat={lat} lng={lng}/>
      </div>
      <div style={{ position: "absolute", bottom: "1.5%", right: "0.8%" }}>
        <BasicMapWithMarker setLat={setLat} setLng={setLng} />
      </div>
    </div>
  );
}


