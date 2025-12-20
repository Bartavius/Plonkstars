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
            <div className="user-card-user-icon">
                <UserIcon data={data.user_cosmetics}/>
            </div>
            <div className="user-card-username">
                {leader && <FaCrown className="gold-name"/>}{data.username}
            </div>
            {children}
        </div>
    )
}