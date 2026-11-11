import type { UserIconCosmetics } from "@/features/cosmetics/types/user-icon-cosmetics";
import constants from "@/lib/constants.json";

import colorPresets from "./color-presets.json";

const MAX_HUE = constants.AVATAR_MAX_HUE;
const MAX_SATURATION = constants.AVATAR_MAX_SATURATION;
const MAX_BRIGHTNESS = constants.AVATAR_MAX_BRIGHTNESS;
interface ColorSelectionProps {
  userIcon: UserIconCosmetics;
  setUserIcon: (icon: UserIconCosmetics) => void;
}

function ColorSelection({ userIcon, setUserIcon }: ColorSelectionProps) {
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
    <div className="flex-1 flex flex-col gap-[16px] max-[800px]:gap-[12px] p-1">
      <div className="text-center">
        <span className="">Set Colors</span>
        <div className="text-center justify-center flex">
          <div className="flex flex-wrap justify-center gap-[10px] my-[15px] w-4/5 max-[800px]:my-[10px] max-[800px]:w-full">
            {colorPresets.map((preset) => (
              <div className="flex-column align-center justify-center" key={preset.name}>
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
      <div className="control-group flex items-center gap-[12px]">
        <label htmlFor="hue-slider">
          <span className="!text-white">Hue</span>
        </label>
        <div className="relative w-full h-[32px]">
          <div
            className="absolute top-1/2 -translate-y-1/2 w-full h-[32px] bg-[linear-gradient(to_right,#dd8600,#00bc43,#339cff,#ff5fd6,#dd8600)] rounded-[10px] pointer-events-none z-[1]"
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
            onChange={(e) => handleSliderChange("hue", parseInt(e.target.value))}
          />
        </div>
        <span className="min-w-[40px] text-right text-[#666] text-[14px] !text-white">
          {userIcon.hue}°
        </span>
      </div>

      <div className="control-group flex items-center gap-[12px]">
        <label htmlFor="saturation-slider">
          <span className="!text-white">Saturation</span>
        </label>
        <div className="relative w-full h-[32px]">
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
            onChange={(e) => handleSliderChange("saturation", parseInt(e.target.value))}
          />
        </div>
        <span className="min-w-[40px] text-right text-[#666] text-[14px] !text-white">
          {userIcon.saturation}%
        </span>
      </div>

      <div className="control-group flex items-center gap-[12px]">
        <label htmlFor="brightness-slider">
          <span className="!text-white">Brightness</span>
        </label>
        <div className="relative w-full h-[32px]">
          <div
            className="absolute top-1/2 -translate-y-1/2 w-full h-[32px] bg-[linear-gradient(to_right,black,white)] rounded-[10px] pointer-events-none z-[1]"
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
            onChange={(e) => handleSliderChange("brightness", parseInt(e.target.value))}
          />
        </div>
        <span className="min-w-[40px] text-right text-[#666] text-[14px] !text-white">
          {userIcon.brightness}%
        </span>
      </div>
    </div>
  );
}

export { ColorSelection };
