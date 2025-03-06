import { useState } from "react";
import "./timer.css";
const Timer = ({
    time,
    timeoutFunction,
  }: {
    time: Date;
    timeoutFunction: () => void;
  }) => {
    const [timeLeft, setTimeLeft] = useState(Math.round((time.getTime() - new Date().getTime())/1000) - 1);
    console.log(time,new Date(),timeLeft);

    function updateTimer() {
        setTimeLeft(Math.round((time.getTime() - new Date().getTime())/1000) - 1);
        if (timeLeft == 0) {
            clearInterval(intervalId);
            timeoutFunction();
        }

    }
    const intervalId = setInterval(updateTimer, 1000);
 
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    return (
      <div className="timer-container">
        <div className="timer-box">
          <div className="timer">
            <b>{hours!=0 && <label>{hours}:</label>}
            {minutes.toString().padStart(2,"0")}:{seconds.toString().padStart(2,"0")}</b>
          </div>
        </div>
      </div>
    );
}

export default Timer;
