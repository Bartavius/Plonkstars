import Modal from "@/components/Modal";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { useRouter } from "next/navigation";
import "./MapDeleteModal.css";

export default function MapDeleteModal({
    name,
    id,
    isOpen,
    onClose,
}:{
    name:string,
    id: string,
    isOpen:boolean,
    onClose: () => void,
}){
    const [input, setInput] = useState<string>("");
    const [deleting, setDeleting] = useState<boolean>(false);
    const [countdown, setCountdown] = useState<number>(-1);
    const router = useRouter();

    useEffect(() => {
        if (input === name && countdown === -1){
            setCountdown(3);
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev > 1) return prev - 1;
                    clearInterval(timer);
                    return 0;
                });
            }, 1000);
            return () => clearTimeout(timer);
        }
        else{
            setCountdown(-1);
        }
    }, [input === name]);


    async function deleteMap(){
        setDeleting(true);
        try {
            await api.delete("/map/edit/delete", { data: { id: id } });
        } catch (error) {console.log(error)}
        router.push("/map");
    }
    
    return (
        <Modal isOpen={isOpen} onClose={() => {setInput(""); setCountdown(-1); onClose();}} >
            <div className="delete-map-title"> Are you sure you want to delete "{name}"?</div>
            <div className="delete-map-content">
                <div className="delete-map-text">
                    All games, scores, sessions, and bounds associated with the map will be deleted. This action cannot be undone.
                </div>
                <div className="delete-map-text">To confirm, type "{name}":</div>
                <input className="input-field" placeholder={name} onChange={(e)=>{setInput(e.target.value);}}/>
                {name === input && 
                    <div>
                        <div className="delete-map-warning-text">This is your final chance!</div>
                        <button className="delete-map-button" onClick={deleteMap} disabled={deleting || countdown!==0}>{countdown === 0 ? "Delete Map" : countdown}</button>
                    </div>
                }
            </div>
        </Modal>
    )
}
