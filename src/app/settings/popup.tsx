import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./page.css";

interface PopupProps {
  message?: string;
  duration?: number; 
  fadeOut: boolean;
}

export default function Popup({ message, duration = 3000, fadeOut}: PopupProps) {
  return (
    <div className={`settings-popup ${fadeOut ? "opacity-0" : "opacity-100"}`}>
        {message}
    </div>
  );
}