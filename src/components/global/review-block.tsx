"use client";

import { Media, MediaReview } from "@prisma/client";
import Image from "next/image";
import { FaHeart, FaStar, FaStarHalf } from "react-icons/fa";

import ReviewBlockActions from "./review-block-actions";

interface ReviewBlockProps {
  review: MediaReview;
  user: { username: string; profilePictureURL: string };
  date: string;
  ownReview?: boolean;
  media: Media;
}

export default function ReviewBlock({
  review,
  user,
  date,
  ownReview = false,
  media,
}: ReviewBlockProps) {
  let halfStar: boolean = false;

  // Checks if there is a half star rating
  if (review?.rating && review?.rating !== null && !(review.rating % 1 == 0)) {
    halfStar = true;
  }

  return (
    <div className="bg-accent rounded-lg p-6">
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-16 w-16 rounded-full bg-stone-700">
            <Image
              src={user.profilePictureURL}
              alt={user.username}
              fill={true}
              objectFit="cover"
              className="border-primary rounded-full "
            />
          </div>
          <div>
            <p>
              <span className="text-stone-300">Reviewed by</span>{" "}
              {user.username}
            </p>
            <p className="text-xs text-stone-300">{date}</p>
            <div className="mt-2 flex gap-2">
              {review?.liked && <FaHeart className="text-red-500" />}
              <div className="flex gap-0.5">
                {review?.rating &&
                  Array.from({ length: review?.rating }).map((_item, index) => (
                    <FaStar className="text-primary" key={index} />
                  ))}

                {halfStar && <FaStarHalf className="text-primary" />}
              </div>
            </div>
          </div>
        </div>
        {ownReview && <ReviewBlockActions media={media} review={review} />}
      </div>
      <p className="mt-6 text-sm">{review?.review}</p>
    </div>
  );
}
