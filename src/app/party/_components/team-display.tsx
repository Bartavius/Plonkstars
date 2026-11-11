/* eslint-disable import/order -- Sorting these imports would reorder stylesheets, since
   CSS loads in import order. See "Imports" in CLAUDE.md. */
import { useEffect, useState } from "react";
import { GiExitDoor } from "react-icons/gi";

import type { Team } from "@/app/party/_types/team";
import { api } from "@/services/api";

import { TeamSettings } from "./team-settings";
import { UserCard } from "./user-card";
import { TeamBox } from "./team-box";

import "@/app/party/page.css";
import { Modal } from "@/components/primitives/modal";
import type { PartyMember } from "@/app/party/_types/party-member";
interface TeamDisplayProps {
  code: string;
  users: Record<string, PartyMember>;
  host: string;
  thisUser: string;
  teams: { [key: string]: Team };
  kickUser: (username: string) => void;
  setMessage: (message: string, type?: string) => void;
}

function TeamDisplay({
  code,
  users,
  host,
  thisUser,
  teams,
  kickUser,
  setMessage,
}: TeamDisplayProps) {
  const [selectedTeam, setSelectedTeam] = useState<string | undefined>(undefined);
  const [teamEdit, setTeamEdit] = useState<string | undefined>(undefined);

  async function createTeam() {
    await api.post(`/party/teams/create`, { code });
    setMessage("Team created");
  }

  async function leaveTeam() {
    await api.post(`/party/teams/leave`, { code });
    setMessage("Team left");
  }

  async function joinTeam(teamId: string) {
    setSelectedTeam(undefined);
    await api.post(`/party/teams/join`, { code, id: teamId });
    setMessage("Team joined");
  }

  async function deleteTeam(teamId: string) {
    setSelectedTeam(undefined);
    api.post(`/party/teams/delete`, { code, id: teamId });
    setMessage("Deleted team");
  }

  useEffect(() => {
    if (selectedTeam && !teams[selectedTeam]) {
      setSelectedTeam(undefined);
    }
  }, [teams, selectedTeam]);

  const teamMembers = new Set(Object.values(teams).flatMap((team) => team.members));

  const spectators = Object.keys(users).filter((username) => !teamMembers.has(username));
  const team = Object.values(teams).find((team) => team.members.includes(thisUser));

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center gap-4"
      onClick={() => setSelectedTeam(undefined)}
    >
      <div className="relative flex flex-col items-center w-full h-auto z-0 gap-4 overflow-auto pt-[50px] pb-[50px] no-scrollbar">
        <div className="flex flex-wrap gap-4 justify-center items-center">
          {Object.entries(teams).map(([teamId, team]) => (
            <div
              key={teamId}
              onClick={(e) => {
                e.stopPropagation();
                if (selectedTeam === teamId) {
                  setSelectedTeam(undefined);
                } else {
                  setSelectedTeam(teamId);
                }
              }}
            >
              <TeamBox
                selected={selectedTeam === teamId}
                users={users}
                info={team}
                thisUser={thisUser}
                host={host}
                code={code}
                kickUser={kickUser}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-center items-center w-full gap-2">
          {(selectedTeam === undefined || selectedTeam === team?.id) &&
            (spectators.includes(thisUser) ? (
              <button
                onClick={createTeam}
                className="bg-color-green rounded-2xl px-8 py-1 border-none transition-all duration-200 ease-[ease-in-out] text-white hover:cursor-pointer hover:brightness-90 hover:scale-[1.02] hover:shadow-[0px_3px_10px_rgba(0,25,51,0.3)]"
              >
                Create Team
              </button>
            ) : (
              <button
                onClick={leaveTeam}
                className="bg-plonk-stars-red rounded-2xl px-8 py-1 border-none transition-all duration-200 ease-[ease-in-out] text-white hover:cursor-pointer hover:brightness-90 hover:scale-[1.02] hover:shadow-[0px_3px_10px_rgba(0,25,51,0.3)]"
              >
                Leave Team
              </button>
            ))}
          {selectedTeam && selectedTeam !== team?.id && (
            <button
              onClick={() => joinTeam(selectedTeam)}
              className="bg-color-green rounded-2xl px-8 py-1 border-none transition-all duration-200 ease-[ease-in-out] text-white hover:cursor-pointer hover:brightness-90 hover:scale-[1.02] hover:shadow-[0px_3px_10px_rgba(0,25,51,0.3)]"
            >
              Join Team
            </button>
          )}
          {selectedTeam && (host == thisUser || teams[selectedTeam].leader === thisUser) ? (
            <>
              <button
                onClick={() => setTeamEdit(selectedTeam)}
                className="bg-[gray] rounded-2xl px-8 py-1 border-none transition-all duration-200 ease-[ease-in-out] text-white hover:cursor-pointer hover:brightness-90 hover:scale-[1.02] hover:shadow-[0px_3px_10px_rgba(0,25,51,0.3)]"
              >
                Team Settings
              </button>
              <button
                onClick={() => deleteTeam(selectedTeam)}
                className="bg-plonk-stars-red rounded-2xl px-8 py-1 border-none transition-all duration-200 ease-[ease-in-out] text-white hover:cursor-pointer hover:brightness-90 hover:scale-[1.02] hover:shadow-[0px_3px_10px_rgba(0,25,51,0.3)]"
              >
                Delete Team
              </button>
            </>
          ) : (
            !selectedTeam &&
            team &&
            team.leader === thisUser && (
              <>
                <button
                  onClick={() => setTeamEdit(team.id)}
                  className="bg-[gray] rounded-2xl px-8 py-1 border-none transition-all duration-200 ease-[ease-in-out] text-white hover:cursor-pointer hover:brightness-90 hover:scale-[1.02] hover:shadow-[0px_3px_10px_rgba(0,25,51,0.3)]"
                >
                  Team Settings
                </button>
                <button
                  onClick={() => deleteTeam(team.id)}
                  className="bg-plonk-stars-red rounded-2xl px-8 py-1 border-none transition-all duration-200 ease-[ease-in-out] text-white hover:cursor-pointer hover:brightness-90 hover:scale-[1.02] hover:shadow-[0px_3px_10px_rgba(0,25,51,0.3)]"
                >
                  Delete Team
                </button>
              </>
            )
          )}
        </div>
        {spectators.length > 0 && (
          <div className="border-white border-2 p-4 rounded-2xl flex flex-col gap-2">
            <div className="text-white text-center w-full text-[1.2rem] [-webkit-text-stroke:0.5px_black] [-webkit-text-fill-color:white] font-extrabold">
              Spectators
            </div>
            <div className="flex flex-wrap gap-4 justify-center items-center h-full w-full z-0">
              {spectators.map((username) => (
                <div key={username} className="min-w-[8vw]">
                  <UserCard
                    data={users[username]}
                    className={`shadow-[0px_3px_10px_rgba(0,25,51,0.3)] ${username === thisUser ? "border-white border-2" : ""} ${username === host ? "text-leaderboard-yellow" : ""} ${!users[username].in_lobby ? "opacity-50" : ""}`}
                  >
                    <div className="absolute top-2 right-2 text-[1.5rem] text-white transition-all duration-200 ease-[ease-in-out] flex gap-2 flex-col">
                      {username !== host && thisUser === host && (
                        <button
                          className="hover:text-plonk-stars-red"
                          onClick={(e) => {
                            e.stopPropagation();
                            kickUser(username);
                          }}
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
        )}
      </div>
      <Modal isOpen={teamEdit !== undefined} onClose={() => setTeamEdit(undefined)}>
        {teamEdit && (
          <TeamSettings
            teamInfo={teams[teamEdit]}
            setMessage={setMessage}
            onClose={() => setTeamEdit(undefined)}
          />
        )}
      </Modal>
    </div>
  );
}

export { TeamDisplay };
