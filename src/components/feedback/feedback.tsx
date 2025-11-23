import { useState } from "react";
import Modal from "../Modal";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import Popup from "@/components/Popup";

const maxFeedbackLength = 2048;
export default function FeedbackComponent(){
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [update, setUpdate] = useState(0);
    const [popupMessage, setPopupMessage] = useState<string>();
    const router = useRouter();

    async function handleSubmit(){
        await api.post("/feedback/submit", {message});
        setMessage("");
        setOpen(false);
        setPopupMessage("Feedback successfully submitted!");
        setUpdate(prev => prev + 1);

    }
    return (
        <div>
            <Popup update={update} type="success">{popupMessage}</Popup>
            <div className="fixed bottom-4 right-4 z-50">
                <button
                    className="
                    bg-darkest text-white px-4 py-2 mr-2 rounded-lg shadow-lg 
                    hover:bg-blue-700 transition
                    "
                    onClick={() => setOpen(true)}
                >
                    Give us Feedback or Report a Bug!
                </button>
            </div>
            <Modal isOpen={open} onClose={() => setOpen(false)}>
                <div className="p-4">
                    <h2 className="text-2xl font-bold mb-4 text-center">We value your feedback!</h2>
                    <p className="mb-4">
                        If you find a bug or want a feature request please put it below. 
                        If you are logged in and your feedback is useful for the development team, you will be rewarded with Plonk Stars coins!
                        Coins can be used to purchase cosmetics in-game in the <a className="link" onClick={() => router.push("/shop")}>shop</a>. (This page is very scuffed at the moment, we'll improve it later) 
                        Thank you for helping us improve Plonk Stars!
                    </p>
                    <textarea 
                        className="w-full text-dark p-2 border-2 rounded-lg h-64 resize-none" 
                        defaultValue={message} 
                        onChange={(e) => setMessage(e.target.value)} 
                        maxLength={maxFeedbackLength}
                        placeholder="Place your feedback or bug report here..."
                    />                 
                    <p className="text-sm w-full text-right 
                    ">{message.length}/{maxFeedbackLength} characters</p>
                    <div className="flex justify-center">
                        <button
                            className="bg-darkest text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    </div>
                    
                </div>
            </Modal>
            
        </div>
    )
}