import api from "@/utils/api";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaPencilAlt, FaPlay } from "react-icons/fa";
import { useDispatch } from "react-redux";

import "./page.css";
import "@/app/game.css";
import { setGameMap } from "@/redux/gameSlice";
import { TbTrash } from "react-icons/tb";

export default function MapInfoCard({ 
    stats,
    permission,
    loading,
    setLoading,
    children
}: { 
    stats: any,
    permission: number,
    loading: boolean,
    setLoading: (loading: boolean) => void,
    children?: React.ReactNode,
}) {
    const [description, setDescription] = useState<string|undefined>(stats.description);
    const [editingDescription, setEditingDescription] = useState(false);
    const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

    const [name, setName] = useState<string>(stats.name);
    const [editingName, setEditingName] = useState(false);
    const nameRef = useRef<HTMLInputElement | null>(null);

    const maxDescriptionLength = 512;
    const maxNameLength = 50;
    const router = useRouter();
    const dispatch = useDispatch();
    const mapID = stats.id;


    const cleanName = (text: string): string => text.replace(/[^\S ]+/g, "");


    useEffect(() => {
        if (editingDescription) {
            descriptionRef.current?.focus();
            const length = descriptionRef.current?.textLength;
            descriptionRef.current?.setSelectionRange(length ?? 0, length ?? 0);
        }
    },[editingDescription])

    useEffect(() => {
        if (editingName) {
            nameRef.current?.focus();
            const length = nameRef.current?.value.length;
            nameRef.current?.setSelectionRange(length ?? 0, length ?? 0);
        }
    },[editingName])


    const changeDescription = (e:any) => {
        if (e.target.value.length === 0){
            setDescription(undefined);
        }
        else{
            setDescription(e.target.value);
        }
    }

    
    const editDescription = async () => {
        const newDescription = description?.trim();
        const res = await api.post(`/map/edit/description`,{description:newDescription,id:mapID});
        if(res.status === 200){
            setDescription(newDescription);
            stats.description = description;
        }
        else{
            setDescription(stats.description);
        }
        setEditingDescription(false);
    }

    const descriptionCancel = () => {
        setEditingDescription(false);
        setDescription(stats.description);
    }

    const playMap = () => {
        setLoading(true);
        dispatch(setGameMap({mapName:stats.name,mapId:mapID}));
        router.push("/game");
    } 

    const editMap = () => {
        setLoading(true);
        router.push(`/map/${mapID}/edit`);
    }

    const descriptionKeyListener = (event:any) => {
        if (event.key === "Escape") {
            descriptionCancel();
        }
        else if (event.key === "Enter" && !event.shiftKey) {
            editDescription();
        }
    };

    const editName = async () => {
        const newName = cleanName(name)?.trim();
        const res = await api.post(`/map/edit/name`,{name:newName,id:mapID});
        if(res.status === 200){
            setName(newName);
            stats.name = newName;
        }
        else{
            setName(stats.name);
        }
        setEditingName(false);
    }

    const cancelName = () => {
        setEditingName(false);
        setName(stats.name);
    }

    const nameKeyListener = (event:any) => {
        if (event.key === "Escape") {
            cancelName();
        }
        else if (event.key === "Enter") {
            editName();
        }
    }


    return(
    <div className="map-info-card">
        {3 <= permission && <TbTrash className="map-delete-trash-button" onClick={()=>router.push(`/map/${mapID}/delete`)}/>}
        <div className="map-info-title">
            {!editingName && 
                <>{stats.name}</>
            }
            {2 <= permission && !editingName &&
                <FaPencilAlt className="map-name-edit-pencil dark-hover-button" onClick={() => setEditingName(true)}/>
            }
            {editingName && 2 <= permission &&
                <div className="map-name-editing">
                    <input className="map-name-edit-textbox" defaultValue={name} onChange={(e) => setName(e.target.value)} maxLength={maxNameLength} ref={nameRef} onKeyDown={nameKeyListener}/>
                    <div className="map-name-editing-footer">
                        <div className="map-name-edit-instruction">Press "Enter" to save or "Esc" to cancel</div>
                        <div className="map-name-char-count">{name.length}/{maxNameLength} characters</div>
                    </div>   
                </div>
            }
        </div>
        <div className="map-info-creator">Made by: <span className="map-info-creator-name">{stats.creator.username}</span></div>
        <div className="map-info-description-button">
            {description && !editingDescription &&
                <div className="map-info-description">
                    <div className="map-info-description-text">{description}
                        {2 <= permission &&
                            <FaPencilAlt className="description-edit-pencil dark-hover-button" onClick={() => setEditingDescription(true)}/>
                        }
                    </div>
                </div>
            }
            {editingDescription && 2 <= permission &&
                <div className="map-info-description-editing">
                    <textarea className="map-info-description-textbox" defaultValue={stats.description ?? ""} onChange={changeDescription} maxLength={maxDescriptionLength} ref={descriptionRef} onKeyDown={descriptionKeyListener}/>                 
                    <p className="map-description-char-counter">{description ? description.length:0}/{maxDescriptionLength} characters</p>
                    <div className="map-description-editing-footer">
                        <button onClick={descriptionCancel} className="map-description-cancel gray-button" disabled={loading}>Cancel</button>
                        <button onClick={editDescription} className="map-description-save gray-button" disabled={loading}><div>Save</div></button>
                    </div>
                </div>
            }
            {!description && !editingDescription &&  2 <= permission &&
                <button className="game-button map-add-description" onClick={() => setEditingDescription(true)} disabled={loading}>Add Description</button>
            }
            <div className="map-info-button-div">
                <button disabled={loading} className="play-button map-info-button gray-button" onClick={playMap}>
                    <FaPlay className="map-info-button-icon"/>
                    Play
                </button>
                {1 <= permission && 
                    <button disabled={loading} className="edit-button map-info-button gray-button" onClick={editMap}>
                        <FaPencilAlt className="map-info-button-icon"/>
                        Edit
                    </button>}
                {children}
            </div>
        </div>
    </div>
    )
}