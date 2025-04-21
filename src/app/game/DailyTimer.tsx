import { useEffect, useState } from "react";

export default function DailyTimer(
    {
        time,
        onFinish,
    }:{
        time: Date
        onFinish: () => void
    }
){
    const date = new Date(time);
    const [second,setSeconds] = useState((date.getTime() - new Date().getTime()) / 1000)
    useEffect(()=>{
        const interval = setInterval(() => {
            setSeconds(() => {
                const remaining = ((date.getTime() - new Date().getTime()) / 1000) - 1;
                if (remaining <= 0) {
                    onFinish();
                    clearInterval(interval);
                    return 0;
                }
                return remaining;
            })
        }
        , 1000)
        return () => clearInterval(interval)
    },[time]);

    function formatTime(sec:number){
        const hours = Math.floor(sec / 3600);
        const minutes = Math.floor(sec / 60) % 60;
        const seconds = Math.floor(sec % 60);

        return `${hours.toString().padStart(2,"0")}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`
    }

    return <div>{formatTime(second)}</div>;
}