"use client";

import {
  MediaDatabase,
  createNewWatched,
  deleteWatched,
} from "@/lib/db-actions";
import { FaEye } from "react-icons/fa";

interface WatchButtonProps {
  media: MediaDatabase;
  watched: boolean;
  toggleWatchedHandler: Function;
}

export default function WatchButton({
  media,
  watched,
  toggleWatchedHandler,
}: WatchButtonProps) {
  function handleToggle() {
    toggleWatchedHandler(!watched);
    if (!watched) {
      createNewWatched(media);
    } else {
      deleteWatched(media);
    }
  }

  return (
    <button onClick={handleToggle}>
      <FaEye size={25} className={watched ? "text-primary" : ""} />
    </button>
  );
}
