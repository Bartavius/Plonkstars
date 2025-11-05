import { useEffect, useRef, useState } from "react";
import { Team } from "./structs";
import api from "@/utils/api";
import { FaPencilAlt } from "react-icons/fa";

const MAX_NAME_LENGTH = 64;

export default function TeamSettings({
    teamInfo,
    setMessage,
    onClose,
}:{
    teamInfo: Team,
    setMessage: (message: string, type?: string) => void,
    onClose: () => void,
}){
    const [localSettings, setLocalSettings] = useState<Team>(teamInfo);
    const [editingName, setEditingName] = useState<number| undefined>(undefined);
    const [name, setName] = useState<string>(teamInfo.name);

    const nameRef = useRef<HTMLInputElement | null>(null);
    const numColors = (16**6 + 1);
    
    async function saveChanges() {
        await api.post(`/party/teams/update`, {...localSettings, name: name.trim()});
        setMessage("Team settings updated");
        onClose();
    }

    function nameKeyListener(event:any) {
        if (event.key === "Escape") {
            setName(localSettings.name);
            setEditingName(undefined);
        }
        else if (event.key === "Enter") {
            setLocalSettings({...localSettings, name: name.trim()});
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
        }
        else if (document.caretRangeFromPoint) {
            range = document.caretRangeFromPoint(e.clientX, e.clientY);
        }

        if (range) {
            const index = range.startOffset;
            setEditingName(index);
        }
    }

    useEffect(() => {
        if (teamInfo === localSettings){
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
    },[editingName])

    return (
        <div>
            <h2 className="party-page-modal-title">Team Settings</h2>
            <div className="party-page-modal-team-settings-form">
                <div className="party-page-team-settings-name-edit">
                    {editingName === undefined ?
                        <div className="party-page-team-settings-name no-scrollbar"><div className="inline" onDoubleClick={setClickPosition}>{localSettings.name}</div><FaPencilAlt className="party-page-team-name-edit-button" onClick={() => setEditingName(name.length)}/></div>:
                        <>
                            <input className="party-page-team-settings-name-edit-textbox" defaultValue={localSettings.name} onChange={(e) => setName(e.target.value)} ref={nameRef} maxLength={MAX_NAME_LENGTH} onKeyDown={nameKeyListener}/>
                            <div className="party-page-team-settings-name-editing-footer">
                                <div className="party-page-team-settings-name-edit-instruction">Press "Enter" to save or "Esc" to cancel</div>
                                <div className="party-page-team-settings-name-char-count">{name.length}/{MAX_NAME_LENGTH} characters</div>
                            </div>
                        </>
                    }
                </div>
                <div className="party-page-team-settings-color">   
                    <input 
                        type="color" 
                        value={`#${localSettings.color.toString(16).padStart(6, "0")}`} 
                        onChange={(e) => setLocalSettings({...localSettings, color: parseInt(e.target.value.slice(1), 16)})}
                        className="party-page-team-settings-color-picker" 
                    />
                    <div className="party-page-team-settings-color-buttons">
                        <button className="party-page-team-button party-page-team-settings-color-random" onClick={() => setLocalSettings({...localSettings, color: Math.floor(Math.random() * numColors)})}>Random Color</button>
                        <button className="party-page-team-button party-page-team-settings-color-reset" onClick={() => setLocalSettings({...localSettings, color:teamInfo.color})}>Reset Color</button>
                    </div>
                </div>
            </div>
            <div className="party-page-team-settings-buttons">
                <button className="party-page-team-button party-team-settings-modal-save" onClick={saveChanges}>Save Changes</button>
                <button className="party-page-team-button party-team-settings-modal-cancel" onClick={onClose}>Cancel</button>
            </div>
        </div>
    )
}