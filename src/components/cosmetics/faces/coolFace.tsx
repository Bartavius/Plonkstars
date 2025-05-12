import React from "react";
import { Cosmetic } from "../cosmetic";

const MLGGlasses: React.FC<Cosmetic> = (props) => {
  
  return (
    <svg
      viewBox="0 0 35 35"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
    >
        {/* <-- the glasses --> */}

        <rect x="4" y="11" width="28" height="1" fill="black" />
        <rect x="2" y="12" width="2" height="1" fill="black" />
        <rect x="8" y="12" width="24" height="1" fill="black" />

        {/* left glass */}
        <rect x="9" y="13" width="10" height="1" fill="black" />
        <rect x="10" y="14" width="8" height="1" fill="black" />
        <rect x="11" y="15" width="6" height="1" fill="black" />

        {/* right glass */}
        <rect x="21" y="13" width="10" height="1" fill="black" />
        <rect x="22" y="14" width="8" height="1" fill="black" />
        <rect x="23" y="15" width="6" height="1" fill="black" />
        
        {/* the shines - left */}
        <rect x="10" y="12" width="1" height="1" fill="white" />
        <rect x="12" y="12" width="1" height="1" fill="white" />
        <rect x="11" y="13" width="1" height="1" fill="white" />
        <rect x="13" y="13" width="1" height="1" fill="white" />
        <rect x="12" y="14" width="1" height="1" fill="white" />
        <rect x="14" y="14" width="1" height="1" fill="white" />

        {/* the shines - right */}
        <rect x="22" y="12" width="1" height="1" fill="white" />
        <rect x="24" y="12" width="1" height="1" fill="white" />
        <rect x="23" y="13" width="1" height="1" fill="white" />
        <rect x="25" y="13" width="1" height="1" fill="white" />
        <rect x="24" y="14" width="1" height="1" fill="white" />
        <rect x="26" y="14" width="1" height="1" fill="white" />

        {/* smirk */}
        <rect x="14" y="20" width="1" height="1" fill="black" />
        <rect x="15" y="21" width="1" height="1" fill="black" />
        <rect x="16" y="22" width="7" height="1" fill="black" />
    </svg>
  );
};

export default MLGGlasses;