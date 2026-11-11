import { Modal } from "@/components/primitives/modal";
import "./how-to-play-modal.css";
interface HowToPlayModalProps {
  open: boolean;
  onClose: () => void;
}

function HowToPlayModal({ open, onClose }: HowToPlayModalProps) {
  return (
    <Modal onClose={onClose} isOpen={open}>
      <div className="how-to-play-modal max-[600px]:h-[80vh] max-[600px]:overflow-y-auto">
        <h2 className="text-[36px] font-bold text-center mb-[10px]">How to Play</h2>
        <div className="grid grid-cols-[repeat(3,1fr)] gap-[16px] max-[600px]:grid-cols-[1fr] max-[600px]:gap-[12px]">
          <div className="max-[600px]:border-b max-[600px]:border-solid max-[600px]:border-b-lightest-blue">
            <img className="w-full rounded-[10px] mb-[8px]" src="HowToPlay/lookAround.gif" />
            <div className="text-[22px] font-semibold text-center text-white max-[600px]:text-[18px]">
              1. Look Around
            </div>
            <div className="text-[16px] text-lightest-blue max-[600px]:text-[12px]">
              Look at your surroundings to get clues about your location. Identify landmarks, signs,
              vegetation, and other features that can help you figure out where you are. Text too
              small to read? No worries! Scroll to change the zoom level. There is a time limit for
              each round, so try to gather information quickly!
            </div>
          </div>
          <div className="max-[600px]:border-b max-[600px]:border-solid max-[600px]:border-b-lightest-blue">
            <img className="w-full rounded-[10px] mb-[8px]" src="HowToPlay/plonkingGuess.gif" />
            <div className="text-[22px] font-semibold text-center text-white max-[600px]:text-[18px]">
              2. Make a Plonk
            </div>
            <div className="text-[16px] text-lightest-blue max-[600px]:text-[12px]">
              You know where you are? Great! Now hover over the map and click on the location you
              want to guess. When you&apos;re ready, press the &quot;Submit&quot; button to lock in
              your answer. If you change your mind, you can always adjust your guess before
              submitting.
            </div>
          </div>
          <div className="max-[600px]:border-b max-[600px]:border-solid max-[600px]:border-b-lightest-blue">
            <img className="w-full rounded-[10px] mb-[8px]" src="HowToPlay/results.png" />
            <div className="text-[22px] font-semibold text-center text-white max-[600px]:text-[18px]">
              3. Get the Results
            </div>
            <div className="text-[16px] text-lightest-blue max-[600px]:text-[12px]">
              After you make your guess, you&apos;ll see how far off you were from the real
              location. The closer you are, the more points you get! Try to get the highest score
              within the set amount of rounds. Compete with friends or other players to see who has
              the best geographical knowledge!
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export { HowToPlayModal };
