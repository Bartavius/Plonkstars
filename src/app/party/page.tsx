"use client";

/* eslint-disable import/order -- Sorting these imports would reorder stylesheets, since
   CSS loads in import order. See "Imports" in CLAUDE.md. */
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { BiSolidCheckboxChecked, BiSolidCheckboxMinus } from "react-icons/bi";
import { BsInfinity } from "react-icons/bs";
import { GoTriangleLeft, GoTriangleRight } from "react-icons/go";
import { useDispatch } from "react-redux";

import { Loading } from "@/components/primitives/loading";
import { ProtectedRoutes } from "@/features/auth/components/protected-routes";
import { useSocket } from "@/lib/hooks/use-socket";
import { api } from "@/services/api";
import { setError } from "@/store/error-slice";
import { clearPartyCode } from "@/store/party-slice";

import type { Team } from "./_types/team";

import "./page.css";
import { MapCard } from "@/features/maps/components/map-card";
import { Modal } from "@/components/primitives/modal";
import { MapSearch } from "@/features/maps/components/map-search";
import { Popup } from "@/components/primitives/popup";
import { UserInput } from "@/components/primitives/user-input";

import { PlayerDisplay } from "./_components/player-display";
import { TeamDisplay } from "./_components/team-display";
import type { PartyGameState } from "./_types/party-game-state";
import type { PartyMember } from "./_types/party-member";
import type { PartyRules } from "./_types/party-rules";
import type {
  PartyLobbyJoinEvent,
  PartyTeamDeleteEvent,
  PartyTeamUpdateEvent,
  PartyTeamUserEvent,
  PartyUserRemovedEvent,
} from "./_types/party-socket-events";
import type { PartyUsersResponse } from "./_types/party-users-response";
import type { RuleConfig, RuleKey } from "@/features/game/types/rule-config";
import type { RuleInputValue } from "@/features/game/types/rule-input-value";
import type { PartyLeaveEvent } from "@/features/party/types/party-leave-event";
import type { UserProfile } from "@/features/user/types/user-profile";
import { getErrorResponse } from "@/services/api-error";
import { useAppSelector } from "@/store/use-app-selector";

const modes = ["Live", "Duels"];

export default function PartyPage() {
  const [users, setUsers] = useState<Record<string, PartyMember>>({});
  const [host, setHost] = useState<string>("");
  const [thisUser, setThisUser] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [rules, setRules] = useState<PartyRules>();
  const [localRules, setLocalRules] = useState<PartyRules>();
  const [rulesOpen, setRulesOpen] = useState<boolean>(false);
  const [mapOpen, setMapOpen] = useState<boolean>(false);
  const [hoverCode, setHoverCode] = useState<boolean>(false);
  const [type, setType] = useState<string>();
  const [message, _setMessage] = useState<string>();
  const [update, setUpdate] = useState<number>(0);
  const [state, setState] = useState<PartyGameState>();
  const [rulesConfig, setRulesConfig] = useState<RuleConfig[] | null>(null);
  const [modeIndex, setModeIndex] = useState<number>(0);
  const [teams, setTeams] = useState<{ [key: string]: Team }>({});

  const dispatch = useDispatch();
  const code = useAppSelector((state) => state.party).code;
  const router = useRouter();

  const socket = useSocket({
    namespace: "/party",
    rooms: { code: code },
    functions: {
      leave: (data: PartyLeaveEvent) => {
        dispatch(clearPartyCode());
        dispatch(setError(data?.reason));
        router.push("/game");
      },
      add_user: (data: UserProfile) => {
        setUsers((prev) => ({
          ...prev,
          [data.username]: {
            ...data,
            in_lobby: prev[data.username]?.in_lobby || false,
          },
        }));
      },
      remove_user: (data: PartyUserRemovedEvent) => {
        setUsers((prev) => {
          const prevCopy = { ...prev };
          delete prevCopy[data.username];
          return prevCopy;
        });
      },
      join_lobby: (data: PartyLobbyJoinEvent) => {
        setUsers((prev) => ({
          ...prev,
          [data.user]: {
            ...prev[data.user],
            in_lobby: true,
          },
        }));
      },
      add_team: (data: Team) => {
        setTeams((prev) => ({
          ...prev,
          [data.id]: data,
        }));
      },
      update_team: (data: PartyTeamUpdateEvent) => {
        setTeams((prev) => ({
          ...prev,
          [data.id]: {
            ...prev[data.id],
            ...data,
          },
        }));
      },
      add_team_user: (data: PartyTeamUserEvent) => {
        setTeams((prev) => ({
          ...prev,
          [data.id]: {
            ...prev[data.id],
            members: [...prev[data.id].members, data.username],
          },
        }));
      },
      remove_team_user: (data: PartyTeamUserEvent) => {
        setTeams((prev) => ({
          ...prev,
          [data.id]: {
            ...prev[data.id],
            members: prev[data.id].members.filter((username) => username !== data.username),
          },
        }));
      },
      delete_team: (data: PartyTeamDeleteEvent) => {
        setTeams((prev) => {
          const newTeams = { ...prev };
          delete newTeams[data.id];
          return newTeams;
        });
      },
      update_rules: (data: PartyRules) => {
        setRules(data);
        setLocalRules(data);
        setModeIndex(modes.findIndex((item) => item.toLowerCase() === data.type.toLowerCase()));
      },
      start: pushGame,
      summary: updateGameState,
    },
  });

  function setMessage(message: string, type: string = "success") {
    setType(type);
    _setMessage(message);
    setUpdate((prev) => prev + 1);
  }

  async function updateGameState(data: unknown) {
    const state = await api.get<PartyGameState>(`/party/game/state?code=${code}`);
    setState(state.data);
  }
  function pushGame(data: Pick<PartyGameState, "id" | "type">) {
    router.push(`/${data.type!.toLowerCase()}/${data.id}`);
  }
  async function fetchData() {
    const state = await api.get<PartyGameState>(`/party/game/state?code=${code}`);
    setState(state.data);
    await api.post(`/party/lobby/join`, { code });
    const users = await api.get<PartyUsersResponse>(`/party/users?code=${code}`);
    const members = users.data.members.reduce<Record<string, PartyMember>>((acc, item) => {
      acc[item.username] = item;
      return acc;
    }, {});
    setUsers(members);
    setHost(users.data.host);
    setThisUser(users.data.this);
    const rules = await api.get<PartyRules>(`/party/rules?code=${code}`);
    setRules(rules.data);
    setLocalRules(rules.data);
    setModeIndex(modes.findIndex((item) => item.toLowerCase() === rules.data.type.toLowerCase()));
    const rulesConfig = await api.get<RuleConfig[]>(`/party/rules/config?code=${code}`);
    setRulesConfig(rulesConfig.data);
    const team = await api.get<Team[]>(`/party/teams?code=${code}`);
    setTeams(
      team.data.reduce<Record<string, Team>>((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {}),
    );
    setLoading(false);
  }

  async function leaveParty() {
    await api.post("/party/leave", { code: code });
  }

  async function disbandParty() {
    await api.post("/party/delete", { code: code });
  }

  async function kickUser(username: string) {
    await api.post("/party/users/remove", { code: code, username: username });
    setMessage(`Kicked ${username}`, "error");
  }

  async function gameStart() {
    await api.post("/party/game/start", { code: code });
  }

  async function joinGame() {
    await api.post("/party/game/join", { code: code });
    pushGame(state!);
  }

  async function setMap(id: string, name: string) {
    setMapOpen(false);
    await api.post("/party/rules", { code, ...rules, map_id: id });
    setMessage("Saved Map");
  }

  async function saveRules() {
    setRulesOpen(false);
    await api.post("/party/rules", { code, ...localRules });
    setMessage("Saved Rules");
  }

  function copyPartyLink() {
    navigator.clipboard.writeText(`${window.location.origin}/party/join?code=${code}`);
    setMessage("Copied Party Link", "info");
  }

  function setSingleRule(key: RuleKey, value: RuleInputValue) {
    setLocalRules((prev) => ({
      ...prev!,
      [key]: value,
    }));
  }

  async function changeMode(index: number) {
    index = (index + modes.length) % modes.length;
    setModeIndex(index);
    await api.post("/party/rules", { code, type: modes[index] });

    const rulesConfig = await api.get<RuleConfig[]>(`/party/rules/config?code=${code}`);
    setRulesConfig(rulesConfig.data);
  }

  useEffect(() => {
    if (!code) {
      router.push("/game");
      return;
    }

    function leaveLobby() {
      api.post("/party/lobby/leave", { code });
    }

    try {
      fetchData();
    } catch (err) {
      dispatch(clearPartyCode());
      dispatch(
        setError(
          getErrorResponse(err)?.data?.error || "An error occurred while fetching party data.",
        ),
      );
      router.push("/game");
    }

    window.addEventListener("beforeunload", leaveLobby);
    return () => {
      window.removeEventListener("beforeunload", leaveLobby);
    };
  }, []);

  if (loading) {
    return (
      <ProtectedRoutes>
        <Loading />
      </ProtectedRoutes>
    );
  }

  const displayRules = {
    Rounds: rules!.rounds === -1 ? <BsInfinity /> : rules!.rounds,
    Time: rules!.time === -1 ? <BsInfinity /> : `${rules!.time}s`,
    NMPZ: rules!.nmpz ? (
      <BiSolidCheckboxChecked className="text-green-300 text-xl" />
    ) : (
      <BiSolidCheckboxMinus className="text-red-300 text-xl" />
    ),
  };

  const isHost = host == thisUser;
  return (
    <ProtectedRoutes>
      <div className="relative overflow-hidden">
        <Popup update={update} type={type} duration={750} fadeOut={1000}>
          {message}
        </Popup>
        <div className="navbar-buffer" />
        <div className="h-[calc(100vh-4rem-var(--navbar-height))] relative flex flex-col items-center justify-center">
          <div
            className="absolute top-2 right-2 w-[100px] h-[60px] flex justify-center items-center text-center rounded-2xl bg-dark-blue p-2 z-[1] hover:cursor-pointer hover:brightness-90"
            onMouseEnter={() => setHoverCode(true)}
            onMouseLeave={() => setHoverCode(false)}
            onClick={copyPartyLink}
          >
            {hoverCode ? code : "Hover for Code"}
          </div>
          <div className="absolute top-2 w-[200px] left-1/2 flex justify-between items-center text-center rounded-2xl bg-dark-blue p-2 z-[1] -translate-x-1/2">
            {isHost ? (
              <GoTriangleLeft
                className="text-[1.5rem] text-white transition-all duration-200 ease-[ease-in-out] hover:cursor-pointer hover:text-plonk-stars-red hover:scale-110"
                onClick={() => changeMode(modeIndex - 1)}
              />
            ) : (
              <div />
            )}
            {modes[modeIndex]}
            {isHost ? (
              <GoTriangleRight
                className="text-[1.5rem] text-white transition-all duration-200 ease-[ease-in-out] hover:cursor-pointer hover:text-plonk-stars-red hover:scale-110"
                onClick={() => changeMode(modeIndex + 1)}
              />
            ) : (
              <div />
            )}
          </div>
          {rules!.team_type == "solo" ? (
            <PlayerDisplay users={users} host={host} thisUser={thisUser} kickUser={kickUser} />
          ) : rules!.team_type == "team" ? (
            <TeamDisplay
              code={code!}
              users={users}
              host={host}
              thisUser={thisUser}
              teams={teams}
              kickUser={kickUser}
              setMessage={setMessage}
            />
          ) : undefined}
        </div>
        <div className="h-16 w-full bg-dark-blue flex justify-between shadow-[0px_-2px_4px_rgba(0,0,0,0.05)] items-center overflow-hidden">
          <div className="ml-4 flex justify-center items-center gap-4">
            <button
              className="btn-primary party-page-exit-button"
              onClick={() => (isHost ? disbandParty() : leaveParty())}
            >
              {isHost ? "Disband Party" : "Leave"}
            </button>
          </div>
          <div className="grid grid-cols-[repeat(2,1fr)] justify-center items-center gap-8 w-[50rem]">
            <div
              className="flex justify-between items-center flex-row h-full w-full bg-dark-blue rounded-2xl px-4 border-2 border-solid border-white brightness-110 transition-all duration-200 ease-[ease-in-out] hover:cursor-pointer hover:brightness-90"
              onClick={() => setRulesOpen(true)}
            >
              {Object.entries(displayRules).map(([key, value]) => (
                <div key={key} className="grid grid-rows-[auto_auto] grid-cols-[1fr] h-full">
                  <div className="flex justify-center text-[1.25rem] text-plonk-stars-red font-extrabold">
                    {key}
                  </div>
                  <div className="flex justify-center text-[1rem] text-white">{value}</div>
                </div>
              ))}
            </div>
            <MapCard
              map={rules!.map}
              className={`!bg-dark-blue !border-2 !border-white brightness-110 ${isHost ? "hover:cursor-pointer hover:brightness-90" : ""}`}
              onClick={
                isHost
                  ? () => {
                      setMapOpen(true);
                      setLocalRules(rules);
                    }
                  : undefined
              }
            />
          </div>
          <div className="mr-4">
            {state!.state === "playing" ? (
              state!.joined ? (
                <button
                  className="bg-color-green transition-all duration-200 ease-[ease-in-out] px-8 py-2 rounded-2xl hover:bg-color-green hover:brightness-90 hover:scale-[1.02] hover:shadow-[0px_3px_10px_rgba(0,25,51,0.3)]"
                  onClick={() => pushGame(state!)}
                >
                  Rejoin Game
                </button>
              ) : (
                <button
                  className="bg-color-green transition-all duration-200 ease-[ease-in-out] px-8 py-2 rounded-2xl hover:bg-color-green hover:brightness-90 hover:scale-[1.02] hover:shadow-[0px_3px_10px_rgba(0,25,51,0.3)]"
                  onClick={joinGame}
                >
                  Join Game
                </button>
              )
            ) : isHost ? (
              <button
                className="bg-color-green transition-all duration-200 ease-[ease-in-out] px-8 py-2 rounded-2xl hover:bg-color-green hover:brightness-90 hover:scale-[1.02] hover:shadow-[0px_3px_10px_rgba(0,25,51,0.3)]"
                onClick={gameStart}
              >
                Start
              </button>
            ) : (
              <div>Waiting for host...</div>
            )}
          </div>
        </div>
        <Modal isOpen={mapOpen} onClose={() => setMapOpen(false)}>
          <h2 className="text-[x-large] font-semibold text-center">Select Map</h2>
          <MapSearch mapSelect={setMap} pageSize={12} bodySize="60vh" />
        </Modal>

        <Modal
          isOpen={rulesOpen}
          onClose={() => {
            setRulesOpen(false);
          }}
        >
          <h2 className="text-[x-large] font-semibold text-center">Rules</h2>
          {rulesConfig &&
            rulesConfig.map((data) => (
              <div className="py-2" key={data.key}>
                <UserInput
                  key={data.key}
                  inputType={data.display}
                  data={data}
                  value={localRules ? localRules[data.key] : undefined}
                  setError={(error) => setMessage(error, "error")}
                  setInput={(input) => setSingleRule(data.key, input)}
                  editable={isHost}
                />
              </div>
            ))}
          {isHost && (
            <button className="btn-primary justify-center flex mx-auto" onClick={saveRules}>
              Save Rules
            </button>
          )}
        </Modal>
      </div>
    </ProtectedRoutes>
  );
}
