"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useDuelsSocket } from "@/app/duels/_hooks/use-duels-socket";
import { ProtectedRoutes } from "@/features/auth/components/protected-routes";
import { DuelsResults } from "@/features/duels/components/results";
import { Loading } from "@/components/primitives/loading";
import { calculateOffset } from "@/lib/clock-offset";
import { api } from "@/services/api";
import type { DuelsGuess } from "@/features/duels/types/duels-guess";
import type { DuelsTeam } from "@/features/duels/types/duels-team";
import type { DuelsUser } from "@/features/duels/types/duels-user";
import type { UserProfile } from "@/features/user/types/user-profile";
import type { CurrentUserResponse } from "@/app/duels/_types/current-user-response";
import type { DuelsRoundResults } from "@/app/duels/_types/duels-round-results";
import type { DuelsState } from "@/app/duels/_types/duels-state";

interface TeamHP {
  hp: number;
  prev_hp: number;
}

export default function DuelsResultsPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const router = useRouter();

  const [location, setLocation] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });
  const [teams, setTeams] = useState<Record<string, DuelsTeam>>({});
  const [users, setUsers] = useState<Record<string, DuelsUser>>({});
  const [state, setState] = useState<string>();
  const [startHP, setStartHP] = useState<number>(0);
  const [teamGuesses, setTeamGuesses] = useState<Record<string, DuelsGuess[]>>({});
  const [roundNumber, setRoundNumber] = useState<number>(0);
  const [teamHP, setTeamHP] = useState<Record<string, TeamHP>>({});
  const [loading, setLoading] = useState(true);
  const [thisUser, setThisUser] = useState<string>("");
  const [multi, setMulti] = useState<number>(0);
  const [timeOffset, setTimeOffset] = useState<number>(0);
  const [nextRoundTime, setNextRoundTime] = useState<Date>(new Date());

  useEffect(() => {
    async function processState() {
      const state = await api.get<DuelsState>(`/game/state?id=${id}`);
      setState(state.data.state);
      setNextRoundTime(new Date(state.data.next_round!));
      return state;
    }
    async function fetchData() {
      setTimeOffset(await calculateOffset(processState));
      const res = await api.get<DuelsRoundResults>(`/game/results?id=${id}`);
      setLocation({ lat: res.data.lat, lng: res.data.lng });
      setStartHP(res.data.start_hp);
      setRoundNumber(res.data.round_number);
      setMulti(res.data.multi);

      const teams = res.data.teams.reduce<Record<string, DuelsTeam>>((acc, item) => {
        acc[item.team.id] = item.team;
        return acc;
      }, {});
      setTeams(teams);

      const teamGuesses = res.data.teams.reduce<Record<string, DuelsGuess[]>>((acc, item) => {
        acc[item.team.id] = item.guesses;
        return acc;
      }, {});
      setTeamGuesses(teamGuesses);

      const teamHP = res.data.teams.reduce<Record<string, TeamHP>>((acc, item) => {
        acc[item.team.id] = { hp: item.hp, prev_hp: item.prev_hp };
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

  const socket = useDuelsSocket({ id, state: state });

  if (loading) {
    return <Loading />;
  }

  return (
    <ProtectedRoutes>
      <DuelsResults
        teamGuesses={teamGuesses}
        location={location}
        users={users}
        teams={teams}
        startHP={startHP}
        multi={multi}
        roundNumber={roundNumber}
        thisUser={thisUser}
        teamHP={teamHP}
        timeOffset={timeOffset}
        nextRoundTime={nextRoundTime}
      />
    </ProtectedRoutes>
  );
}
