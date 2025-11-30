import Modal from "@/components/Modal";
import "./HowToPlayModal.css";


export default function HowToPlayModal(
    {
        open,
        onClose,
    }:{
        open: boolean;
        onClose: ()=>void;
    }
) {
    return (
        <Modal onClose={onClose} isOpen={open}>
            <div className="how-to-play-modal">
                <h2 className="how-to-play-title">How to Play</h2>
                <div className="how-to-play-grid">
                    <div className="how-to-play-step">
                        <img className="how-to-play-step-img" src="HowToPlay/lookAround.gif"/>
                        <div className="how-to-play-step-title">1. Look around</div>
                        <div className="how-to-play-step-description">
                            Look at your surroundings to get clues about your location. 
                            Identify landmarks, signs, vegetation, and other features that can help you figure out where you are.
                            Text to blurry to see? No worries! Scroll to change the zoom level. 
                            There is a time limit for each round, so try to gather information quickly!
                        </div>
                    </div>
                    <div className="how-to-play-step">
                        <img className="how-to-play-step-img" src="HowToPlay/plonkingGuess.gif"/>
                        <div className="how-to-play-step-title">2. Take a shot</div>
                        <div className="how-to-play-step-description">
                            You know where you are? Great! Now hover over the map and click on the location you want to guess at.
                            When you're ready, press the "Submit" button to lock in your answer. If you change your mind, 
                            you can always adjust your guess before submitting.
                        </div>
                    </div>
                    <div className="how-to-play-step">
                        <img className="how-to-play-step-img" src="HowToPlay/results.png"/>
                        <div className="how-to-play-step-title">3. Get the results</div>
                        <div className="how-to-play-step-description">
                            After you make your guess, you'll see how far off you were from the real location.
                            The closer you are, the more points you get! Try to get the highest score within the set amount of rounds.
                            Compete with friends or other players to see who has the best geography skills!
                        </div>

                    </div>
                </div>
            </div>
        </Modal>
    );
}