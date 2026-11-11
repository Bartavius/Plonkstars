"use client";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useDuelsSocket } from "@/app/duels/_hooks/use-duels-socket";
import { ProtectedRoutes } from "@/features/auth/components/protected-routes";
import { DuelsGameplay } from "@/features/duels/components/gameplay";
import { Loading } from "@/components/primitives/loading";
import { Popup } from "@/components/primitives/popup";
import { UserIcon } from "@/features/user/components/user-icon";
import { calculateOffset } from "@/lib/clock-offset";
import { api } from "@/services/api";
import type { DuelsStateTeam } from "@/features/duels/types/duels-state-team";
import type { DuelsUser } from "@/features/duels/types/duels-user";
import type { TeamMarker } from "@/features/duels/types/team-marker";
import type { RoundInfo } from "@/features/game/types/round-info";
import type { UserProfile } from "@/features/user/types/user-profile";
import type { DuelsState } from "@/app/duels/_types/duels-state";
import type { DuelsGuessEvent, DuelsTimeEvent } from "@/app/duels/_types/duels-socket-events";

export default function DuelsGamePage() {
  const users = useRef<Record<string, DuelsUser>>({});
  const [thisUser, setThisUser] = useState<string>("");
  const [teams, setTeams] = useState<Record<string, DuelsStateTeam>>({});
  const [teamPlonks, setTeamPlonks] = useState<Record<string, TeamMarker>>({});
  const [teamGuesses, setTeamGuesses] = useState<Record<string, TeamMarker>>({});
  const [roundInfo, setRoundInfo] = useState<RoundInfo>();
  const [loading, setLoading] = useState<boolean>(true);
  const [guesses, setGuesses] = useState<number>(0);
  const [maxGuesses, setMaxGuesses] = useState<number>(0);
  const [multi, setMulti] = useState<number>(0);
  const [maxHealth, setMaxHealth] = useState<number>(0);
  const [state, setState] = useState<string>();
  const [spectating, setSpectating] = useState<boolean>(false);
  const [canGuess, setCanGuess] = useState<boolean>(false);
  const [popupElement, setPopupElement] = useState<React.ReactNode>();
  const [time, setTime] = useState<DuelsTimeEvent>();
  const [offset, setOffset] = useState<number>(0);

  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";

  useEffect(() => {
    async function roundInfo() {
      const round = await api.get<RoundInfo>(`/game/round?id=${id}`);
      setRoundInfo(round.data);
      if ("time" in round.data) {
        setTime({
          time: round.data.time!,
          time_limit: round.data.time_limit!,
        });
      }
    }
    async function fetchData() {
      const state = await api.get<DuelsState>(`/game/state?id=${id}`);
      setState(state.data.state);
      if (state.data.state != "GUESSING") {
        return;
      }

      setThisUser(state.data.user!);
      setGuesses(state.data.guess_count!);
      setMaxGuesses(state.data.max_guesses!);
      setMulti(state.data.multi!);
      setSpectating(state.data.spectating!);
      setCanGuess(state.data.can_guess!);
      setMaxHealth(state.data.start_hp!);

      if (!state.data.spectating) {
        const plonks = state.data.plonks?.reduce<Record<string, TeamMarker>>((acc, item) => {
          acc[item.user] = item;
          return acc;
        }, {});
        setTeamPlonks(plonks!);

        const guesses = state.data.guesses!.reduce<Record<string, TeamMarker>>((acc, item) => {
          acc[item.user] = item;
          return acc;
        }, {});
        setTeamGuesses(guesses);
      }

      const teams = state.data.teams!.reduce<Record<string, DuelsStateTeam>>((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {});
      setTeams(teams);

      const userMap = state.data.teams!.reduce<Record<string, Pick<DuelsUser, "team">>>(
        (acc, item) => {
          item.members.forEach((member) => {
            acc[member] = { team: item.id };
          });
          return acc;
        },
        {},
      );
      const usersQuery = state.data.teams!.reduce<string>((acc, item) => {
        acc += "&username=" + item.members.join("&username=");
        return acc;
      }, "");
      const avatars = await api.get<UserProfile[]>(`/account/avatar?${usersQuery}`);
      avatars.data.forEach((avatar) => {
        userMap[avatar.username] = { ...userMap[avatar.username], ...avatar };
      });
      users.current = userMap as Record<string, DuelsUser>;

      setOffset(await calculateOffset(roundInfo));
      setLoading(false);
    }
    fetchData();
  }, []);

  const socketFunctions = {
    guess: (data: DuelsGuessEvent) => {
      if ("lat" in data && "lng" in data) {
        setTeamGuesses((prev) => ({ ...prev, [data.user]: data }));
        setTeamPlonks((prev) => {
          const prevCopy = { ...prev };
          delete prevCopy[data.user];
          return prevCopy;
        });
      } else {
        setGuesses((prev) => prev + 1);
        setPopupElement(
          <div className="flex flex-col justify-center items-center">
            <UserIcon className="w-[1rem]" data={users.current[data.user]} />
            <div>{data.user} guessed</div>
          </div>,
        );
      }
    },
    plonk: (data: TeamMarker) => {
      setTeamPlonks((prev) => ({ ...prev, [data.user]: data }));
    },
    time: (data: DuelsTimeEvent) => {
      setTime(data);
    },
  };

  const socket = useDuelsSocket({ id, state, functions: socketFunctions });
  if (loading) {
    return <Loading />;
  }

  return (
    <ProtectedRoutes>
      <Popup>{popupElement}</Popup>
      <DuelsGameplay
        id={id}
        users={users.current}
        thisUser={thisUser}
        teams={teams}
        teamPlonks={teamPlonks}
        teamGuesses={teamGuesses}
        roundInfo={roundInfo!}
        spectator={spectating}
        canGuess={canGuess}
        guesses={guesses}
        maxGuesses={maxGuesses}
        multi={multi}
        maxHealth={maxHealth}
        endTime={time && new Date(time.time)}
        timeLimit={time && time.time_limit}
        timeOffset={offset}
      />
    </ProtectedRoutes>
  );
}
