"use client";
import { Sigmar } from "next/font/google";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FiMenu } from "react-icons/fi";

import { isAuthenticated, isDemo } from "@/features/auth/services/session";
import "./navbar.css";

const sigmar = Sigmar({ subsets: ["latin"], weight: "400" });

function NavBar() {
  const router = useRouter();
  const auth = isAuthenticated();
  const demo = isDemo();

  const registeredTabs = [
    { tab: "Home", link: "/" },
    { tab: "Game", link: "/game" },
    { tab: "Maps", link: "/map" },
    { tab: "Customizations", link: "/customize" },
    { tab: "Shop", link: "/shop" },
    { tab: "Contacts", link: "/#contact" },
    { tab: "Logout", link: "/account/logout" },
  ];

  const demoTabs = [
    { tab: "Home", link: "/" },
    { tab: "Game", link: "/game" },
    { tab: "Maps", link: "/map" },
    { tab: "Customizations", link: "/customize" },
    { tab: "Login", link: "/account/login" },
    { tab: "Register", link: "/account/register" },
    { tab: "Contacts", link: "/#contact" },
  ];

  const unregisteredTabs = [
    { tab: "Home", link: "/" },
    { tab: "Login", link: "/account/login" },
    { tab: "Register", link: "/account/register" },
    { tab: "Contacts", link: "/#contact" },
  ];

  const params = useParams();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className={`z-[100] fixed w-full ${sigmar.className}`} ref={menuRef}>
      <nav className="relative top-0 left-0 w-full bg-[rgba(0,0,0,0.3)] [backdrop-filter:blur(10px)] [-webkit-backdrop-filter:blur(10px)] shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-[background-color] duration-200 ease-[ease-in-out]">
        <div className="mx-auto flex justify-between items-center p-4 h-[var(--navbar-height)]">
          <Link href="/" className="text-xl font-bold text-gray-200 nav-logo">
            <span className="text-red">Plonk</span>Stars
          </Link>
          <button
            onClick={toggleMenu}
            className={`text-gray-200 hamburger ${isMenuOpen && "hamburger-active"}`}
          >
            <FiMenu size={24} />
          </button>
        </div>
        <ul
          className={`list-none flex flex-col m-0 p-0 ${isMenuOpen ? "max-h-screen" : "max-h-0"} overflow-hidden transition-[max-height] duration-200 ease-[ease-in-out]`}
        >
          {(auth ? (demo ? demoTabs : registeredTabs) : unregisteredTabs).map((tab) => (
            <li
              onClick={() => {
                router.push(tab.link);
                setIsMenuOpen(false);
              }}
              key={tab.tab}
              className={`navbar-element relative text-plonk-stars-white uppercase cursor-pointer p-[10px] pl-16 hover:text-plonk-stars-red ${
                Array.isArray(params) && params.includes(tab.tab) ? "active" : ""
              }`}
            >
              <div>{tab.tab}</div>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export { NavBar };
