import BasicMapWithMarker from "@/components/maps/BasicMapWithMarker";
import MapCreationMap from "@/components/maps/MapCreationMap";
import StreetView from "@/components/maps/Streetview";
import L from "leaflet";

<head>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
      crossOrigin=""/>

  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
      crossOrigin=""></script>
</head>

export default function MapCreate() {

  const creationMap = <div 
    id="map"
    style={{
      width: "600px", 
      height: "400px"}}
    >

    </div>


var map = L.map('map').setView([51.505, -0.09], 13);

  return (
    <div>map</div>
  );
}