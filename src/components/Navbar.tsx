'use client';
import { Sigmar } from "next/font/google";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { FiMenu } from "react-icons/fi";
import "./Navbar.css";

const sigmar = Sigmar({ subsets: ["latin"], weight: "400" });

export default function NavBar() {

  const router = useRouter();
  const auth = useSelector((state: any) => state.auth.isAuthenticated);
  let registeredTabs: { tab: string; link: string }[] = [
    { tab: "home", link: "/" },
  ];
  let unregisteredTabs: { tab: string; link: string }[] = [
    { tab: "home", link: "/" },
  ];

  if (auth !== null) {
    registeredTabs = [
      { tab: "Home", link: "/" },
      { tab: "Game", link: "/game" },
      { tab: "Maps", link: "/map" },
      { tab: "Customizations", link: "/customize" },
      { tab: "Shop", link: "/shop" },
      { tab: "Contacts", link: "/#contact" },
      { tab: "Logout", link: "/account/logout" },
    ];
    unregisteredTabs = [
      { tab: "Home", link: "/" },
      { tab: "Login", link: "/account/login" },
      { tab: "Register", link: "/account/register" },
    ];
  }

  const params = useParams();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className={`navbar ${sigmar.className} ${isMenuOpen ? "open" : ""}`}>
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
          {(auth ? registeredTabs : unregisteredTabs).map((tab) => (
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
              <label>{tab.tab}</label>
            </li>
            
          ))}
        </ul>
      </nav>
    </div>
  );
}
