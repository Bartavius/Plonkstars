import type { UserProfile } from "@/features/user/types/user-profile";

export interface PartyMember extends UserProfile {
  in_lobby: boolean;
}
