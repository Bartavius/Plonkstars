import { useEffect, useRef, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";

import type { Team } from "@/app/party/_types/team";
import { api } from "@/services/api";

const MAX_NAME_LENGTH = 64;
interface TeamSettingsProps {
  teamInfo: Team;
  setMessage: (message: string, type?: string) => void;
  onClose: () => void;
}

function TeamSettings({ teamInfo, setMessage, onClose }: TeamSettingsProps) {
  const [localSettings, setLocalSettings] = useState<Team>(teamInfo);
  const [editingName, setEditingName] = useState<number | undefined>(undefined);
  const [name, setName] = useState<string>(teamInfo.name);

  const nameRef = useRef<HTMLInputElement | null>(null);
  const numColors = 16 ** 6 + 1;

  async function saveChanges() {
    await api.post(`/party/teams/update`, { ...localSettings, name: name.trim() });
    setMessage("Team settings updated");
    onClose();
  }

  function nameKeyListener(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setName(localSettings.name);
      setEditingName(undefined);
    } else if (event.key === "Enter") {
      setLocalSettings({ ...localSettings, name: name.trim() });
      setEditingName(undefined);
    }
  }

  function setClickPosition(e: React.MouseEvent) {
    let range;
    if (document.caretPositionFromPoint) {
      const pos = document.caretPositionFromPoint(e.clientX, e.clientY);
      if (pos) {
        range = document.createRange();
        range.setStart(pos.offsetNode, pos.offset);
        range.setEnd(pos.offsetNode, pos.offset);
      }
    } else if (document.caretRangeFromPoint) {
      range = document.caretRangeFromPoint(e.clientX, e.clientY);
    }

    if (range) {
      const index = range.startOffset;
      setEditingName(index);
    }
  }

  useEffect(() => {
    if (teamInfo === localSettings) {
      setEditingName(undefined);
      setLocalSettings(teamInfo);
      setName(teamInfo.name);
    }
  }, [teamInfo]);

  useEffect(() => {
    if (editingName !== undefined) {
      nameRef.current?.focus();
      nameRef.current?.setSelectionRange(editingName ?? 0, editingName ?? 0);
    }
  }, [editingName]);

  return (
    <div>
      <h2 className="text-[x-large] font-semibold text-center">Team Settings</h2>
      <div className="bg-lighter-blue rounded-2xl p-2 shadow-[0px_3px_10px_rgba(0,25,51,0.3)] text-darkest-blue">
        <div className="w-full flex justify-center items-center flex-col text-[3rem] font-semibold text-black">
          {editingName === undefined ? (
            <div className="w-full overflow-auto whitespace-nowrap [word-break:break-all] text-center no-scrollbar">
              <div className="inline" onDoubleClick={setClickPosition}>
                {localSettings.name}
              </div>
              <FaPencilAlt
                className="inline ml-2 text-[1.5rem] hover:cursor-pointer hover:brightness-110"
                onClick={() => setEditingName(name.length)}
              />
            </div>
          ) : (
            <>
              <input
                className="text-center w-full"
                defaultValue={localSettings.name}
                onChange={(e) => setName(e.target.value)}
                ref={nameRef}
                maxLength={MAX_NAME_LENGTH}
                onKeyDown={nameKeyListener}
              />
              <div className="text-[gray] text-[0.5rem] flex justify-between w-full">
                <div className="text-[0.5rem] text-center">
                  Press &quot;Enter&quot; to save or &quot;Esc&quot; to cancel
                </div>
                <div className="party-page-team-settings-name-char-count">
                  {name.length}/{MAX_NAME_LENGTH} characters
                </div>
              </div>
            </>
          )}
        </div>
        <div className="flex justify-center items-center flex-col gap-2">
          <input
            type="color"
            value={`#${localSettings.color.toString(16).padStart(6, "0")}`}
            onChange={(e) =>
              setLocalSettings({ ...localSettings, color: parseInt(e.target.value.slice(1), 16) })
            }
            className="items-center w-20 h-20 cursor-pointer"
          />
          <div className="flex gap-4">
            <button
              className="rounded-2xl px-8 py-1 border-none transition-all duration-200 ease-[ease-in-out] text-white hover:cursor-pointer hover:brightness-90 hover:scale-[1.02] hover:shadow-[0px_3px_10px_rgba(0,25,51,0.3)] bg-color-green font-bold hover:bg-[linear-gradient(45deg,red,orange,yellow,green,cyan,blue,violet,red)] hover:bg-color-green hover:bg-[length:400%_100%] hover:animate-[rainbow_8s_linear_infinite]"
              onClick={() =>
                setLocalSettings({ ...localSettings, color: Math.floor(Math.random() * numColors) })
              }
            >
              Random Color
            </button>
            <button
              className="rounded-2xl px-8 py-1 border-none transition-all duration-200 ease-[ease-in-out] text-white hover:cursor-pointer hover:brightness-90 hover:scale-[1.02] hover:shadow-[0px_3px_10px_rgba(0,25,51,0.3)] font-bold bg-[gray]"
              onClick={() => setLocalSettings({ ...localSettings, color: teamInfo.color })}
            >
              Reset Color
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          className="rounded-2xl px-8 py-1 border-none transition-all duration-200 ease-[ease-in-out] text-white hover:cursor-pointer hover:brightness-90 hover:scale-[1.02] hover:shadow-[0px_3px_10px_rgba(0,25,51,0.3)] bg-plonk-stars-red"
          onClick={saveChanges}
        >
          Save Changes
        </button>
        <button
          className="rounded-2xl px-8 py-1 border-none transition-all duration-200 ease-[ease-in-out] text-white hover:cursor-pointer hover:brightness-90 hover:scale-[1.02] hover:shadow-[0px_3px_10px_rgba(0,25,51,0.3)] bg-[gray]"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export { TeamSettings };
