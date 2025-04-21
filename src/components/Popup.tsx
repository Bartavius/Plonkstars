import "./Popup.css";
import { useEffect, useState } from "react";

export default function Popup({ 
  message,
  duration = 2000, 
  fadeOut = 1000,
  background,
  color,
  update,
  className,
  type="info",
}: {
  update?: number;
  message?: string;
  duration?: number; 
  fadeOut?: number;
  background?: string;
  color?: string;
  className?: string;
  type?:string;
}) {
  const [popupFade, setPopupFade] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);

  switch (type) {
    case "error":
      className = "text-red-500 bg-red-100 border border-red-400";
      break;
    case "success":
      className = "text-green-500 bg-green-100 border border-green-400";
      break;
    case "info":
      className = "text-blue-500 bg-blue-100 border border-blue-400";
  }
  function showPopup() {
      if (show || !message) return;
      setShow(true);
      setPopupFade(false);

      setTimeout(() => {
          setPopupFade(true);
          setTimeout(() => {
            setShow(false);
          }, fadeOut);
      }, duration);
  };

  useEffect(() => {
    showPopup()
  }, [update, message]);

  return (
    <>
    {show && message && 
    <div className="popup-wrapper">
      <div className={`settings-popup ${popupFade ? "opacity-0" : "opacity-100"} ${className}`} style={{color,background}}>
          {message}
      </div>
    </div>
    }
   </>
  );
}