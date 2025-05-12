import React from "react";
import { Cosmetic } from "../cosmetic";

const NerdFace: React.FC<Cosmetic> = (props) => {
  
  return (
    <svg
      viewBox="0 0 10 10"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Glasses Frame */}
      <rect x="2" y="3" width="2" height="1" fill="black" />
      <rect x="6" y="3" width="2" height="1" fill="black" />
      <rect x="4" y="3" width="2" height="1" fill="black" />
      
      {/* Glasses Lenses */}
      <rect x="2" y="4" width="2" height="1" fill="#e6e6e6" />
      <rect x="6" y="4" width="2" height="1" fill="#e6e6e6" />
      
      {/* Smile with buck teeth */}
      <rect x="3" y="6" width="1" height="1" fill="black" />
      <rect x="4" y="7" width="1" height="1" fill="black" />
      <rect x="5" y="7" width="1" height="1" fill="black" />
      <rect x="6" y="6" width="1" height="1" fill="black" />
      <rect x="4" y="6" width="1" height="1" fill="black" />
      <rect x="5" y="6" width="1" height="1" fill="black" />
    </svg>
  );
};

export default NerdFace;