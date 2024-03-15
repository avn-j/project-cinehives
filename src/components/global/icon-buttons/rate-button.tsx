import {
  PopoverTrigger,
  Popover,
  PopoverContent,
} from "@/components/ui/popover";
import { FaStar } from "react-icons/fa6";
import StarRating from "../star-rating";
import { Media } from "@prisma/client";

interface RateButtonProps {
  media: Media;
  rated: boolean;
  rating: number;
  toggleRatedHandler: Function;
  handleNewRating: Function;
  toggleWatchedHandler: Function;
}

export default function RateButton({ ...props }: RateButtonProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button>
          <FaStar size={25} className={props.rated ? "text-primary" : ""} />
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
            initialRating={props.rating}
            media={props.media}
            toggleRatedHandler={props.toggleRatedHandler}
            toggleWatchedHandler={props.toggleWatchedHandler}
            handleNewRating={props.handleNewRating}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
