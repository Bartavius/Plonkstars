import type { Team } from "./team";

export interface PartyUserRemovedEvent {
  username: string;
}

export interface PartyLobbyJoinEvent {
  user: string;
}

export interface PartyTeamUpdateEvent extends Partial<Team> {
  id: string;
}

export interface PartyTeamUserEvent {
  id: string;
  username: string;
}

export interface PartyTeamDeleteEvent {
  id: string;
}
