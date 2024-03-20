"use client";

import { createNewWatched, deleteWatched } from "@/lib/db-actions";
import { FaEye } from "react-icons/fa";
import { Media } from "@prisma/client";

interface WatchButtonProps {
  media: Media;
  watched: boolean;
  toggleWatchedHandler: Function;
}

export default function WatchButton({ ...props }: WatchButtonProps) {
  function handleToggle() {
    props.toggleWatchedHandler(!props.watched);
    if (!props.watched) {
      createNewWatched(props.media);
    } else {
      deleteWatched(props.media);
    }
  }

  return (
    <button onClick={handleToggle}>
      <FaEye size={25} className={props.watched ? "text-primary" : ""} />
    </button>
  );
}
