import { GiBootStomp, GiExitDoor } from "react-icons/gi";

import type { Team } from "@/app/party/_types/team";
import { api } from "@/services/api";
import type { PartyMember } from "@/app/party/_types/party-member";

import { UserCard } from "./user-card";
interface TeamBoxProps {
  users: Record<string, PartyMember>;
  info: Team;
  thisUser: string;
  host: string;
  selected: boolean;
  code: string;
  kickUser: (username: string) => void;
}

function TeamBox({ users, info, thisUser, host, selected, code, kickUser }: TeamBoxProps) {
  function kickFromTeam(username: string) {
    api.post(`/party/teams/kick`, { code, username });
  }

  function getColor(color: number) {
    return `#${color.toString(16).padStart(6, "0")}`;
  }
  const teamColor = getColor(info.color);
  return (
    <div
      className={`party-page-team-box ${selected ? "party-page-team-box-selected" : ""}`}
      style={{ backgroundColor: teamColor }}
    >
      <div className="party-page-team-box-title">{info.name}</div>
      <div className="party-page-user-list">
        {info.members.map((username: string) => (
          <div key={username} className="party-page-user-card">
            <UserCard
              data={{
                ...users[username],
                user_cosmetics: { ...users[username].user_cosmetics, team_color: info.color },
              }}
              className={`user-card-style ${username === thisUser ? "user-card-outline" : ""} ${username === host ? "user-card-gold-name" : ""}`}
              leader={username === info.leader}
            >
              <div className="party-user-buttons">
                {(thisUser === host || thisUser === info.leader) && thisUser != username && (
                  <button
                    className="party-kick-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      kickFromTeam(username);
                    }}
                    title="Kick from team"
                  >
                    <GiBootStomp />
                  </button>
                )}
                {username !== host && thisUser === host && (
                  <button
                    className="party-kick-button"
                    onClick={() => kickUser(username)}
                    title="Kick from party"
                  >
                    <GiExitDoor />
                  </button>
                )}
              </div>
            </UserCard>
          </div>
        ))}
      </div>
    </div>
  );
}

export { TeamBox };
