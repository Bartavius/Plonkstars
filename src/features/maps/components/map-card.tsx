import { FaClock, FaGlobeAmericas } from "react-icons/fa";
import { GiNetworkBars } from "react-icons/gi";

import { colorGradient } from "@/lib/color-gradient";
import "./map-search.css";
interface MapInfo {
  name: string;
  creator: string;
  average_score: number;
  average_generation_time: number;
  total_guesses: number;
}
interface MapCardProps {
  map: MapInfo;
  onClick?: () => void;
  className?: string;
}

function MapCard({ map, onClick, className = "" }: MapCardProps) {
  const getColor = (score: number, lower: number, upper: number, des?: boolean) => {
    score -= lower;
    const percent = Math.min(Math.max(score / (upper - lower), 0), 1);

    if (des) {
      return colorGradient({
        percent: percent,
        colors: [
          { r: 0, g: 255, b: 0 },
          { r: 255, g: 255, b: 0 },
          { r: 255, g: 0, b: 0 },
        ],
      });
    } else {
      return colorGradient({
        percent: percent,
      });
    }
  };

  return (
    <div
      className={`bg-plonk-stars-white text-darkest-blue flex flex-row items-center rounded-2xl transition-all duration-200 ease-[ease-in-out] w-full ${onClick ? "hover:bg-lighter-blue hover:cursor-pointer" : ""} ${className}`}
      onClick={onClick}
    >
      <img src="/PlonkStarsMarker.png" className="h-full p-4" />
      <div className="inline w-[40%] text-left">
        <div className="text-[1rem]">{map.name}</div>
        <div className="text-[0.8rem] text-[gray]">{map.creator}</div>
      </div>

      <div className="w-[15%] flex items-center mr-2 ml-2">
        <FaGlobeAmericas
          title="Times Played"
          className="text-[grey] [filter:brightness(75%)] pr-[0.2rem] text-[x-large]"
        />
        <div className="map-stat-stat">{map.total_guesses}</div>
      </div>

      <div className="w-[15%] flex items-center mr-2 ml-2">
        <GiNetworkBars
          title="Average Score"
          className="text-[grey] [filter:brightness(75%)] pr-[0.2rem] text-[x-large]"
          style={{ color: getColor(map.average_score, 1000, 4000) }}
        />
        <div className="map-stat-stat">{Math.round(map.average_score)}</div>
      </div>

      <div className="w-[15%] flex items-center mr-2 ml-2">
        <FaClock
          title="Average Generation Time"
          className="text-[grey] [filter:brightness(75%)] pr-[0.2rem] text-[x-large]"
          style={{ color: getColor(map.average_generation_time, 0, 2, true) }}
        />
        <div className="map-stat-stat">{Math.round(map.average_generation_time * 10) / 10}s</div>
      </div>
    </div>
  );
}

export { MapCard };
