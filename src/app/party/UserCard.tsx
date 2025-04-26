export default function UserCard({
    data
}:{
    data:any
}){
    return(
        <div className="user-card">
            <div className="user-card-avatar" style={{filter: `hue-rotate(${data.user_cosmetics.hue}deg) saturate(${data.user_cosmetics.saturation}%) brightness(${data.user_cosmetics.brightness}%)`}}>
                <img src="/PlonkStarsAvatar.svg" alt="" />
            </div>
            <div className="user-card-name">{data.username}</div>
            <div className="user-card-score">{data.score}</div>
        </div>
    )
}