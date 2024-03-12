import { handleLike, handleUnlike } from "@/lib/db-actions";
import { FaHeart } from "react-icons/fa";

interface LikeButtonProps {
  mediaId: number;
  liked: boolean;
  toggleLikeHandler: Function;
}

export default function LikeButton({ ...props }: LikeButtonProps) {
  function handleToggle() {
    props.toggleLikeHandler(!props.liked);

    if (!props.liked) {
      handleLike(props.mediaId);
    } else {
      handleUnlike(props.mediaId);
    }
  }

  return (
    <button onClick={handleToggle}>
      <FaHeart size={25} className={props.liked ? "text-red-500" : ""} />
    </button>
  );
}
