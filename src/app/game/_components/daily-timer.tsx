import { useEffect, useState } from "react";

export default function DailyTimer(
    {
        time,
        offset = 0,
        onFinish,
    }:{
        time: Date
        offset?: number
        onFinish: () => void
    }
){
    const date = new Date(time).getTime();
    const [second,setSeconds] = useState((date - (new Date().getTime() + offset)) / 1000)
    useEffect(()=>{
        const interval = setInterval(() => {
            setSeconds(() => {
                const now = new Date().getTime() + offset;
                const remaining = ((date - now) / 1000);
                if (remaining < -1) {
                    onFinish();
                    clearInterval(interval);
                }

                if (remaining < 0) {
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