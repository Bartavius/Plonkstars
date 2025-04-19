"use client";

import maps from "@/utils/maps";
import "./page.css";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMapType } from "@/redux/settingsSlice";
import Popup from "@/components/Popup";

interface UserIcon {
  hue: number;
  saturation: number;
  brightness: number;
}

const MAX_HUE = 360;
const MAX_SATURATION = 200;
const MAX_BRIGHTNESS = 200;

export default function Settings() {
  const mapNumber = useSelector((state: any) => state.settings.mapNumber);
  const [currentMap, setCurrentMap] = useState<number>(mapNumber);
  const [message, setMessage] = useState<string>();
  const [update, setUpdate] = useState<number>(0);
  const [userIconDefault, setUserIconDefault] = useState<UserIcon>({
    // will have to fetch eventually
    hue: 0,
    saturation: 150,
    brightness: 100,
  });
  const [userIcon, setUserIcon] = useState<UserIcon>({
    hue: userIconDefault.hue,
    saturation: userIconDefault.saturation,
    brightness: userIconDefault.brightness,
  });
  const dispatch = useDispatch();

  const handleSliderChange = (property: string, value: number) => {
    setUserIcon((prev) => ({
      ...prev,
      [property]: value,
    }));
  };

  const getFilterStyle = () => {
    return `hue-rotate(${userIcon.hue}deg) 
            saturate(${userIcon.saturation}%) 
            brightness(${userIcon.brightness}%)`;
  };

  const saveChanges = () => {
    dispatch(setMapType({ mapNumber: currentMap }));
    setMessage("Changes saved!");
    setUpdate(update + 1);
  };

  return (
    <div>
      <div className="navbar-buffer" />
      <Popup message={message} update={update} />
      <div className="settings-wrapper">
        <div id="top" className="settings-header">
          Settings
        </div>
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
              {/* Hue adjustment */}
              <div className="control-group">
                <label>Hue</label>
                <input
                  type="range"
                  min="0"
                  max={`${MAX_HUE}`}
                  value={userIcon.hue}
                  className="slider hue-slider"
                  onChange={(e) =>
                    handleSliderChange("hue", parseInt(e.target.value))
                  }
                />
                <span className="value-display">{userIcon.hue}°</span>
              </div>

              {/* Saturation adjustment */}
              <div className="control-group">
                <label>Saturation</label>
                <input
                  type="range"
                  min="0"
                  max={`${MAX_SATURATION}`}
                  value={userIcon.saturation}
                  className="slider saturation-slider"
                  onChange={(e) =>
                    handleSliderChange("saturation", parseInt(e.target.value))
                  }
                />
                <span className="value-display">{userIcon.saturation}%</span>
              </div>

              {/* Brightness adjustment */}
              <div className="control-group">
                <label>Brightness</label>
                <input
                  type="range"
                  min="0"
                  max={`${MAX_BRIGHTNESS}`}
                  value={userIcon.brightness}
                  className="slider brightness-slider"
                  onChange={(e) =>
                    handleSliderChange("brightness", parseInt(e.target.value))
                  }
                />
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
              onClick={() =>
                // send the fetch call
                setUserIcon({
                  hue: userIconDefault.hue,
                  saturation: userIconDefault.saturation,
                  brightness: userIconDefault.brightness,
                })
              }
            >
              Save Changes
            </button>
          </div>
        </div>
        <div className="settings-box">
          <div className="settings-label">Map Type</div>
          <div className="settings-dropdown">
            <select
              className="settings-dropdown-select"
              defaultValue={currentMap}
              onChange={(e) =>
                setCurrentMap(parseInt((e.target as HTMLSelectElement).value))
              }
            >
              {maps.map((mapValue: any, index: number) => (
                <option key={index} value={index}>
                  {mapValue.name}
                </option>
              ))}
            </select>
            <MapContainer center={[0, 0]} zoom={0} className="leaflet-map">
              <TileLayer
                url={maps[currentMap].url}
                attribution={maps[currentMap].attribution}
                tileSize={256}
                zoomOffset={0}
                detectRetina={true}
                className="leaflet-control-attribution"
              />
            </MapContainer>
          </div>
          <button className="form-button-selected mt-2" onClick={saveChanges}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
