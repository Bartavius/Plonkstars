import React from "react";
import { Cosmetic } from "../cosmetic";

const SurprisedFace: React.FC<Cosmetic> = (props) => {
  return (
    <svg
      viewBox="0 0 10 10"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Wide Eyes */}
      <rect x="2" y="3" width="2" height="2" fill="black" />
      <rect x="6" y="3" width="2" height="2" fill="black" />
      
      {/* Surprised Mouth */}
      <rect x="4" y="7" width="2" height="2" fill="black" />
    </svg>
  );
};

export default SurprisedFace;