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
      className={`p-4 rounded-2xl flex flex-col gap-2 cursor-pointer ${selected ? "border-[3px] border-white scale-[1.02] shadow-[0px_3px_10px_rgba(0,25,51,0.3)] hover:brightness-90" : "hover:brightness-90 hover:scale-[1.02] hover:shadow-[0px_3px_10px_rgba(0,25,51,0.3)]"}`}
      style={{ backgroundColor: teamColor }}
    >
      <div className="text-white text-center w-full text-[1.2rem] [-webkit-text-stroke:0.5px_black] [-webkit-text-fill-color:white] font-extrabold">
        {info.name}
      </div>
      <div className="flex flex-wrap gap-4 justify-center items-center h-full w-full z-0">
        {info.members.map((username: string) => (
          <div key={username} className="min-w-[8vw]">
            <UserCard
              data={{
                ...users[username],
                user_cosmetics: { ...users[username].user_cosmetics, team_color: info.color },
              }}
              className={`shadow-[0px_3px_10px_rgba(0,25,51,0.3)] ${username === thisUser ? "border-white border-2" : ""} ${username === host ? "text-leaderboard-yellow" : ""}`}
              leader={username === info.leader}
            >
              <div className="absolute top-2 right-2 text-[1.5rem] text-white transition-all duration-200 ease-[ease-in-out] flex gap-2 flex-col">
                {(thisUser === host || thisUser === info.leader) && thisUser != username && (
                  <button
                    className="hover:text-plonk-stars-red"
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
                    className="hover:text-plonk-stars-red"
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
