"use client";

import { FaList } from "react-icons/fa";
import {
  handleAddToWatchlist,
  handleRemoveFromWatchlist,
} from "@/lib/db-actions";
import { useState } from "react";

interface WatchlistButtonProps {
  mediaId: number;
  onWatchlist: boolean;
}

export default function WatchlistButton({ ...props }: WatchlistButtonProps) {
  const [onWatchlist, toggleOnWatchlist] = useState(props.onWatchlist);

  function handleToggle() {
    toggleOnWatchlist(!onWatchlist);
    if (!onWatchlist) {
      handleAddToWatchlist(props.mediaId);
    } else {
      handleRemoveFromWatchlist(props.mediaId);
    }
  }

  return (
    <button onClick={handleToggle}>
      <FaList size={25} className={onWatchlist ? "text-primary" : ""} />
    </button>
  );
}
