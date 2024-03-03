"use client";

import { FaHeart } from "react-icons/fa";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function LikeButton() {
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(true);
  };

  return (
    <button onClick={handleLike}>
      <FaHeart size={25} className={liked ? "text-red-500" : ""} />
    </button>
  );
}
