import { FaCrown } from "react-icons/fa";

import { UserIcon } from "@/features/user/components/user-icon";
import type { PartyMember } from "@/app/party/_types/party-member";
import "./user-card.css";
interface UserCardProps {
  data: Pick<PartyMember, "username" | "user_cosmetics">;
  className?: string;
  leader?: boolean;
  children?: React.ReactNode;
}

function UserCard({ data, className = "", leader = false, children }: UserCardProps) {
  return (
    <div className={`user-card-card ${className}`}>
      <div className="user-card-user-icon">
        <UserIcon data={data.user_cosmetics} />
      </div>
      <div className="user-card-username">
        {leader && <FaCrown className="gold-name" />}
        {data.username}
      </div>
      {children}
    </div>
  );
}

export { UserCard };
