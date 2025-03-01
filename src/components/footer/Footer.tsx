import { FaGithub } from "react-icons/fa";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <p>© 2025 Jirath "Bart" Lojanarungsiri and Patrick Zhang. All rights reserved.</p>
        <p className="about-text">
          Just a group of friends building awesome projects together because we can.
        </p>
        <div className="footer-links flex justify-center items-center text-center">
          <a className="mx-6 flex items-center bg-purple-700 py-2 px-3 transition ease hover:scale-110 rounded-md" href="https://github.com/Bartavius/Plonkstars" target="_blank" rel="noopener noreferrer"><FaGithub className="text-3xl mr-3"/>Frontend Repo</a>
          <a className="mx-6 flex items-center bg-blue-600 py-2 px-3 transition ease hover:scale-110 rounded-md" href="https://github.com/pzhang345/PlonkStarsBackend" target="_blank" rel="noopener noreferrer"><FaGithub className="text-3xl mr-3"/>Backend Repo</a>
        </div>
      </div>
    </footer>
  );
}
