"use client";

import { handleUnwatched, handleWatched } from "@/lib/db-actions";
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
      handleWatched(props.media);
    } else {
      handleUnwatched(props.media);
    }
  }

  return (
    <button onClick={handleToggle}>
      <FaEye size={25} className={props.watched ? "text-primary" : ""} />
    </button>
  );
}
