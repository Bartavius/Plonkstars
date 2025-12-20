'use client';
import { Sigmar } from "next/font/google";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FiMenu } from "react-icons/fi";
import "./Navbar.css";
import { isAuthenticated, isDemo } from "@/utils/auth";

const sigmar = Sigmar({ subsets: ["latin"], weight: "400" });

export default function NavBar() {

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
  ]

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
    setIsMenuOpen(prev => !prev);
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
    <div className={`navbar ${sigmar.className} ${isMenuOpen ? "open" : ""}`} ref={menuRef}>
      <nav className="nav-header">
        <div className="mx-auto flex justify-between items-center p-4 navbar-primary">
          <a href="/" className="text-xl font-bold text-gray-200 nav-logo">
            <span className="text-red">Plonk</span>Stars
          </a>
          <button
            onClick={toggleMenu}
            className={`text-gray-200 hamburger ${
              isMenuOpen && "hamburger-active"
            }`}
          >
            <FiMenu size={24} />
          </button>
        </div>
        <ul className={`navbar-elements ${isMenuOpen && "navbar-elements-open"}`}>
          {(auth ? (demo? demoTabs: registeredTabs) : unregisteredTabs).map((tab) => (
            <li
              onClick={()=>{
                router.push(tab.link);
                setIsMenuOpen(false);
              }}
              key={tab.tab}
              className={`navbar-element ${
                Array.isArray(params) && params.includes(tab.tab)
                  ? "active"
                  : ""
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
