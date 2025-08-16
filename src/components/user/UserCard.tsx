import UserIcon from "./UserIcon"
import "./UserCard.css"
import { FaCrown } from "react-icons/fa"
export default function UserCard({
    data,
    className = "",
    leader = false,
    children,
}:{
    data:any,
    className?: string,
    leader?: boolean,
    children?: React.ReactNode
}){
    return(
        <div className={`user-card-card ${className}`}>
            <UserIcon data={data.user_cosmetics} className="user-card-user-icon"/>
            <div className="user-card-username">
                {leader && <FaCrown className="gold-name"/>}{data.username}
            </div>
            {children}
        </div>
    )
}