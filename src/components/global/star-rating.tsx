"use client";

import { MediaDatabase, createNewRating, deleteRating } from "@/lib/db-actions";
import { MouseEvent, useRef, useState } from "react";
import { FaStar, FaRegStar, FaXmark } from "react-icons/fa6";

interface StarRatingProps {
  precision: number;
  initialRating?: number;
  media: MediaDatabase;
  toggleRatedHandler: Function;
  handleNewRating: Function;
  toggleWatchedHandler: Function;
}

export default function StarRating({
  precision,
  initialRating,
  media,
  toggleRatedHandler,
  toggleWatchedHandler,
  handleNewRating,
}: StarRatingProps) {
  const [activeStar, setActiveStar] = useState(initialRating || -1);
  const [hoverActiveStar, setHoverActiveStar] = useState(-1);
  const [isHovered, setIsHovered] = useState(false);
  const totalStars = 5;

  const ratingContainerRef = useRef<HTMLDivElement | null>(null);

  const calculateRating = (e: MouseEvent) => {
    if (!ratingContainerRef.current) return 0;
    const { width, left } = ratingContainerRef.current.getBoundingClientRect();
    let percent = (e.clientX - left) / width;
    const numberInStars = percent * totalStars;
    const nearestNumber =
      Math.round((numberInStars + precision / 2) / precision) * precision;
    return Number(
      nearestNumber.toFixed(precision.toString().split(".")[1]?.length || 0),
    );
  };

  function handleClear(e: MouseEvent) {
    handleNewRating(-1);
    deleteRating(media);
    setActiveStar(-1);
    setHoverActiveStar(-1);
    toggleRatedHandler(false);
  }

  function handleClick(e: MouseEvent) {
    const rating = calculateRating(e);

    if (rating == activeStar) return;

    deleteRating(media);
    setActiveStar(rating);
    createNewRating(rating, media);

    toggleRatedHandler(true);
    handleNewRating(rating);
    toggleWatchedHandler(true);
  }

  function handleMouseMove(e: MouseEvent) {
    setIsHovered(true);
    setHoverActiveStar(calculateRating(e));
  }

  function handleMouseLeave(e: MouseEvent) {
    setHoverActiveStar(-1); // Reset to default state
    setIsHovered(false);
  }

  return (
    <div className="flex items-center gap-2">
      <div
        className="relative flex cursor-pointer items-center justify-center gap-1"
        onClick={(e) => {
          handleClick(e);
        }}
        ref={ratingContainerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {[...new Array(totalStars)].map((star, index) => {
          const activeState = isHovered ? hoverActiveStar : activeStar;

          const showEmptyIcon = activeState === -1 || activeState < index + 1;

          const isActiveRating = activeState !== 1;
          const isRatingWithPrecision = activeState % 1 !== 0;
          const isRatingEqualToIndex = Math.ceil(activeState) === index + 1;
          const showRatingWithPrecision =
            isActiveRating && isRatingWithPrecision && isRatingEqualToIndex;

          const starWidth = showRatingWithPrecision
            ? `${(activeState % 1) * 100}%`
            : "0%";

          return (
            <div key={index} className="relative">
              <div
                className="absolute overflow-hidden"
                style={{ width: `${starWidth}` }}
              >
                <FaStar size={25} className="text-primary" />
              </div>
              <div className="">
                {showEmptyIcon ? (
                  <FaRegStar size={25} className="text-stone-700" />
                ) : (
                  <FaStar size={25} className="text-primary" />
                )}
              </div>
            </div>
          );
        })}
      </div>
      {activeStar > -1 && (
        <FaXmark
          size={17.5}
          className="cursor-pointer text-stone-400"
          onClick={handleClear}
        />
      )}
    </div>
  );
}
