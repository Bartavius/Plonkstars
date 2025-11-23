import { ReactNode, useRef, useState } from "react";
import "./Modal.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [clickedOutside, setClickedOutside] = useState(false);

  if (!isOpen) return null;

  const handleBackgroundMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // If the user clicked directly on the backdrop, close the modal
    if (e.target === modalRef.current) {
      setClickedOutside(true);
    }
  };

  const handleBackgroundMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === modalRef.current && clickedOutside) {
      onClose();
    }
    setClickedOutside(false);
  }

  return (
    <div 
      ref={modalRef}
      onMouseDown={handleBackgroundMouseDown}
      onMouseUp={handleBackgroundMouseUp}
      style={{ zIndex: 100 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center flex-col items-center"
    >
      <div className="navbar-buffer"/>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <button className="float-right text-xl font-bold" onClick={onClose}>
          &times;
        </button>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;