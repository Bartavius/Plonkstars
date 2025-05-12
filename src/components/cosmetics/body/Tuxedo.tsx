import React from "react";

const PixelTuxedo = () => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 20 20"
      shapeRendering="crispEdges"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Blazer */}
      <rect x="1" y="3" width="18" height="10" fill="black" />
      <rect x="5" y="13" width="10" height="7" fill="black" />

      {/* Shirt */}
      <rect x="8" y="3" width="4" height="11" fill="white" />

      {/* Bow tie */}
      <rect x="7" y="4" width="2" height="2" fill="black" />
      <rect x="11" y="4" width="2" height="2" fill="black" />
      <rect x="9" y="5" width="2" height="1" fill="black" />

      {/* Buttons */}
      <rect x="9" y="7" width="2" height="1" fill="black" />
      <rect x="9" y="9" width="2" height="1" fill="black" />
      <rect x="9" y="11" width="2" height="1" fill="black" />
    </svg>
  );
};

export default PixelTuxedo;
