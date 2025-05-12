import React from "react";
import { Cosmetic } from "../cosmetic";

const AngryFace: React.FC<Cosmetic> = (props) => {
  const allProps = {...props, name: "Angry Face"};
  
  return (
    <svg
      viewBox="0 0 10 10"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Angry Eyebrows */}
      <rect x="2" y="2" width="1" height="1" fill="black" />
      <rect x="3" y="3" width="1" height="1" fill="black" />
      <rect x="6" y="3" width="1" height="1" fill="black" />
      <rect x="7" y="2" width="1" height="1" fill="black" />
      
      {/* Eyes */}
      <rect x="3" y="4" width="1" height="1" fill="black" />
      <rect x="6" y="4" width="1" height="1" fill="black" />
      
      {/* Frown */}
      <rect x="3" y="7" width="1" height="1" fill="black" />
      <rect x="4" y="6" width="2" height="1" fill="black" />
      <rect x="6" y="7" width="1" height="1" fill="black" />
    </svg>
  );
};

export default AngryFace;