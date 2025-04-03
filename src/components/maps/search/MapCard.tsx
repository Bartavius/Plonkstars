import { FaClock,FaGlobeAmericas } from "react-icons/fa";
import { GiNetworkBars } from "react-icons/gi";
interface MapInfo{
    name:String,
    creator:{username:String}
    average_score:number,
    average_generation_time:number,
    total_guesses:number
}
const MapCard = ({map}:{map:MapInfo}) => {

    const getColor = (score:number, lower:number, upper:number, des?:boolean) => {
        if(!des){
            des = false;
        }
        
        score -= lower;
        upper -= lower;


        const percent = score / upper;
        
        const top = Math.max(Math.min(percent < .5 ? 255: 255 * (1 - ((percent - 0.5) * 2)),255),0);
        const bottom = Math.max(Math.min(percent > .5 ? 255:255 * 2 * percent,255),0);

        return des ? `rgb(${bottom},${top},0)`: `rgb(${top},${bottom},0)`;
    }

    return(
    <div className="map-card">  
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
            <FaClock title="Average Generation Time" className="map-icon" style={{color: getColor(map.average_generation_time,1,3,true)}}/>
            <div className="map-stat-stat">
                {Math.round(map.average_generation_time * 10)/10}s
            </div>
        </div>
    </div>
    )
}

export default MapCard;