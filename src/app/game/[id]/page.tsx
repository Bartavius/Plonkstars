import ProtectedRoutes from "@/app/ProtectedRoutes";
import MatchPage from "./gameplay";

export default function Page() {
  return (
    <ProtectedRoutes>
      <MatchPage />
    </ProtectedRoutes>
  );
}