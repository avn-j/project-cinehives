"use client";

import {
  handleAddToWatchlist,
  handleRemoveFromWatchlist,
} from "@/lib/db-actions";
import { FaList } from "react-icons/fa";

interface WatchlistButtonProps {
  mediaId: number;
  onWatchlist: boolean;
  toggleWatchlistHandler: Function;
}

export default function WatchlistButton({ ...props }: WatchlistButtonProps) {
  function handleToggle() {
    props.toggleWatchlistHandler(!props.onWatchlist);
    if (!props.onWatchlist) {
      handleAddToWatchlist(props.mediaId);
    } else {
      handleRemoveFromWatchlist(props.mediaId);
    }
  }

  return (
    <button onClick={handleToggle}>
      <FaList size={25} className={props.onWatchlist ? "text-primary" : ""} />
    </button>
  );
}
