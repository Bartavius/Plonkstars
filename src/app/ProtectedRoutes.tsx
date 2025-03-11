'use client';
import { redirect } from "next/navigation";
import { useSelector } from "react-redux";

export default function ProtectedRoutes({children}: Readonly<{children: React.ReactNode}>) {
    const { isAuthenticated } = useSelector((state: any) => state.auth);
    if (isAuthenticated === false) {
        redirect("/account/login");
    }
    return <>{children}</>;
}