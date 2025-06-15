import { FaClock,FaGlobeAmericas } from "react-icons/fa";
import { GiNetworkBars } from "react-icons/gi";
import colorGradient from "@/components/colorGradient";
import "./MapSearch.css";
interface MapInfo{
    name:String,
    creator:{username:String}
    average_score:number,
    average_generation_time:number,
    total_guesses:number
}
const MapCard = ({
    map,
    onClick,
    className = ""
}:{
    map:MapInfo,
    onClick?:() => void,
    className?:string

}) => {

    const getColor = (score:number, lower:number, upper:number, des?:boolean) => {
        score -= lower;
        const percent = Math.min(Math.max(score / (upper - lower),0),1);

        if(des){
            return colorGradient({
                percent: percent,
                colors: [
                    {r: 0, g: 255, b: 0},
                    {r: 255, g: 255, b: 0},
                    {r: 255, g: 0, b: 0},  
                ]
            });
        }
        else{
            return colorGradient({
                percent: percent,
            })
        }
    }

    return(
    <div className={`map-card ${onClick ? "map-card-clickable" : ""} ${className}`} onClick={onClick}>  
        <img src="/PlonkStarsMarker.png" className="h-full p-4"/>
        <div className="map-title">
            <div className="map-name">
                {map.name}
            </div>
            <div className="map-creator">
                {map.creator.username}                             
            </div>
        </div>

        <div className="map-stat">
            <FaGlobeAmericas title="Times Played" className="map-icon"/>
            <div className="map-stat-stat">
                {map.total_guesses}
            </div>
        </div>

        <div className="map-stat">
            <GiNetworkBars title="Average Score" className="map-icon" style={{color: getColor(map.average_score,1000,4000)}}/>
            <div className="map-stat-stat">
                {Math.round(map.average_score)}
            </div>
        </div>

        <div className="map-stat">
            <FaClock title="Average Generation Time" className="map-icon" style={{color: getColor(map.average_generation_time,0,2,true)}}/>
            <div className="map-stat-stat">
                {Math.round(map.average_generation_time * 10)/10}s
            </div>
        </div>
    </div>
    )
}

export default MapCard;