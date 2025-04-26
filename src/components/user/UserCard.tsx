import UserIcon from "./UserIcon"
import "./UserCard.css"
export default function UserCard({
    data,
    className = "",
}:{
    data:any,
    className?: string,
}){
    return(
        <div className={`user-card-card ${className}`}>
            <UserIcon data={data.user_cosmetics} className="w-[5rem]"/>
            <div className="user-card-username">{data.username}</div>
        </div>
    )
}