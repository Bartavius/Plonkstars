import api from "@/utils/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaMedal, FaPencilAlt, FaPlay } from "react-icons/fa";
import { useDispatch } from "react-redux";

import "./page.css";
import "@/app/game.css";
import { setGameMap } from "@/redux/gameSlice";

export default function MapInfoCard({ 
    stats,
    canEdit,
    loading,
    setLoading,
    children
}: { 
    stats: any,
    canEdit: boolean,
    loading: boolean,
    setLoading: (loading: boolean) => void,
    children?: React.ReactNode,
}) {
    const [description, setDescription] = useState<string|undefined>(stats.description);
    const [editing, setEditing] = useState(false);

    const maxDescriptionLength = 512;
    const router = useRouter();
    const dispatch = useDispatch();
    const mapID = stats.id;

    const changeDescription = (e:any) => {
        if (e.target.value.length === 0){
            setDescription(undefined);
        }
        else{
            setDescription(e.target.value);
        }
    }
    
    const editDescription = async () => {
        const res = await api.post(`/map/edit/description`,{description,id:mapID});
        if(res.status === 200){
            setDescription(description);
            stats.description = description;
        }
        else{
            setDescription(stats.description);
        }
        setEditing(false);
    }

    const descriptionCancel = () => {
        setEditing(false);
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


    return(
    <div className="map-info-card">
        <div className="map-info-title">{stats.name}</div>
        <div className="map-info-creator">Made by: <span className="map-info-creator-name">{stats.creator.username}</span></div>
        <div className="map-info-description-button">
            {description && !editing &&
                <div className="map-info-description">
                    <div className="map-info-description-text">{description}
                        {canEdit &&
                            <FaPencilAlt className="description-edit-pencil mouse-pointer" onClick={() => setEditing(true)}/>
                        }
                    </div>
                </div>
            }
            {editing && canEdit &&
                <div className="map-info-description-editing">
                    <textarea className="map-info-description-textbox" defaultValue={stats.description ?? ""} onChange={changeDescription} maxLength={maxDescriptionLength}/>                 
                    <p className="map-description-char-counter">{description ? description.length:0}/{maxDescriptionLength} characters</p>
                    <div className="map-description-editing-footer">
                        <button onClick={descriptionCancel} className="dark-hover-button map-description-cancel" disabled={loading}>Cancel</button>
                        <button onClick={editDescription} className="map-description-save dark-hover-button" disabled={loading}><div>Save</div></button>
                    </div>
                </div>
            }
            {!description && !editing && canEdit &&
                <button className="game-button map-add-description" onClick={() => setEditing(true)} disabled={loading}>Add Description</button>
            }
            <div className="map-info-button-div">
                <button disabled={loading} className="play-button map-info-button gray-button" onClick={playMap}>
                    <FaPlay className="map-info-button-icon"/>
                    Play
                </button>
                {canEdit && 
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