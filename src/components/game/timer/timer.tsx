import { useEffect, useState } from "react";
import "./timer.css";
import colorGradient from "@/components/colorGradient";
const Timer = ({
    time,
    timeLimit,
    offset = 0,
    timeoutFunction,
  }: {
    time: Date;
    timeLimit: number;
    offset?: number;
    timeoutFunction?: () => void;
  }) => {
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [percentRemaining, setPercentRemaining] = useState<number>(1);
    useEffect(() => {
        function updateTimer() {
            const now = new Date().getTime() + offset;
            const remaining = ((time.getTime() - now) / 1000);
            setTimeLeft(Math.max(remaining, 0));
            setPercentRemaining(Math.max(remaining, 0) / timeLimit);
            if (remaining < -1){
              timeoutFunction && timeoutFunction();
              clearInterval(intervalId);
            }
        }
        const intervalId = setInterval(updateTimer, 100);
        updateTimer(); 
        return () => clearInterval(intervalId);
      }, [time, timeLimit, timeoutFunction]);
    
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = Math.floor(timeLeft % 60);

    return (
      <div className="timer-container">
        <div
            className="timer-fill"
            style={{ 
                maxWidth: `${percentRemaining * 100}%`,
                background: colorGradient({percent:percentRemaining}),
                zIndex: 1 
            }}
        />
            
        <div className="timer-box relative">
          {timeLeft >= 0 && (
                  <div className="timer-text">{hours!=0 && <label>{hours}:</label>}
                  {minutes.toString().padStart(2,"0")}:{seconds.toString().padStart(2,"0")}</div>
              )
          }
          {timeLeft < 0 && 
              <b className="timer-text">00:00</b>
          }
        </div>
      </div>
    );
}

export default Timer;
