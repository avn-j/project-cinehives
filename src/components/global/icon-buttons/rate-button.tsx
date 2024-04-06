import {
  PopoverTrigger,
  Popover,
  PopoverContent,
} from "@/components/ui/popover";
import { FaStar } from "react-icons/fa6";
import StarRating from "../star-rating";
import { MediaDatabase } from "@/lib/db-actions";

interface RateButtonProps {
  media: MediaDatabase;
  rated: boolean;
  rating: number;
  toggleRatedHandler: Function;
  handleNewRating: Function;
  toggleWatchedHandler: Function;
}

export default function RateButton({
  media,
  rated,
  rating,
  toggleRatedHandler,
  toggleWatchedHandler,
  handleNewRating,
}: RateButtonProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button>
          <FaStar size={25} className={rated ? "text-primary" : ""} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full bg-black py-2"
        align="end"
        side="top"
        alignOffset={-15}
        sideOffset={5}
      >
        <div className="flex flex-col">
          <StarRating
            precision={0.5}
            initialRating={rating}
            media={media}
            toggleRatedHandler={toggleRatedHandler}
            toggleWatchedHandler={toggleWatchedHandler}
            handleNewRating={handleNewRating}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
