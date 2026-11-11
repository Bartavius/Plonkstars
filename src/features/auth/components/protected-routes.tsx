'use client';
import { setBlockedURL, setError } from "@/store/error-slice";
import { isAuthenticated, isDemo } from "@/features/auth/services/session";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

export default function ProtectedRoutes({
    children, 
    allowDemo = false
}: {
    children: React.ReactNode, 
    allowDemo?: boolean
}) {
    const isAuth = isAuthenticated();
    const demo = isDemo();
    const dispatch = useDispatch();
    const router = useRouter();
    if (isAuth === false || (allowDemo === false && demo)) {
        if ((allowDemo === false && demo)){
            dispatch(setError("Login to access this feature"));
        }
        else{
            dispatch(setError("Login required"));
        }
        dispatch(setBlockedURL(window.location.pathname));
        router.push("/account/login");
    }
    return <>{children}</>;
}