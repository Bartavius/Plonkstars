import "./page.css";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import UserIcon from "@/components/user/UserIcon";
import constants from "@/app/constants.json";
import ColorSelection from "./selection/color";
import { UserIconCosmetics } from "@/types/userIconCosmetics";
import HatSelection from "./selection/hat";
import BodySelection from "./selection/body";
import FaceSelection from "./selection/face";

const MAX_HUE = constants.AVATAR_MAX_HUE;
const MAX_SATURATION = constants.AVATAR_MAX_SATURATION;
const MAX_BRIGHTNESS = constants.AVATAR_MAX_BRIGHTNESS;

enum Tabs {
  COLORS = "colors",
  HATS = "hats",
  BODY = "body",
  FACES = "faces",
}

const tabNames = [Tabs.COLORS, Tabs.HATS, Tabs.BODY, Tabs.FACES];

export default function AvatarCustom({
  setMessage,
}: {
  setMessage: (message: React.ReactNode) => void;
}) {
  const [userIconDefault, setUserIconDefault] = useState<UserIconCosmetics>({
    hue: 0,
    saturation: 150,
    brightness: 100,
  });
  const [userIcon, setUserIcon] = useState<UserIconCosmetics>({
    hue: userIconDefault.hue,
    saturation: userIconDefault.saturation,
    brightness: userIconDefault.brightness,
  });
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<Tabs>(Tabs.COLORS);

  const saveAvatarChanges = async () => {
    await api.put("/account/profile/avatar-customize", userIcon);
    setMessage("Avatar changes saved!");
  };

  const renderTabContent = (tab: Tabs) => {
    switch (tab) {
      case Tabs.COLORS:
        return <ColorSelection userIcon={userIcon} setUserIcon={setUserIcon} />;
      case Tabs.HATS:
        return <HatSelection userIcon={userIcon} setUserIcon={setUserIcon} />;
      case Tabs.BODY:
        return <BodySelection userIcon={userIcon} setUserIcon={setUserIcon} />;
      case Tabs.FACES:
        return <FaceSelection userIcon={userIcon} setUserIcon={setUserIcon} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchCosmetics = async () => {
      try {
        const response = await api.get("/account/profile");
        const profile = response.data;
        const data = profile.user_cosmetics;
        setUserIconDefault({
          hue: data.hue,
          saturation: data.saturation,
          brightness: data.brightness,
          // TODO: other cosmetic settings here
        });
        setUserIcon({
          hue: data.hue,
          saturation: data.saturation,
          brightness: data.brightness,
          // TODO: other cosmetic settings here
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user cosmetics:", error);
      }
    };
    fetchCosmetics();
  }, []);

  if (loading) {
    return <div className="loading">Loading Avatar Customization...</div>;
  }

  return (
    <div className="settings-box">
      <div className="settings-label">Avatar Customization</div>
      <div className="avatar-customizer-container">
        <div className="avatar-preview">
          <UserIcon data={userIcon} className="avatar-icon" />
        </div>
        <div className="avatar-customizer p-2 rounded-lg">
          <div className="flex justify-center">
            {tabNames.map((tab) => (
              <button
                key={tab}
                className={`sm:mx-0 sm:px-2 sm:py-1 sm:text-sm md:px-4 md:py-2 mx-1 bg-red md:text-md md:bold transition-colors duration-200 rounded-t-lg outline outline-2 ${
                  selectedTab === tab
                    
                    ? "outline-red-200 border-transparent text-red-200 hover:text-red-100 hover:outline-red-100"
                    : "outline-red text-red font-extrabold !bg-red-200"
                }`}
                onClick={() => setSelectedTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex w-full bg-red rounded-lg p-3">{renderTabContent(selectedTab)}</div>

          <div className="mt-5 flex justify-center">
            <button
              className="form-button-general mr-3"
              onClick={() =>
                setUserIcon({
                  hue: userIconDefault.hue,
                  saturation: userIconDefault.saturation,
                  brightness: userIconDefault.brightness,
                })
              }
            >
              Reset
            </button>
            <button
              className="form-button-selected"
              onClick={() => saveAvatarChanges()}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
