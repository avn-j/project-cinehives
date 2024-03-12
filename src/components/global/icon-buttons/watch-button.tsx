"use client";

import { handleUnwatched, handleWatched } from "@/lib/db-actions";
import { FaEye } from "react-icons/fa";

interface WatchButtonProps {
  mediaId: number;
  watched: boolean;
  toggleWatchedHandler: Function;
}

export default function WatchButton({ ...props }: WatchButtonProps) {
  function handleToggle() {
    props.toggleWatchedHandler(!props.watched);
    if (!props.watched) {
      handleWatched(props.mediaId);
    } else {
      handleUnwatched(props.mediaId);
    }
  }

  return (
    <button onClick={handleToggle}>
      <FaEye size={25} className={props.watched ? "text-primary" : ""} />
    </button>
  );
}
