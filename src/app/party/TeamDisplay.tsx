import UserCard from "@/components/user/UserCard";
import { GiExitDoor } from "react-icons/gi";
import TeamBox from "./TeamBox";
import "./page.css";
import api from "@/utils/api";
import { useEffect, useState } from "react";
import { Team } from "./structs";
import Modal from "@/components/Modal";
import TeamSettings from "./TeamSettings";

export default function TeamDisplay({
    code,
    users,
    host,
    thisUser,
    teams,
    kickUser,
    setMessage,
}:{
    code:string,
    users:{[key:string]:{username:string,user_cosmetics:any}},
    host:string,
    thisUser:string,
    teams: {[key:string]:Team},
    kickUser:(username:string)=>void,
    setMessage:(message:string,type?:string)=>void,
}){
    const [selectedTeam, setSelectedTeam] = useState<string | undefined>(undefined);
    const [teamEdit, setTeamEdit] = useState<string | undefined>(undefined);

    async function createTeam() {
        await api.post(`/party/teams/create`, {code})
        setMessage("Team created");
    }

    async function leaveTeam() {
        await api.post(`/party/teams/leave`, {code})
        setMessage("Team left");
    }

    async function joinTeam(teamId: string) {
        setSelectedTeam(undefined);
        await api.post(`/party/teams/join`, {code, id: teamId}); 
        setMessage("Team joined");          
    }

    async function deleteTeam(teamId: string) {
        setSelectedTeam(undefined);
        api.post(`/party/teams/delete`, {code, id: teamId});
        setMessage("Deleted team");
    }

    useEffect(() => {
        if (selectedTeam && !teams[selectedTeam]) {
            setSelectedTeam(undefined);
        }
    }, [teams, selectedTeam]);

    const teamMembers = new Set(
        Object.values(teams).flatMap((team: any) => team.members)
    );

    const spectators = Object.keys(users).filter((username) => !teamMembers.has(username));
    const team = Object.values(teams).find((team: any) => team.members.includes(thisUser));
    
    return (
        <div className="party-page-team-content-wrapper" onClick={() => setSelectedTeam(undefined)}>
            <div className="party-page-team-content no-scrollbar">
                <div className="party-page-team-boxes">
                    {
                        Object.entries(teams).map(([teamId, team]) => (
                            <div 
                                key={teamId} 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (selectedTeam === teamId) {
                                        setSelectedTeam(undefined);
                                    }
                                    else{
                                        setSelectedTeam(teamId);
                                    }
                                }}
                            >
                                <TeamBox selected={selectedTeam===teamId} users={users} info={team} thisUser={thisUser} host={host} code={code} kickUser={kickUser}/>
                            </div>
                        ))
                    }
                </div>
                <div className="party-page-team-buttons">
                    {(selectedTeam === undefined || selectedTeam === team?.id) && 
                        (spectators.includes(thisUser) ? 
                            <button onClick={createTeam} className="party-page-create-team-button party-page-team-button">Create Team</button>:
                            <button onClick={leaveTeam} className="party-page-leave-team-button party-page-team-button">Leave Team</button>
                        ) 
                    }
                    {selectedTeam && selectedTeam !== team?.id &&
                        <button onClick={() => joinTeam(selectedTeam)} className="party-page-join-team-button party-page-team-button">Join Team</button>
                    }
                    {selectedTeam && (host == thisUser || teams[selectedTeam].leader === thisUser) ?
                        <>
                            <button onClick={() => setTeamEdit(selectedTeam)} className="party-page-team-settings-button party-page-team-button">Team Settings</button>
                            <button onClick={() => deleteTeam(selectedTeam)} className="party-page-delete-team-button party-page-team-button">Delete Team</button>
                        </>:
                        !selectedTeam && team && team.leader === thisUser &&
                        <>
                            <button onClick={() => setTeamEdit(team.id)} className="party-page-team-settings-button party-page-team-button">Team Settings</button>
                            <button onClick={() => deleteTeam(team.id)} className="party-page-delete-team-button party-page-team-button">Delete Team</button>
                        </>
                    }

                </div>
                {spectators.length > 0 &&
                    <div className="party-page-spectator-box">
                        <div className="party-page-team-box-title">Spectators</div>
                        <div className="party-page-user-list">
                            {spectators.map((username) => 
                                <div key={username} className="party-page-user-card">
                                    <UserCard data={users[username]} className={`user-card-style ${username === thisUser? "user-card-outline":""} ${username === host? "user-card-gold-name":""}`}>
                                        <div className="party-user-buttons">
                                            {username !== host && thisUser === host && 
                                                <button 
                                                    className="party-kick-button" 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        kickUser(username);
                                                    }}
                                                    title="Kick from party"
                                                >
                                                    <GiExitDoor />
                                                </button>
                                            }
                                        </div>
                                    </UserCard>
                                </div>
                            )}
                        </div>
                    </div>
                }
            </div>
            <Modal isOpen={teamEdit !== undefined} onClose={() => setTeamEdit(undefined)}>
                {teamEdit && <TeamSettings teamInfo={teams[teamEdit]} setMessage={setMessage} onClose={() => setTeamEdit(undefined)}/>}
            </Modal>
        </div>
    )
}