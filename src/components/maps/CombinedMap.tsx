import { useState } from "react";
import StreetView from "./Streetview";
import "./Streetview.css"
import "./map.css"

export default function CombinedMap({
  correctLat,
  correctLng,
  reload,
  NMPZ,
  map,
}: {
  correctLat: number;
  correctLng: number;
  reload: number;
  NMPZ: boolean;
  map: React.ReactNode;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnterMap = () => {
    setIsHovered(true);
  };

  const handleMouseLeaveMap = () => {
    setTimeout(() => {
      setIsHovered(false);
    }, 1000);
  };

  
  return (
    <div className="relative">
      <div className={`${NMPZ ? "NMPZ" : ""} street-view-container`} key={reload}>
        <StreetView lat={correctLat} lng={correctLng}/>
      </div>
      <div style={{ position: "absolute", bottom: "1.5%", right: "0.8%" }}>
        <div
          className={`game-map-wrapper ${isHovered ? "hovered" : ""}`}
          onMouseEnter={handleMouseEnterMap}
          onMouseLeave={handleMouseLeaveMap}
        >
          {map}
        </div>
      </div>
    </div>
  );
}


