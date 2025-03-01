import { Sigmar } from "next/font/google";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { FiMenu } from "react-icons/fi"; // Import the FiMenu icon

const sigmar = Sigmar({ subsets: ["latin"], weight: "400" });

export default function NavBar() {
  const auth = useSelector((state: any) => state.auth.isAuthenticated);
  let registeredTabs: { tab: string; link: string }[] = [{ tab: "home", link: "/" }];
  let unregisteredTabs: { tab: string; link: string }[] = [{ tab: "home", link: "/" }];
  
  if (auth !== null) {
    registeredTabs = [
      { tab: "home", link: "/" },
      { tab: "game", link: "/game" },
      { tab: "logout", link: "/account/logout" }
    ];
    unregisteredTabs = [
      { tab: "home", link: "/" },
      { tab: "login", link: "/account/login" },
      { tab: "register", link: "/account/register" }
    ];
  }

  const params = useParams();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className={`navbar ${sigmar.className}`}>
      <nav className="fixed top-0 left-0 w-full bg-black/30 backdrop-blur-lg shadow-md pb-2">
        <div className="mx-auto flex justify-between items-center p-4">
          <a href="/" className="text-xl font-bold text-gray-200">
            <span className="text-red-500">Plonk</span>Stars
          </a>
            <button onClick={toggleMenu} className="text-gray-200">
              <FiMenu size={24} />
            </button>
      
        </div>
        {isMenuOpen && <ul className="navbar-elements">
            {(auth ? registeredTabs : unregisteredTabs).map((tab) => (
              <li
                key={tab.tab}
                className={`navbar-element ${
                  Array.isArray(params) && params.includes(tab.tab)
                    ? "active"
                    : ""
                }`}
              >
                <a href={tab.link}>{tab.tab}</a>
              </li>
            ))}
          </ul>}
      </nav>
    </div>
  );
}
