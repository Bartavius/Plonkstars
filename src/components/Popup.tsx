import "./Popup.css";
import { useEffect, useRef, useState } from "react";

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
  type?:string | null;
  children?: React.ReactNode;
}) {
  const [popupFade, setPopupFade] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
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
  
    function clearTimeouts() {
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = null;
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }

  function showPopup() {
    if (show || !children) return;
    clearTimeouts();

    setShow(true);
    setPopupFade(false);

    fadeTimeoutRef.current = setTimeout(() => {
      setPopupFade(true);
      hideTimeoutRef.current = setTimeout(() => {
        setShow(false);
      }, fadeOut);
    }, duration);
  }

  useEffect(() => {
    showPopup();

    // Clean up on unmount or prop change
    return () => clearTimeouts();
  }, [update, children]);

  function handleClick() {
    clearTimeouts();
    setShow(false);
  }

  return (
    <>
    {show && 
    <div className="popup-wrapper">
      <div className={`settings-popup ${popupFade ? "opacity-0" : "opacity-100"} ${className}`} onClick={handleClick}>
          {children}
      </div>
    </div>
    }
   </>
  );
}