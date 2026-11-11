import { FaCrown } from "react-icons/fa";

import { UserIcon } from "@/features/user/components/user-icon";
import type { PartyMember } from "@/app/party/_types/party-member";
interface UserCardProps {
  data: Pick<PartyMember, "username" | "user_cosmetics">;
  className?: string;
  leader?: boolean;
  children?: React.ReactNode;
}

function UserCard({ data, className = "", leader = false, children }: UserCardProps) {
  return (
    <div
      className={`relative bg-dark-blue rounded-2xl flex flex-col items-center justify-center gap-2 ${className}`}
    >
      <div className="w-full p-[20%] pb-[0%]">
        <UserIcon data={data.user_cosmetics} />
      </div>
      <div className="bg-darker-blue rounded-2xl rounded-t-none px-2 h-12 w-full flex items-center justify-center flex-col gap-[0.2rem] text-[0.75rem]">
        {leader && <FaCrown className="text-leaderboard-yellow" />}
        {data.username}
      </div>
      {children}
    </div>
  );
}

export { UserCard };
