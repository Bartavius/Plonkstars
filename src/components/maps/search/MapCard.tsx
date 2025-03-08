import exp from "constants"

interface MapInfo{
    name:String,
    creator:{username:String}
}
const MapCard = ({map}:{map:MapInfo}) => {
    return(
    <div className="cursor-pointer hover:bg-gray-100 text-dark flex items-center bg-white rounded-lg shadow-lg">
        <img src="/PlonkStarsMarker.png" className="h-full p-4"/>
        <div className="inline">
            <div className="text-lg">
                {map.name}
            </div>
            <div className="text-sm">
                {map.creator.username}                             
            </div>
        </div>
    </div>
    )
}

export default MapCard;