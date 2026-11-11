import { useEffect, useState } from "react";

import { colorGradient } from "@/lib/color-gradient";
interface TimerProps {
  time: Date;
  timeLimit: number;
  offset?: number;
  timeoutFunction?: () => void;
}

function Timer({ time, timeLimit, offset = 0, timeoutFunction }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [percentRemaining, setPercentRemaining] = useState<number>(1);
  useEffect(() => {
    function updateTimer() {
      const now = new Date().getTime() + offset;
      const remaining = (time.getTime() - now) / 1000;
      setTimeLeft(Math.max(remaining, 0));
      setPercentRemaining(Math.max(remaining, 0) / timeLimit);
      if (remaining < -1) {
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
    <div className="relative min-w-20 w-full text-[large] overflow-hidden flex items-center">
      <div
        className="absolute w-full h-full bg-[#00ff00] opacity-80 transition-all duration-100 ease-linear z-[1]"
        style={{
          maxWidth: `${percentRemaining * 100}%`,
          background: colorGradient({ percent: percentRemaining }),
          zIndex: 1,
        }}
      />

      <div className="flex justify-center items-center w-full h-full text-white text-center z-[101] relative">
        {timeLeft >= 0 && (
          <div className="h-full px-8 font-bold bg-darkest-blue border-color-accent-gold border-solid border-2 border-t-0 rounded-bl-[10rem] rounded-br-[10rem]">
            {hours != 0 && <label>{hours}:</label>}
            {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
          </div>
        )}
        {timeLeft < 0 && (
          <b className="h-full px-8 font-bold bg-darkest-blue border-color-accent-gold border-solid border-2 border-t-0 rounded-bl-[10rem] rounded-br-[10rem]">
            00:00
          </b>
        )}
      </div>
    </div>
  );
}

export { Timer };
