import UserCard from "@/components/user/UserCard"
import { GiExitDoor } from "react-icons/gi"
import "./page.css"

export default function PlayerDisplay({
    users,
    host,
    thisUser,
    kickUser,
}:{
    users:{[key:string]:{username:string,user_cosmetics:any, in_lobby:boolean}},
    host:string,
    thisUser:string,
    kickUser:(username:string)=>void,
}){
    return (
        <div className="party-page-user-list">
            {Object.entries(users).map(([username, user]) =>{
                return (
                    <div key={username} className="party-page-user-card">
                        <UserCard data={user} className={`user-card-style ${username === thisUser? "user-card-outline":""} ${username === host? "user-card-gold-name":""} ${!user.in_lobby ? "party-page-user-card-not-in-lobby" : ""}`} leader={username === host}>
                            <div className="party-user-buttons">
                                {username !== host && thisUser === host && 
                                    <button className="party-kick-button" onClick={() => kickUser(username)} title="Kick from party">
                                        <GiExitDoor />
                                    </button>
                                }
                            </div>
                        </UserCard>
                    </div>
                )
            })}
        </div>
    )
}