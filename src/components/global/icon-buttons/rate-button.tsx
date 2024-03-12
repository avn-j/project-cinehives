"use client";

import {
  handleWatched,
  handleUnwatched,
  handleNewRating,
  checkRating,
} from "@/lib/db-actions";
import { SyntheticEvent, useEffect, useState } from "react";
import {
  PopoverTrigger,
  Popover,
  PopoverContent,
} from "@/components/ui/popover";
import { FaStar } from "react-icons/fa6";
import StarRating from "../star-rating";

interface RateButtonProps {
  mediaId: number;
  rated: boolean;
  rating: number;
}

export default function RateButton({ ...props }: RateButtonProps) {
  const [rated, toggleRated] = useState(props.rated);

  const toggleRatedHandler = (rated: boolean) => {
    toggleRated(rated);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button>
          <FaStar size={25} className={rated ? "text-primary" : ""} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-full bg-black py-2">
        <div className="flex flex-col">
          <StarRating
            precision={0.5}
            initialRating={props.rating}
            mediaId={props.mediaId}
            toggleRatedHandler={toggleRatedHandler}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
