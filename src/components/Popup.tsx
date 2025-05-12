import "./Popup.css";
import { useEffect, useState } from "react";

export default function Popup({ 
  duration = 2000, 
  fadeOut = 1000,
  background,
  color,
  update,
  className,
  type="info",
  children
}: {
  update?: number;
  duration?: number; 
  fadeOut?: number;
  background?: string;
  color?: string;
  className?: string;
  type?:string;
  children?: React.ReactNode;
}) {
  const [popupFade, setPopupFade] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  
  switch (type) {
    case "error":
      className += " text-red-500 bg-red-100 border border-red-400 z-100";
      break;
    case "success":
      className += " text-green-500 bg-green-100 border border-green-400 z-100";
      break;
    case "info":
      className += " text-blue-500 bg-blue-100 border border-blue-400 z-100";
  }
  
  function showPopup() {
      if (show || !children) return;
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
  }, [update, children]);

  return (
    <>
    {show && 
    <div className="popup-wrapper">
      <div className={`settings-popup ${popupFade ? "opacity-0" : "opacity-100"} ${className}`} style={{color,background}} onClick={() => setShow(false)}>
          {children}
      </div>
    </div>
    }
   </>
  );
}