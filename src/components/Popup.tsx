import "./Popup.css";
import { useEffect, useState } from "react";

export default function Popup({ 
  message,
  duration = 2000, 
  fadeOut = 1000,
  background="black",
  color="white",
  update,
}: {
  update?: number;
  message?: string;
  duration?: number; 
  fadeOut?: number;
  background?: string;
  color?: string;
}) {
  const [popupFade, setPopupFade] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);

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
      <div className={`settings-popup ${popupFade ? "opacity-0" : "opacity-100"}`} style={{color,background}}>
          {message}
      </div>
    </div>
    }
   </>
  );
}