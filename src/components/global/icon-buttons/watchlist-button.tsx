"use client";

import {
  MediaDatabase,
  addMediaToUserWatchlist,
  deleteFromUserWatchlist,
} from "@/lib/db-actions";
import { FaList } from "react-icons/fa";

interface WatchlistButtonProps {
  media: MediaDatabase;
  onWatchlist: boolean;
  toggleWatchlistHandler: Function;
}

export default function WatchlistButton({
  media,
  onWatchlist,
  toggleWatchlistHandler,
}: WatchlistButtonProps) {
  function handleToggle() {
    toggleWatchlistHandler(!onWatchlist);
    if (!onWatchlist) {
      addMediaToUserWatchlist(media);
    } else {
      deleteFromUserWatchlist(media);
    }
  }

  return (
    <button onClick={handleToggle}>
      <FaList size={25} className={onWatchlist ? "text-primary" : ""} />
    </button>
  );
}
