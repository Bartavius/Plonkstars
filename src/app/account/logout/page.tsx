'use client';
import { logout } from "@/redux/authSlice"
import { useRouter } from "next/navigation";
import { useEffect } from "react"
import { useDispatch } from "react-redux"

export default function Logout() {

    const dispatch = useDispatch();
    const router = useRouter();
    useEffect(() => {
        dispatch(logout());
        router.push("/");
    }, [dispatch])

    return (
        <div className="flex items-center justify-center min-h-screen text-dark">
            Logging you out...
        </div>
    )
}