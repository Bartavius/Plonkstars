import { useEffect, useState } from "react";
import "./timer.css";
const Timer = ({
    time,
    timeLimit,
    timeoutFunction,
  }: {
    time: Date;
    timeLimit: number;
    timeoutFunction: () => void;
  }) => {
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [percentRemaining, setPercentRemaining] = useState<number>(1);
    
    useEffect(() => {
        function updateTimer() {
            const remaining = ((time.getTime() - new Date().getTime()) / 1000) - 1;
            setTimeLeft(remaining);
            setPercentRemaining(remaining / timeLimit);
            if (remaining < 0) {
                clearInterval(intervalId);
                timeoutFunction();
            }
        }
        const intervalId = setInterval(updateTimer, 100);
        updateTimer(); 
        return () => clearInterval(intervalId);
      }, [time, timeLimit, timeoutFunction]);
    
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = Math.round(timeLeft % 60);

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
                    <b className="timer-text">{hours!=0 && <label>{hours}:</label>}
                    {minutes.toString().padStart(2,"0")}:{seconds.toString().padStart(2,"0")}</b>
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
