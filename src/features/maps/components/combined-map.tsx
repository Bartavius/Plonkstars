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
      <div
        className={`${NMPZ ? "pointer-events-none" : ""} flex h-[90vh] w-full overflow-hidden relative bg-[white]`}
        key={reload}
      >
        <StreetView lat={correctLat} lng={correctLng} />
      </div>
      {map && (
        <div style={{ position: "absolute", bottom: "1.5%", right: "0.8%" }}>
          <div
            className={`w-[23vw] h-[25vh] overflow-hidden z-[99] transition-all duration-100 ease-[ease-in-out] origin-bottom-right max-[720px]:w-screen max-[720px]:h-[30vh] ${isHovered ? "scale-[2.4] opacity-100 cursor-crosshair max-[720px]:transform-none" : "opacity-60 max-[720px]:opacity-100 hover:scale-[2.4] hover:opacity-100 hover:cursor-crosshair max-[720px]:hover:transform-none"}`}
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
