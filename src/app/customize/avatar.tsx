import "./page.css";
import colorPresets from "./avatar.json";
import { useEffect, useState } from "react";
import api from "@/utils/api";

interface UserIcon {
  hue: number;
  saturation: number;
  brightness: number;
}

const MAX_HUE = 360;
const MAX_SATURATION = 300;
const MAX_BRIGHTNESS = 200;

export default function AvatarCustom({
  setMessage,
}: {
  setMessage: (message: string) => void;
}) {
  const [userIconDefault, setUserIconDefault] = useState<UserIcon>({
    hue: 0,
    saturation: 150,
    brightness: 100,
  });
  const [userIcon, setUserIcon] = useState<UserIcon>({
    hue: userIconDefault.hue,
    saturation: userIconDefault.saturation,
    brightness: userIconDefault.brightness,
  });
  const [loading, setLoading] = useState(true);

  const handleSliderChange = (property: string, value: number) => {
    setUserIcon((prev) => ({
      ...prev,
      [property]: value,
    }));
  };

  const handlePresetClick = (preset: UserIcon) => {
    setUserIcon({
      hue: preset.hue,
      saturation: preset.saturation,
      brightness: preset.brightness,
    });
  };

  const getFilterStyle = () => {
    return `hue-rotate(${userIcon.hue}deg) 
                saturate(${userIcon.saturation}%) 
                brightness(${userIcon.brightness}%)`;
  };

  const saveAvatarChanges = async () => {
    await api.put("/account/profile/avatar-customize", userIcon);
    setMessage("Avatar changes saved!");
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
        });
        setUserIcon({
          hue: data.hue,
          saturation: data.saturation,
          brightness: data.brightness,
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
          <img
            src="/PlonkStarsAvatar.png"
            alt="avatar-icon-preview"
            className="avatar-icon"
            style={{ filter: getFilterStyle() }}
          />
        </div>

        {/* Right side: Color adjustment controls */}
        <div className="color-controls">
          <div className="text-center">
            <span className="">Set Colors</span>
            <div className="text-center justify-center flex">
              <div className="color-presets">
                {colorPresets.map((preset) => (
                  <div
                    className="flex-column align-center justify-center"
                    key={preset.name}
                  >
                    <label htmlFor={preset.name}>{preset.name}</label>
                    <div
                      id={preset.name}
                      key={preset.name}
                      className="color-preset justify-center flex"
                      style={{ backgroundColor: preset.color }}
                      onClick={() => handlePresetClick(preset)}
                      title={preset.name}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Hue adjustment */}
          <div className="control-group">
            <label htmlFor="hue-slider">Hue</label>
            <div className="slider-wrapper">
              <div
                className="hue-slider-background"
                style={{
                  filter: `saturate(${userIcon.saturation}%) brightness(${userIcon.brightness}%)`,
                }}
              />
              <input
                id="hue-slider"
                type="range"
                min="0"
                max={`${MAX_HUE}`}
                value={userIcon.hue}
                className="slider hue-slider"
                onChange={(e) =>
                  handleSliderChange("hue", parseInt(e.target.value))
                }
              />
            </div>
            <span className="value-display">{userIcon.hue}°</span>
          </div>

          {/* Saturation adjustment */}
          <div className="control-group">
            <label htmlFor="saturation-slider">Saturation</label>
            <div className="slider-wrapper">
              <div
                className="saturation-slider-background slider"
                style={{ filter: `hue-rotate(${userIcon.hue}deg) ` }}
              />
              <input
                id="saturation-slider"
                type="range"
                min="0"
                max={`${MAX_SATURATION}`}
                value={userIcon.saturation}
                className="slider saturation-slider"
                onChange={(e) =>
                  handleSliderChange("saturation", parseInt(e.target.value))
                }
              />
            </div>
            <span className="value-display">{userIcon.saturation}%</span>
          </div>

          {/* Brightness adjustment */}
          <div className="control-group">
            <label htmlFor="brightness-slider">Brightness</label>
            <div className="slider-wrapper">
              <div
                className="brightness-slider-background"
                style={{
                  filter: `hue-rotate(${userIcon.hue}deg) saturate(${userIcon.saturation}%)`,
                }}
              />
              <input
                id="brightness-slider"
                type="range"
                min="0"
                max={`${MAX_BRIGHTNESS}`}
                value={userIcon.brightness}
                className="slider brightness-slider"
                onChange={(e) =>
                  handleSliderChange("brightness", parseInt(e.target.value))
                }
              />
            </div>
            <span className="value-display">{userIcon.brightness}%</span>
          </div>
        </div>
      </div>
      <div>
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
  );
}
