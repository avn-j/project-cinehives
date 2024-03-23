"use client";

import { Media, MediaReview, Profile } from "@prisma/client";
import Image from "next/image";
import { FaHeart, FaRegHeart, FaStar, FaStarHalf } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import ReviewBlockActions from "./review-block-actions";
import { FaRepeat } from "react-icons/fa6";
import { Button } from "../ui/button";
import { startTransition, useOptimistic, useState } from "react";
import { createNewActivityLike, deleteNewActivityLike } from "@/lib/db-actions";
import { Separator } from "../ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ReviewBlockProps {
  review: MediaReview;
  reviewUser: Pick<Profile, "id" | "username" | "profilePictureURL">;
  date: string;
  ownReview?: boolean;
  media: Media;
  watched: boolean;
  likes: { user: Pick<Profile, "id" | "username" | "profilePictureURL"> }[];
  hasLiked: boolean;
}

export default function ReviewBlock({
  review,
  reviewUser,
  date,
  ownReview = false,
  media,
  watched,
  likes,
  hasLiked,
}: ReviewBlockProps) {
  const [showSpoiler, setShowSpoiler] = useState(false);
  const [liked, setLiked] = useState(hasLiked);
  const [optimisticLikeCount, addOptimisticLikeCount] = useOptimistic(
    likes.length,
    (state: number, l: number) => {
      return state + l;
    },
  );
  const [openLikesDialog, setOpenLikesDialog] = useState(false);

  let halfStar: boolean = false;

  // Checks if there is a half star rating
  if (review.rating && !(review.rating % 1 == 0)) {
    halfStar = true;
  }

  async function handleLike() {
    setLiked(!liked);

    if (!liked) {
      startTransition(() => {
        addOptimisticLikeCount(1);
      });
      await createNewActivityLike(review.activityId);
    }

    if (liked) {
      startTransition(() => {
        addOptimisticLikeCount(-1);
      });
      await deleteNewActivityLike(review.activityId);
    }
  }

  return (
    <div className="bg-accent rounded-lg p-6">
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-16 w-16 rounded-full bg-stone-700">
            <Image
              src={reviewUser.profilePictureURL}
              alt={reviewUser.username}
              fill={true}
              objectFit="cover"
              className="border-primary rounded-full "
            />
          </div>
          <div>
            <p>
              <span className="text-stone-300">Reviewed by</span>{" "}
              {reviewUser.username}
            </p>
            <p className="text-xs text-stone-300">{date}</p>
            <div className="mt-2 flex gap-2">
              {review.rewatched && <FaRepeat />}
              {review.liked && <FaHeart className="text-red-500" />}
              <div className="flex gap-0.5">
                {review?.rating &&
                  Array.from({ length: review.rating }).map((_item, index) => (
                    <FaStar className="text-primary" key={index} />
                  ))}

                {halfStar && <FaStarHalf className="text-primary" />}
              </div>
            </div>
          </div>
        </div>
        {ownReview && <ReviewBlockActions media={media} review={review} />}
      </div>
      {!watched && review.spoiler && !showSpoiler && !ownReview ? (
        <p className="mt-6 text-sm italic">
          You have not seen this film and this review contains spoilers. Click
          <Button
            variant="link"
            className="px-1 py-0"
            onClick={() => setShowSpoiler(true)}
          >
            here
          </Button>
          to show anyway.
        </p>
      ) : (
        <p className="mt-6 whitespace-pre-wrap text-sm">{review.review}</p>
      )}
      <div className="mt-3 flex items-center justify-end gap-2">
        {optimisticLikeCount > 0 && (
          <Button
            variant="link"
            className="px-0 py-0 text-white"
            onClick={() => setOpenLikesDialog(true)}
          >
            <span className="text-sm">{optimisticLikeCount}</span>
          </Button>
        )}

        <Button
          variant="link"
          className=" gap-1 px-0 py-0 text-white"
          onClick={handleLike}
        >
          {liked ? (
            <>
              <FaHeart className="text-red-500" />
              <p className="text-sm">Unlike</p>
            </>
          ) : (
            <>
              <FaRegHeart />
              <p className="text-sm">Like</p>
            </>
          )}
        </Button>
      </div>

      <Dialog open={openLikesDialog} onOpenChange={setOpenLikesDialog}>
        <DialogContent className="bg-black sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{`Likes for ${reviewUser.username}'s review of ${media.title}`}</DialogTitle>
            <Separator className="bg-white" />
          </DialogHeader>
          {likes.map((like) => {
            return (
              <div key={like.user.id} className="flex items-center gap-3">
                <div className="relative h-10 w-10 rounded-full bg-stone-700">
                  <FaHeart className="absolute bottom-0 right-0 z-10 text-red-500 drop-shadow" />
                  <Image
                    src={like.user.profilePictureURL}
                    alt={like.user.username}
                    fill={true}
                    objectFit="cover"
                    className="border-primary rounded-full"
                  />
                </div>
                <div className="text-sm">{like.user.username}</div>
              </div>
            );
          })}
        </DialogContent>
      </Dialog>
    </div>
  );
}
