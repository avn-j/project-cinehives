import {
  PopoverTrigger,
  Popover,
  PopoverContent,
} from "@/components/ui/popover";
import { FaStar } from "react-icons/fa6";
import StarRating from "../star-rating";
import { User } from "@supabase/supabase-js";

interface RateButtonProps {
  mediaId: number;
  rated: boolean;
  user: User;
  rating: number;
  toggleRatedHandler: Function;
  handleNewRating: Function;
}

export default function RateButton({ ...props }: RateButtonProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button>
          <FaStar size={25} className={props.rated ? "text-primary" : ""} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-full bg-black py-2">
        <div className="flex flex-col">
          <StarRating
            precision={0.5}
            initialRating={props.rating}
            mediaId={props.mediaId}
            toggleRatedHandler={props.toggleRatedHandler}
            handleNewRating={props.handleNewRating}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
