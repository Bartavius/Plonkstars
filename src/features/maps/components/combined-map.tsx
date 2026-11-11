import { useState } from "react";

import { StreetView } from "./streetview";
import "./streetview.css";
import "./map.css";
interface CombinedMapProps {
  correctLat: number;
  correctLng: number;
  reload: number;
  NMPZ: boolean;
  map: React.ReactNode;
}

function CombinedMap({ correctLat, correctLng, reload, NMPZ, map }: CombinedMapProps) {
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
        <StreetView lat={correctLat} lng={correctLng} />
      </div>
      {map && (
        <div style={{ position: "absolute", bottom: "1.5%", right: "0.8%" }}>
          <div
            className={`game-map-wrapper ${isHovered ? "hovered" : ""}`}
            onMouseEnter={handleMouseEnterMap}
            onMouseLeave={handleMouseLeaveMap}
          >
            {map}
          </div>
        </div>
      )}
    </div>
  );
}

export { CombinedMap };
