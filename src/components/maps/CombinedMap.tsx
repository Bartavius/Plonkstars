import BasicMapWithMarker from "./BasicMapWithMarker";
import StreetView from "./Streetview";

export default function CombinedMap({
  setLat,
  setLng,
  lat,
  lng
}: {
  setLat: (n: number) => void;
  setLng: (n: number) => void;
  lat: number;
  lng: number;
}) {
  return (
    <div className="map-over-street-view relative">
      <StreetView lat={lat} lng={lng}/> 
      <div style={{ position: "absolute", bottom: "1.5%", right: "0.8%" }}>
        <BasicMapWithMarker setLat={setLat} setLng={setLng} />
      </div>
    </div>
  );
}


