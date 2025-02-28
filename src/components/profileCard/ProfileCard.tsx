import "./ProfileCard.css";
import { Sigmar } from "next/font/google";
import { FaLinkedin, FaGithub } from "react-icons/fa";

const sigmar = Sigmar({ subsets: ["latin"], weight: "400" });

export default function ProfileCard({
  name,
  title,
  body,
  image,
  linkedin,
  github
}: {
  name: string;
  title: string;
  body: string;
  image: string;
  linkedin: string;
  github: string;
}) {
  return (
    <div className={`profile-card-container ${sigmar.className}`}>
      <div className="profile-card-image">
        <img src={`${image}`} alt={name} />
      </div>
      <div className="profile-card-content">
        <div className="profile-card-name-container">
          <div className="profile-card-name">{name}</div>
        </div>

        <div className="profile-card-title">{title}</div>
        <div className="profile-card-body">{body}</div>
        <div className="profile-card-footer flex justify-center items-center">
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