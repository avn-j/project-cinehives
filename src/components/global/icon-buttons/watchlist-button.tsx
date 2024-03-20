"use client";

import { addToUserWatchlist, removeFromUserWatchlist } from "@/lib/db-actions";
import { FaList } from "react-icons/fa";
import { Media } from "@prisma/client";

interface WatchlistButtonProps {
  media: Media;
  onWatchlist: boolean;
  toggleWatchlistHandler: Function;
}

export default function WatchlistButton({ ...props }: WatchlistButtonProps) {
  function handleToggle() {
    props.toggleWatchlistHandler(!props.onWatchlist);
    if (!props.onWatchlist) {
      addToUserWatchlist(props.media);
    } else {
      removeFromUserWatchlist(props.media);
    }
  }

  return (
    <button onClick={handleToggle}>
      <FaList size={25} className={props.onWatchlist ? "text-primary" : ""} />
    </button>
  );
}
