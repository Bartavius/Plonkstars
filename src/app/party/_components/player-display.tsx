import { GiExitDoor } from "react-icons/gi";

import type { PartyMember } from "@/app/party/_types/party-member";

import { UserCard } from "./user-card";
import "@/app/party/page.css";
interface PlayerDisplayProps {
  users: Record<string, PartyMember>;
  host: string;
  thisUser: string;
  kickUser: (username: string) => void;
}

function PlayerDisplay({ users, host, thisUser, kickUser }: PlayerDisplayProps) {
  return (
    <div className="flex flex-wrap gap-4 justify-center items-center h-full w-full z-0">
      {Object.entries(users).map(([username, user]) => {
        return (
          <div key={username} className="min-w-[8vw]">
            <UserCard
              data={user}
              className={`shadow-[0px_3px_10px_rgba(0,25,51,0.3)] ${username === thisUser ? "border-white border-2" : ""} ${username === host ? "text-leaderboard-yellow" : ""} ${!user.in_lobby ? "opacity-50" : ""}`}
              leader={username === host}
            >
              <div className="absolute top-2 right-2 text-[1.5rem] text-white transition-all duration-200 ease-[ease-in-out] flex gap-2 flex-col">
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
        );
      })}
    </div>
  );
}

export { PlayerDisplay };
