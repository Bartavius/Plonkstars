"use client";

import { useRouter } from "next/navigation";
import Contacts from "./Contacts";
import { Sigmar } from "next/font/google";
import Footer from "@/components/footer/Footer";
import { useSelector } from "react-redux";
import "./page.css";

const sigmar = Sigmar({ subsets: ["latin"], weight: "400" });

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: any) => state.auth);

  const navigateToGame = () => {
    router.push(`/${isAuthenticated ? "game" : "account/login"}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div
        className="relative flex-grow z-10 flex flex-col items-center justify-center gap-8 px-4 text-center pt-24 sm:pt-28 md:pt-32"
        style={{ minHeight: "calc(100vh - 325px)" }}
      >
        <img src="logo.png" alt="Map of Temperate Climate" className="logoImage" />

        <h1 className={`${sigmar.className} font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl`}>
          <span className="text-[var(--plonk-stars-red)]">Plonk</span>
          <span className="text-[var(--plonk-stars-white)]"> Stars</span>
        </h1>
        <button
          className={`${sigmar.className} start-button flex text-2xl justify-center text-center align-center`}
          onClick={navigateToGame}
        >
          Get Started
        </button>
      </div>
      <img src="PlonkStarsMaps/map1.png" alt="Map of Temperate Climate" className="mapImage mapImageTemprate" />
      <img src="PlonkStarsMaps/map2.png" alt="Map of Red Sand Desert" className="mapImage mapImageCanyon" />
      <img src="PlonkStarsMaps/map3.png" alt="Map of Temperate Climate" className="mapImage mapImageCity" />
      <img src="PlonkStarsMaps/map4.png" alt="Map of Red Sand Desert" className="mapImage mapImageArchipelago" />

      <div className="relative w-full pt-48 sm:pt-56 md:pt-72">
        <svg
          className="absolute bottom-0 left-0 w-full h-auto min-h-[20vh] md:min-h-[25vh]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="var(--darker-blue)"
            fillOpacity="1"
            d="M0,160L40,176C80,192,160,224,240,213.3C320,203,400,149,480,149.3C560,149,640,203,720,202.7C800,203,880,149,960,112C1040,75,1120,53,1200,53.3C1280,53,1360,75,1400,85.3L1440,96L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
          />
        </svg>
      </div>

      <div id="contact" className="bg-[var(--darker-blue)] w-full -mt-2 pb-6 transition ease-in-out">
        <div className="mt-16">
          <div className="p-12">
            <span className={`${sigmar.className} font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl`}>
              Who we are
            </span>
            
            <div className="mt-12"><Contacts /></div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
