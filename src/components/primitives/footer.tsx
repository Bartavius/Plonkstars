import { FaGithub } from "react-icons/fa";
import "./footer.css";

function Footer() {
  return (
    <footer className="footer-container bg-[linear-gradient(135deg,var(--theme-blue),var(--lightest-blue))] p-8 text-center text-white [font-family:Arial,sans-serif] opacity-100 max-[600px]:p-4">
      <div className="italic text-[0.9rem] mb-4 text-darker-blue">
        <p className="italic text-[0.9rem] mb-4 text-darker-blue">
          Just a group of friends building awesome projects together because we can.
        </p>
        <div className="flex justify-center items-center text-center text-[var(--plonk-stars-white)] max-[600px]:flex-col max-[600px]:text-lightest-blue max-[600px]:gap-4">
          <a
            className="mx-6 flex items-center bg-[var(--darker-blue)] text-white py-2 px-3 transition ease hover:scale-110 rounded-md"
            href="https://github.com/Bartavius/Plonkstars"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub className="text-3xl mr-3" />
            Frontend Repo
          </a>
          <a
            className="mx-6 flex items-center bg-[var(--plonk-stars-red)] text-white py-2 px-3 transition ease hover:scale-110 rounded-md"
            href="https://github.com/pzhang345/PlonkStarsBackend"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub className="text-3xl mr-3" />
            Backend Repo
          </a>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
