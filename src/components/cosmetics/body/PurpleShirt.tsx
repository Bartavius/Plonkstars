import React from "react";
import { Cosmetic } from "../cosmetic";

const PurpleShirt: React.FC<Cosmetic> = (props) => {
  const shirtColor = "#ad42f5"; // Define the shirt color (purple)
  const darkShirtColor = "#670da3";

  return (
    <svg
      viewBox="0 0 20 15"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Main Shirt Body */}
      <rect x="6" y="0" width="8" height="10" fill={shirtColor} />

      {/* Shoulders/Sleeves */}
      <rect x="4" y="0" width="2" height="4" fill={shirtColor} />
      <rect x="14" y="0" width="2" height="4" fill={shirtColor} />

      {/* Collar */}
      <rect x="8" y="0" width="4" height="1" fill={darkShirtColor} />

      {/* Button details */}
      <rect x="10" y="2" width="1" height="1" fill="#000000" />
      <rect x="10" y="4" width="1" height="1" fill="#000000" />
      <rect x="10" y="6" width="1" height="1" fill="#000000" />

      {/* Bottom hem */}
      <rect x="6" y="10" width="8" height="1" fill={darkShirtColor} />
    </svg>
  );
};

export default PurpleShirt;
