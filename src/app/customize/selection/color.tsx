import colorPresets from "@/app/customize/selection/colorPresets.json";
import constants from "@/app/constants.json";
import { UserIconCosmetics } from "@/types/userIconCosmetics";

const MAX_HUE = constants.AVATAR_MAX_HUE;
const MAX_SATURATION = constants.AVATAR_MAX_SATURATION;
const MAX_BRIGHTNESS = constants.AVATAR_MAX_BRIGHTNESS;

export default function ColorSelection({
    userIcon,
  setUserIcon,
}: {
    userIcon: UserIconCosmetics;
  setUserIcon: (icon: UserIconCosmetics) => void;
}) {
  const handleSliderChange = (property: string, value: number) => {
    setUserIcon({ ...userIcon, [property]: value });
  };

  const handlePresetClick = (preset: UserIconCosmetics) => {
    setUserIcon({
        ...userIcon,
      hue: preset.hue,
      saturation: preset.saturation,
      brightness: preset.brightness,
    });
  };

  return (
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
                  onClick={() =>
                    handlePresetClick({
                      ...preset,
                      hat: userIcon.hat,
                      body: userIcon.body,
                      face: userIcon.face,
                    })
                  }
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
  );
}
