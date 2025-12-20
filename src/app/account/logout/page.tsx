'use client';
import { setError } from "@/redux/errorSlice";
import { logout } from "@/utils/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react"
import { useDispatch } from "react-redux"

export default function Logout() {
    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const router = useRouter();

    const error = searchParams.get("error");
    const redirectLink = searchParams.get("redirect");

    useEffect(() => {
        logout();
        if (error){
            dispatch(setError(error))
        }
        redirectLink? router.push(redirectLink): router.push("/");
    }, [dispatch])

    return (
        <div className="flex items-center justify-center min-h-screen text-white">
            Logging you out...
        </div>
    )
}