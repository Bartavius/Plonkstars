import React from "react";
import { Cosmetic } from "../cosmetic";

const Smiley: React.FC<Cosmetic> = (props) => {
  
  return (
    <svg
      viewBox="0 0 10 10"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Eyes */}
      <rect x="3" y="3" width="1" height="1" fill="black" />
      <rect x="6" y="3" width="1" height="1" fill="black" />

      {/* Smile */}
      <rect x="3" y="6" width="1" height="1" fill="black" />
      <rect x="4" y="7" width="1" height="1" fill="black" />
      <rect x="5" y="7" width="1" height="1" fill="black" />
      <rect x="6" y="6" width="1" height="1" fill="black" />
    </svg>
  );
};

export default Smiley;