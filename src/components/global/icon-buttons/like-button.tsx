import { createMediaLike, deleteMediaLike } from "@/lib/db-actions";
import { Media } from "@prisma/client";
import { FaHeart } from "react-icons/fa";

interface LikeButtonProps {
  media: Media;
  liked: boolean;
  toggleLikeHandler: Function;
}

export default function LikeButton({ ...props }: LikeButtonProps) {
  function handleToggle() {
    props.toggleLikeHandler(!props.liked);

    if (!props.liked) {
      createMediaLike(props.media);
    } else {
      deleteMediaLike(props.media);
    }
  }

  return (
    <button onClick={handleToggle}>
      <FaHeart size={25} className={props.liked ? "text-red-500" : ""} />
    </button>
  );
}
