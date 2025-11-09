import "./page.css";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import UserIcon from "@/components/user/UserIcon";
import ColorSelection from "./selection/color";
import { UserIconCosmetics } from "@/types/userIconCosmetics";
import HatSelection from "./selection/hat";
import BodySelection from "./selection/body";
import FaceSelection from "./selection/face";
import { CosmeticProps } from "@/types/cosmetics/CosmeticProps";
import { isDemo } from "@/utils/auth";
import { useDispatch, useSelector } from "react-redux";
import { setColor } from "@/redux/demoAvatarSlice";


enum Tabs {
  COLORS = "colors",
  HATS = "hats",
  BODY = "body",
  FACES = "faces",
}

const tabNames = [Tabs.COLORS, Tabs.HATS, Tabs.BODY, Tabs.FACES];

export default function AvatarCustom({
  setMessage,
  setType,
}: {
  setMessage: (message: React.ReactNode) => void;
  setType: (type: string) => void;
}) {
  const userDemoAvatar = {...useSelector((state:any) => state.demoAvatar), face: null, body: null, hat: null};
  const [userIconDefault, setUserIconDefault] = useState<UserIconCosmetics>({
    ...userDemoAvatar,
  });

  const [userIcon, setUserIcon] = useState<UserIconCosmetics>({
    ...userIconDefault
  });
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<Tabs>(Tabs.COLORS);

  const demo = isDemo();
  const dispatch = useDispatch();
  const saveAvatarChanges = async () => {
    if (demo) {
      console.log(userIcon);
      if(userIcon.face == null && userIcon.body === null && userIcon.hat === null){
        dispatch(setColor(userIcon));
        setType('success');
        setMessage("Avatar changes saved");
      }
      else{
        setType('error');
        setMessage("Cannot use cosmetics in demo mode.");
      }
    }else{
      try {
        const response = await api.put("/cosmetics/customize", userIcon);
        setType('success');
        setMessage(response.data.message);
      } catch (error: any) {
        setType('error');
        if (error.response && error.response.data && error.response.data.error) {
          
          setMessage(`${error.response.data.error}`);
        } else {
          setMessage("Failed to save avatar changes. Please try again.");
        }
      }
    }
  };
  

  const [facesOwned, setFacesOwned] = useState<CosmeticProps[]>([]);
  const [faces, setFaces] = useState<CosmeticProps[]>([]);

  const [bodiesOwned, setBodiesOwned] = useState<CosmeticProps[]>([]);
  const [bodies, setBodies] = useState<CosmeticProps[]>([]);

  const [hatsOwned, setHatsOwned] = useState<CosmeticProps[]>([]);
  const [hats, setHats] = useState<CosmeticProps[]>([]);

  const renderTabContent = (tab: Tabs) => {
    switch (tab) {
      case Tabs.COLORS:
        return <ColorSelection userIcon={userIcon} setUserIcon={setUserIcon} />;
      case Tabs.HATS:
        return (
          <HatSelection
            userIcon={userIcon}
            setUserIcon={setUserIcon}
            hatsUnowned={hats}
            hatsOwned={hatsOwned}
          />
        );
      case Tabs.BODY:
        return (
          <BodySelection
            userIcon={userIcon}
            setUserIcon={setUserIcon}
            bodiesUnowned={bodies}
            bodiesOwned={bodiesOwned}
          />
        );
      case Tabs.FACES:
        return (
          <FaceSelection
            userIcon={userIcon}
            setUserIcon={setUserIcon}
            facesUnowned={faces}
            facesOwned={facesOwned}
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchCosmetics = async () => {
      // might eventually have to limit amounts queried once cosmetics scale
      const { data } = await api.get("/cosmetics/all");
      setFaces(data.unowned_faces);
      setFacesOwned(data.owned_faces);
      setBodies(data.unowned_bodies);
      setBodiesOwned(data.owned_bodies);
      setHats(data.unowned_hats);
      setHatsOwned(data.owned_hats);
    };

    const fetchEquippedCosmetics = async () => {
      try {
        let data;
        if (demo) {
          data = userDemoAvatar;
        } else {
          const response = await api.get("/account/avatar");
          data = response.data.user_cosmetics;
        }
        
        setUserIconDefault({
          hue: data.hue,
          saturation: data.saturation,
          brightness: data.brightness,
          face: data.face,
          body: data.body,
          hat: data.hat,
        });
        setUserIcon({
          hue: data.hue,
          saturation: data.saturation,
          brightness: data.brightness,
          face: data.face,
          body: data.body,
          hat: data.hat,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user cosmetics:", error);
      }
    };
    fetchEquippedCosmetics();
    fetchCosmetics();
  }, []);

        // TODO: user face/body/hat is not being queried properly here

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

          <div className="flex w-full bg-red rounded-lg p-3 max-h-[70vh]">
            {renderTabContent(selectedTab)}
          </div>

          <div className="mt-5 flex justify-center">
            <button
              className="form-button-general mr-3"
              onClick={() =>
                setUserIcon({
                  hue: userIconDefault.hue,
                  saturation: userIconDefault.saturation,
                  brightness: userIconDefault.brightness,
                  face: userIconDefault.face,
                  body: userIconDefault.body,
                  hat: userIconDefault.hat,
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
