import {
  MediaDatabase,
  createNewMediaLike,
  deleteMediaLike,
} from "@/lib/db-actions";
import { FaHeart } from "react-icons/fa";

interface LikeButtonProps {
  media: MediaDatabase;
  liked: boolean;
  toggleLikeHandler: Function;
}

export default function LikeButton({
  liked,
  toggleLikeHandler,
  media,
}: LikeButtonProps) {
  function handleToggle() {
    toggleLikeHandler(!liked);

    if (!liked) {
      createNewMediaLike(media);
    } else {
      deleteMediaLike(media);
    }
  }

  return (
    <button onClick={handleToggle}>
      <FaHeart size={25} className={liked ? "text-red-500" : ""} />
    </button>
  );
}
