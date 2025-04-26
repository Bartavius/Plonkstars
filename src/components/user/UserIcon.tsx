export default function UserIcon({
    data,
    className
}:{
    data:any
    className?: string
}){
    return(
        <div className={`w-full ${className}`}>
            <img src="/PlonkStarsAvatar.svg" style={{filter: `hue-rotate(${data.hue}deg) saturate(${data.saturation}%) brightness(${data.brightness}%)`}} alt="" />
        </div>
    )
}