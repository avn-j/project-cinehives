"use client";

import { FaEye } from "react-icons/fa";
import { handleWatched, handleUnwatched } from "@/lib/db-actions";
import { useState } from "react";

interface WatchButtonProps {
  mediaId: number;
  watched: boolean;
}

export default function WatchButton({ ...props }: WatchButtonProps) {
  const [watched, toggleWatched] = useState(props.watched);

  function handleToggle() {
    toggleWatched(!watched);
    if (!watched) {
      handleWatched(props.mediaId);
    } else {
      handleUnwatched(props.mediaId);
    }
  }

  return (
    <button onClick={handleToggle}>
      <FaEye size={25} className={watched ? "text-primary" : ""} />
    </button>
  );
}
