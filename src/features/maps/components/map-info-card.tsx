import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaPencilAlt, FaPlay } from "react-icons/fa";
import { TbTrash } from "react-icons/tb";
import { useDispatch } from "react-redux";

import { api } from "@/services/api";
import { setGameMap } from "@/store/game-slice";
import type { MapStats } from "@/features/maps/types/map-stats";

import "@/app/game.css";
import { MapDeleteModal } from "./map-delete-modal";
interface MapInfoCardProps {
  stats: MapStats;
  permission: number;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  children?: React.ReactNode;
}

function MapInfoCard({ stats, permission, loading, setLoading, children }: MapInfoCardProps) {
  const [description, setDescription] = useState<string | undefined>(stats.description);
  const [editingDescription, setEditingDescription] = useState(false);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

  const [name, setName] = useState<string>(stats.name);
  const [editingName, setEditingName] = useState(false);
  const nameRef = useRef<HTMLInputElement | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

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
  }, [editingDescription]);

  useEffect(() => {
    if (editingName) {
      nameRef.current?.focus();
      const length = nameRef.current?.value.length;
      nameRef.current?.setSelectionRange(length ?? 0, length ?? 0);
    }
  }, [editingName]);

  const changeDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length === 0) {
      setDescription(undefined);
    } else {
      setDescription(e.target.value);
    }
  };

  const editDescription = async () => {
    const newDescription = description?.trim();
    const res = await api.post(`/map/edit/description`, { description: newDescription, id: mapID });
    if (res.status === 200) {
      setDescription(newDescription);
      stats.description = description;
    } else {
      setDescription(stats.description);
    }
    setEditingDescription(false);
  };

  const descriptionCancel = () => {
    setEditingDescription(false);
    setDescription(stats.description);
  };

  const playMap = () => {
    setLoading(true);
    dispatch(setGameMap({ mapName: stats.name, mapId: mapID }));
    router.push("/game");
  };

  const editMap = () => {
    setLoading(true);
    router.push(`/map/${mapID}/edit`);
  };

  const descriptionKeyListener = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Escape") {
      descriptionCancel();
    } else if (event.key === "Enter" && !event.shiftKey) {
      editDescription();
    }
  };

  const editName = async () => {
    const newName = cleanName(name)?.trim();
    const res = await api.post(`/map/edit/name`, { name: newName, id: mapID });
    if (res.status === 200) {
      setName(newName);
      stats.name = newName;
    } else {
      setName(stats.name);
    }
    setEditingName(false);
  };

  const cancelName = () => {
    setEditingName(false);
    setName(stats.name);
  };

  const nameKeyListener = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      cancelName();
    } else if (event.key === "Enter") {
      editName();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center relative h-full max-w-[80%] bg-lighter-blue text-darkest-blue rounded-2xl p-4 max-[800px]:max-w-[90%]">
      {3 <= permission && (
        <TbTrash
          className="text-white absolute top-4 right-4 text-[1.5rem] transition-all duration-200 ease-[ease-in-out] hover:text-plonk-stars-red hover:cursor-pointer"
          onClick={() => setDeleteModalOpen(true)}
        />
      )}
      <div className="text-[3rem] font-semibold text-black">
        {!editingName && <>{stats.name}</>}
        {2 <= permission && !editingName && (
          <FaPencilAlt
            className="inline text-[1.5rem] ml-2 dark-hover-button"
            onClick={() => setEditingName(true)}
          />
        )}
        {editingName && 2 <= permission && (
          <div className="map-name-editing">
            <input
              id="map-title-editor"
              className="text-center"
              defaultValue={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={maxNameLength}
              ref={nameRef}
              onKeyDown={nameKeyListener}
            />
            <div className="text-[gray] text-[0.5rem] flex justify-between">
              <div className="text-[0.5rem] text-center">
                Press &quot;Enter&quot; to save or &quot;Esc&quot; to cancel
              </div>
              <div className="map-name-char-count">
                {name.length}/{maxNameLength} characters
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="text-[gray]">
        Made by: <span className="text-[1rem] font-bold">{stats.creator}</span>
      </div>
      <div className="bg-dark-blue w-full flex items-center justify-center flex-col p-4 rounded-2xl overflow-hidden">
        {description && !editingDescription && (
          <div className="map-info-description">
            <div className="text-[1.2rem] text-white [white-space:pre-line] [overflow-wrap:break-word] [word-break:break-word] max-[800px]:text-[1rem]">
              {description}
              {2 <= permission && (
                <FaPencilAlt
                  className="inline ml-4 dark-hover-button"
                  onClick={() => setEditingDescription(true)}
                />
              )}
            </div>
          </div>
        )}
        {editingDescription && 2 <= permission && (
          <div className="w-full">
            <textarea
              id="map-info-description-editor"
              className="w-full"
              defaultValue={stats.description ?? ""}
              onChange={changeDescription}
              maxLength={maxDescriptionLength}
              ref={descriptionRef}
              onKeyDown={descriptionKeyListener}
            />
            <p className="text-[0.5rem] text-right">
              {description ? description.length : 0}/{maxDescriptionLength} characters
            </p>
            <div className="grid grid-cols-[repeat(2,1fr)] w-full h-full gap-[4px]">
              <button
                onClick={descriptionCancel}
                className="h-full text-center items-center font-bold rounded-2xl bg-[gray] text-white py-1 dark-hover-button gray-disabled"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={editDescription}
                className="h-full text-center items-center font-bold rounded-2xl bg-plonk-stars-red text-white border py-1 dark-hover-button gray-disabled"
                disabled={loading}
              >
                <div>Save</div>
              </button>
            </div>
          </div>
        )}
        {!description && !editingDescription && 2 <= permission && (
          <button
            className="h-[70%] w-full bg-plonk-stars-red justify-center items-center text-plonk-stars-white border border-solid border-plonk-stars-white transition-all duration-150 ease-[ease-in-out] rounded-[2rem] [&:not(:disabled)]:hover:-translate-y-[0.1rem] [&:not(:disabled)]:hover:[scale:1.03] [&:not(:disabled)]:hover:bg-plonk-stars-red [&:not(:disabled)]:hover:text-plonk-stars-white [&:not(:disabled)]:hover:border [&:not(:disabled)]:hover:border-solid [&:not(:disabled)]:hover:border-plonk-stars-white disabled:opacity-50 disabled:![background:#000] disabled:cursor-not-allowed py-2 font-bold"
            onClick={() => setEditingDescription(true)}
            disabled={loading}
          >
            Add Description
          </button>
        )}
        <div className="mt-4 flex flex-row w-full overflow-hidden justify-center gap-2 max-[800px]:flex-col max-[800px]:m-4">
          <button
            disabled={loading}
            className="bg-[rgb(27,202,27)] flex items-center justify-center flex-row text-[1.5rem] font-bold text-white px-6 rounded-2xl dark-hover-button gray-disabled"
            onClick={playMap}
          >
            <FaPlay className="text-[1rem] mr-2" />
            Play
          </button>
          {1 <= permission && (
            <button
              disabled={loading}
              className="bg-[rgb(226,134,14)] flex items-center justify-center flex-row text-[1.5rem] font-bold text-white px-6 rounded-2xl dark-hover-button gray-disabled"
              onClick={editMap}
            >
              <FaPencilAlt className="text-[1rem] mr-2" />
              Edit
            </button>
          )}
          {children}
        </div>
      </div>
      <MapDeleteModal
        name={stats.name}
        id={stats.id}
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}

export { MapInfoCard };
