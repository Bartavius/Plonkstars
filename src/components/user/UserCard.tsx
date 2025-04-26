import UserIcon from "./UserIcon"
import "./UserCard.css"
export default function UserCard({
    data,
    className = "",
    children,
}:{
    data:any,
    className?: string,
    children?: React.ReactNode
}){
    return(
        <div className={`user-card-card ${className}`}>
            <UserIcon data={data.user_cosmetics} className="w-[4rem]"/>
            <div className="user-card-username">{data.username}</div>
            {children}
        </div>
    )
}