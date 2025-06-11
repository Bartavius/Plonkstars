import { useEffect, useState } from "react";
import "./timer.css";
import { after } from "node:test";
import { useSelector } from "react-redux";
const Timer = ({
    time,
    timeLimit,
    timeoutFunction,
  }: {
    time: Date;
    timeLimit: number;
    timeoutFunction?: () => void;
  }) => {
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [percentRemaining, setPercentRemaining] = useState<number>(1);

    const offset = useSelector((state: any) => state.time.offset);
    
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

    const getColor = (percent: number) => {
        
        const red = percent < .5 ? 255: 255 * (1 - ((percent - 0.5) * 2));
        const green = percent > .5 ? 255:255 * 2 * percent;
        return `rgb(${red},${green},0)`;
    };

    return (
      <div className="absolute timer-container">
        <div
            className="timer-fill"
            style={{ 
                maxWidth: `${percentRemaining * 100}%`,
                background: getColor(percentRemaining),
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
