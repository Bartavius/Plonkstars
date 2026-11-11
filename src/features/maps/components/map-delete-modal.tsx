import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Modal } from "@/components/primitives/modal";
import { api } from "@/services/api";
interface MapDeleteModalProps {
  name: string;
  id: string;
  isOpen: boolean;
  onClose: () => void;
}

function MapDeleteModal({ name, id, isOpen, onClose }: MapDeleteModalProps) {
  const [input, setInput] = useState<string>("");
  const [deleting, setDeleting] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(-1);
  const router = useRouter();

  useEffect(() => {
    if (input === name && countdown === -1) {
      setCountdown(3);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev > 1) {
            return prev - 1;
          }
          clearInterval(timer);
          return 0;
        });
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCountdown(-1);
    }
  }, [input === name]);

  async function deleteMap() {
    setDeleting(true);
    try {
      await api.delete("/map/edit/delete", { data: { id: id } });
    } catch (error) {
      console.error(error);
    }
    router.push("/map");
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setInput("");
        setCountdown(-1);
        onClose();
      }}
    >
      <div className="text-[2rem] font-bold mb-4 text-white text-center">
        {" "}
        Are you sure you want to delete &quot;{name}&quot;?
      </div>
      <div className="p-4 bg-theme-blue rounded-[10px]">
        <div className="text-[1rem] font-bold mb-4">
          All games, scores, sessions, and bounds associated with the map will be deleted. This
          action cannot be undone.
        </div>
        <div className="text-[1rem] font-bold mb-4">To confirm, type &quot;{name}&quot;:</div>
        <input
          className="input-field"
          id="delete-map-confirmation-input"
          placeholder={name}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        {name === input && (
          <div>
            <div className="text-plonk-stars-red font-bold mt-2 text-center">
              This is your final chance!
            </div>
            <button
              className="mt-4 w-full p-4 rounded-2xl bg-plonk-stars-red transition-all duration-300 ease-[ease] disabled:bg-[grey] disabled:cursor-not-allowed [&:not(:disabled)]:hover:[filter:brightness(75%)] [&:not(:disabled)]:hover:scale-[1.01]"
              onClick={deleteMap}
              disabled={deleting || countdown !== 0}
            >
              {countdown === 0 ? "Delete Map" : countdown}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

export { MapDeleteModal };
