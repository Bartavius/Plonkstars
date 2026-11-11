import type { PartyMember } from "./party-member";

export interface PartyUsersResponse {
  members: PartyMember[];
  host: string;
  this: string;
}
