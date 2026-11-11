import type { UserProfile } from "@/features/user/types/user-profile";

export interface DuelsUser extends UserProfile {
  team: string;
}
