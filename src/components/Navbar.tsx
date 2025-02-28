import { Sigmar } from "next/font/google";

const sigmar = Sigmar({ subsets: ["latin"], weight: "400" });

export default function NavBar() {
  const tabs = [
    { tab: "Singleplayer", link: "/game" },
    { tab: "Login", link: "/login" },
    // { tab: "Contact", link: "/contact"}
  ];

  return (
    <div className={`navbar ${sigmar.className}`}>
      <nav className="fixed top-0 left-0 w-full bg-black/30 backdrop-blur-lg shadow-md pb-2">
        <div className="container mx-auto flex justify-between items-center p-4">
          <a href="/" className="text-xl font-bold text-gray-200">
            <span className="text-red-500">Plonk</span>Stars
          </a>
          <ul className="flex space-x-6">
            {tabs.map((tab) => (
              <li key={tab.tab} className="relative hover:text-gray-300">
                <a href={tab.link}>{tab.tab}</a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}

