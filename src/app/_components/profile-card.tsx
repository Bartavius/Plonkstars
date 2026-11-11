import Image from "next/image";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import "./profile-card.css";
import { Sigmar } from "next/font/google";

const sigmar = Sigmar({ subsets: ["latin"], weight: "400" });
interface ProfileCardProps {
  name: string;
  title: string;
  body: string;
  image: string;
  linkedin: string;
  github: string;
}

function ProfileCard({ name, title, body, image, linkedin, github }: ProfileCardProps) {
  return (
    <div
      className={`w-[90%] max-w-[400px] h-auto bg-[linear-gradient(to_bottom,var(--lighter-blue)_0%,var(--lightest-blue)_20%,var(--theme-blue)_100%)] rounded-[2dvh] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.1)] flex flex-col scale-100 [transition:transform_0.3s_ease,box-shadow_0.3s_ease,background-position_0.5s_ease-in-out] m-auto tracking-[0.05rem] bg-[length:200%_auto] bg-[position:left_top] hover:scale-[1.05] hover:shadow-[0_10px_15px_rgba(0,0,0,0.2)] hover:animate-[fancy_0.5s_ease-in-out] hover:bg-[position:right_bottom] min-[980px]:flex-row min-[980px]:max-w-[600px] max-[980px]:flex max-[980px]:items-center max-[980px]:justify-center ${sigmar.className}`}
    >
      <div className="profile-card-image max-w-[180px] overflow-hidden flex items-center justify-center max-[980px]:max-w-[250px] max-[980px]:max-h-[250px] max-[980px]:rounded-[50%] max-[980px]:border-white max-[980px]:border-[3px] max-[980px]:m-[3vw]">
        <Image src={image} alt={name} width={180} height={360} />
      </div>
      <div className="flex flex-col flex-1 text-center p-4">
        <div className="profile-card-name-container">
          <div className="text-[1.3rem] font-bold mb-[0.25dvh] tracking-[0.08rem] text-plonk-stars-red !opacity-100 text-center">
            {name}
          </div>
        </div>

        <div className="text-[0.875rem] text-[#7b747f] mb-[0.5dvh] text-center">{title}</div>
        <div className="text-darker-blue text-[1rem] grow overflow-y-auto max-h-[20dvh] mb-[1dvh] [font-family:monospace] font-extrabold tracking-[0.01rem] p-4">
          {body}
        </div>
        <div className="profile-card-footer p-[1dvh] mt-auto flex justify-center items-center gap-2 flex-wrap">
          <a href={linkedin} target="_blank" className="flex items-center mr-1">
            <button className="flex items-center space-x-2">
              <FaLinkedin className="text-2xl" />
              <span>LinkedIn</span>
            </button>
          </a>
          <a href={github} target="_blank" className="ml-1">
            <button className="flex items-center space-x-2">
              <FaGithub className="text-2xl" />
              <span>GitHub</span>
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}

export { ProfileCard };
