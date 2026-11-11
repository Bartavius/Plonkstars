"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useDuelsSocket } from "@/app/duels/_hooks/use-duels-socket";
import { Loading } from "@/components/primitives/loading";
import { ProtectedRoutes } from "@/features/auth/components/protected-routes";
import { DuelsSummary } from "@/features/duels/components/summary";
import { api } from "@/services/api";
import "./page.css";
import type { DuelsSummaryGuess } from "@/features/duels/types/duels-guess";
import type { DuelsTeam } from "@/features/duels/types/duels-team";
import type { DuelsUser } from "@/features/duels/types/duels-user";
import type { UserProfile } from "@/features/user/types/user-profile";
import type { CurrentUserResponse } from "@/app/duels/_types/current-user-response";
import type { DuelsState } from "@/app/duels/_types/duels-state";
import type { DuelsSummaryResponse } from "@/app/duels/_types/duels-summary-response";

export default function DuelsSummaryPage() {
  const router = useRouter();
  const [locations, setLocations] = useState<{ lat: number; lng: number }[]>([]);
  const [teams, setTeams] = useState<Record<string, DuelsTeam>>({});
  const [users, setUsers] = useState<Record<string, DuelsUser>>({});
  const [teamGuesses, setTeamGuesses] = useState<Record<string, DuelsSummaryGuess[][]>>({});
  const [teamHP, setTeamHP] = useState<Record<string, number[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [state, setState] = useState<string>();
  const [thisUser, setThisUser] = useState<string>("");
  const [startHP, setStartHP] = useState<number>(0);

  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";

  useEffect(() => {
    async function fetchData() {
      const state = await api.get<DuelsState>(`/game/state?id=${id}`);
      setState(state.data.state);

      const res = await api.get<DuelsSummaryResponse>(`/game/summary?id=${id}`);
      setLocations(res.data.rounds);
      setStartHP(res.data.start_hp);

      const teams = res.data.teams.reduce<Record<string, DuelsTeam>>((acc, item) => {
        acc[item.team.id] = item.team;
        return acc;
      }, {});
      setTeams(teams);

      const teamGuesses = res.data.teams.reduce<Record<string, DuelsSummaryGuess[][]>>(
        (acc, item) => {
          acc[item.team.id] = item.rounds.map((round) => round.guesses);
          return acc;
        },
        {},
      );
      setTeamGuesses(teamGuesses);

      const teamHP = res.data.teams.reduce<Record<string, number[]>>((acc, item) => {
        acc[item.team.id] = item.rounds.map((round) => round.hp);
        return acc;
      }, {});
      setTeamHP(teamHP);

      const userMap = res.data.teams.reduce<Record<string, Pick<DuelsUser, "team">>>(
        (acc, item) => {
          item.team.members.forEach((member) => {
            acc[member] = { team: item.team.id };
          });
          return acc;
        },
        {},
      );
      const usersQuery = res.data.teams.reduce<string>((acc, item) => {
        acc += "&username=" + item.team.members.join("&username=");
        return acc;
      }, "");
      const avatars = await api.get<UserProfile[]>(`/account/avatar?${usersQuery}`);
      avatars.data.forEach((avatar) => {
        userMap[avatar.username] = { ...userMap[avatar.username], ...avatar };
      });
      setUsers(userMap as Record<string, DuelsUser>);

      const thisUser = await api.get<CurrentUserResponse>("/account/user");
      setThisUser(thisUser.data.user);

      setLoading(false);
    }
    fetchData();
  }, []);

  const socket = useDuelsSocket({ id, state });
  if (loading) {
    return <Loading />;
  }
  return (
    <ProtectedRoutes>
      <DuelsSummary
        users={users}
        thisUser={thisUser}
        startHP={startHP}
        teams={teams}
        teamHP={teamHP}
        teamGuesses={teamGuesses}
        locations={locations}
      >
        <div className="duels-summary-header-container">
          <div></div>
          <div className="duels-summary-header">Game Summary</div>
          <div className="duels-summary-back-to-party-wrapper">
            <button className="btn-primary" onClick={() => router.push(`/party`)}>
              Back To Party
            </button>
          </div>
        </div>
      </DuelsSummary>
    </ProtectedRoutes>
  );
}
