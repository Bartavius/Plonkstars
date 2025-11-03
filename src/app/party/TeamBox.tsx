import UserCard from "@/components/user/UserCard";
import api from "@/utils/api";
import { GiBootStomp, GiExitDoor } from "react-icons/gi";
import { Team } from "./structs";

export default function TeamBox({
    users,
    info,
    thisUser,
    host,
    selected,
    code,
    kickUser,
    
}:{
    users:{[key:string]:{username:string,user_cosmetics:any}},
    info:Team,
    thisUser:string,
    host:string,
    selected: boolean,
    code: string,
    kickUser: (username:string) => void,
}
){
    function kickFromTeam(username: string){
        api.post(`/party/teams/kick`, {code, username})
    }

    function getColor(color: number) {
        return `#${color.toString(16).padStart(6, "0")}`
    }
    const teamColor = getColor(info.color);
    return (
        <div className={`party-page-team-box ${selected ? "party-page-team-box-selected" : ""}`} style={{backgroundColor: teamColor}}>
            <div className="party-page-team-box-title">{info.name}</div>
                <div className="party-page-user-list">
                    {info.members.map((username:string) => 
                        <div key={username} className="party-page-user-card">
                            <UserCard data={{...users[username], user_cosmetics: {...users[username].user_cosmetics, team_color:info.color}}} className={`user-card-style ${username === thisUser? "user-card-outline":""} ${username === host? "user-card-gold-name":""}`} leader={username === info.leader}>
                                <div className="party-user-buttons">
                                    {(thisUser === host || thisUser === info.leader) && thisUser != username && 
                                        <button 
                                            className="party-kick-button" 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                kickFromTeam(username)
                                            }} 
                                            title="Kick from team"
                                        >
                                            <GiBootStomp />
                                        </button>
                                    }
                                    {username !== host && thisUser === host && 
                                        <button className="party-kick-button" onClick={() => kickUser(username)} title="Kick from party">
                                            <GiExitDoor />
                                        </button>
                                    }
                                </div>
                            </UserCard>
                        </div>
                    )}
                </div>
        </div>
    );
}