import type { UserIconCosmetics } from "@/features/cosmetics/types/user-icon-cosmetics";

export interface UserProfile {
  username: string;
  user_cosmetics: UserIconCosmetics;
}
