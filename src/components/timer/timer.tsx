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
    const [timeLeft, setTimeLeft] = useState<number>(-1);
    const [percentRemaining, setPercentRemaining] = useState<number>(-1);
    
    useEffect(() => {
        function updateTimer() {
          const remaining = Math.round((time.getTime() - new Date().getTime()) / 1000) - 1;
          setTimeLeft((prevTimeLeft) => {
            setPercentRemaining(Math.round((remaining / timeLimit) * 1000));
            if (remaining === 0) {
              clearInterval(intervalId);
              timeoutFunction();
            }
            return remaining;
          });
        }
    
        const intervalId = setInterval(updateTimer, 1000);
        updateTimer(); // Run immediately to avoid waiting 1 second
        return () => clearInterval(intervalId); // Cleanup on unmount
      }, [time, timeLimit, timeoutFunction]);
    
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    return (
      <div className="absolute timer-container">
        <div
            className="timer-fill"
            style={{ maxWidth: `${percentRemaining}%`,zIndex: 1 }}
        />
            
          <div className="timer-box relative" style={{zIndex: 2}}>
            {timeLeft >= 0 && (
                    <b className="timer-text">{hours!=0 && <label>{hours}:</label>}
                    {minutes.toString().padStart(2,"0")}:{seconds.toString().padStart(2,"0")}</b>
                )
            }
        </div>
      </div>
    );
}

export default Timer;
