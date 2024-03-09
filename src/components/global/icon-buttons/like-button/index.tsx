"use client";

import { FaHeart } from "react-icons/fa";
import { handleLike, handleUnlike } from "./actions";
import { useState } from "react";

interface LikeButtonProps {
  mediaId: number;
  liked: boolean;
}

export default function LikeButton({ ...props }: LikeButtonProps) {
  const [liked, toggleLiked] = useState(props.liked);

  function handleToggle() {
    toggleLiked(!liked);
    if (!liked) {
      handleLike(props.mediaId);
    } else {
      handleUnlike(props.mediaId);
    }
  }

  return (
    <button onClick={handleToggle}>
      <FaHeart size={25} className={liked ? "text-red-500" : ""} />
    </button>
  );
}
