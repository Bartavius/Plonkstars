import React from "react";
import { Cosmetic } from "../cosmetic";

const WinkingFace: React.FC<Cosmetic> = (props) => {
  const allProps = {...props, name: "Winking Face"};
  
  return (
    <svg
      viewBox="0 0 10 10"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Normal Eye */}
      <rect x="3" y="3" width="1" height="1" fill="black" />
      
      {/* Winking Eye - horizontal line */}
      <rect x="6" y="3" width="2" height="1" fill="black" />
      
      {/* Smirk */}
      <rect x="3" y="6" width="1" height="1" fill="black" />
      <rect x="4" y="7" width="1" height="1" fill="black" />
      <rect x="5" y="7" width="1" height="1" fill="black" />
      <rect x="6" y="6" width="1" height="1" fill="black" />
      <rect x="7" y="5" width="1" height="1" fill="black" />
    </svg>
  );
};

export default WinkingFace;