"use client";

import { Profile } from "@prisma/client";
import Image from "next/image";
import CommentBlockActions from "./comment-block-actions";
import { startTransition, useOptimistic, useState } from "react";
import { Button } from "../ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "../ui/separator";
import {
  createNewReviewCommentLike,
  deleteReviewCommentLike,
} from "@/lib/db-actions";
import { ScrollArea } from "../ui/scroll-area";
import { useUserContext } from "@/providers/user-context";
import Link from "next/link";

interface CommentBlockProps {
  commentId: string;
  commentUser: Pick<Profile, "id" | "username" | "profilePictureURL">;
  comment: string;
  likes: {
    activity: { user: Pick<Profile, "id" | "username" | "profilePictureURL"> };
  }[];
  ownComment?: boolean;
  date: string | null;
}

export default function CommentBlock({
  commentId,
  comment,
  commentUser,
  ownComment = false,
  date,
  likes,
}: CommentBlockProps) {
  const [openLikesDialog, setOpenLikesDialog] = useState(false);
  const [liked, setLiked] = useState(false);
  const [optimisticLikeCount, addOptimisticLikeCount] = useOptimistic(
    likes.length,
    (state: number, l: number) => {
      return state + l;
    },
  );

  const user = useUserContext();

  async function handleLike() {
    setLiked(!liked);

    if (!liked) {
      startTransition(() => {
        addOptimisticLikeCount(1);
      });
      await createNewReviewCommentLike(commentId);
    }

    if (liked) {
      startTransition(() => {
        addOptimisticLikeCount(-1);
      });
      await deleteReviewCommentLike(commentId);
    }
  }

  return (
    <div className="bg-accent my-2 rounded-lg p-4">
      <div className="flex gap-4">
        <div className="relative h-10 w-10 rounded-full bg-stone-700">
          <Image
            src={commentUser.profilePictureURL}
            alt={commentUser.username}
            fill={true}
            objectFit="cover"
            className="border-primary rounded-full"
          />
        </div>
        <div className="flex w-full justify-between">
          <div>
            <p className="text-sm font-bold">{commentUser.username}</p>
            <p className="mt-1 whitespace-pre-wrap text-xs">{comment}</p>
          </div>
          <div className="flex flex-col justify-between">
            <div className="flex gap-2">
              <p className="text-xs text-stone-400">{date}</p>

              {ownComment && (
                <div>
                  <CommentBlockActions commentId={commentId} />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              {optimisticLikeCount > 0 && (
                <Button
                  variant="link"
                  className="px-0 py-0 text-white"
                  onClick={() => setOpenLikesDialog(true)}
                >
                  <span className="text-sm">{optimisticLikeCount}</span>
                </Button>
              )}

              {user ? (
                <Button
                  variant="link"
                  className=" gap-1 px-0 py-0 text-white"
                  onClick={handleLike}
                >
                  {liked ? (
                    <>
                      <FaHeart className="text-red-500" />
                    </>
                  ) : (
                    <>
                      <FaRegHeart />
                    </>
                  )}
                </Button>
              ) : (
                <Link href="/login">
                  <FaRegHeart />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={openLikesDialog} onOpenChange={setOpenLikesDialog}>
        <DialogContent className="bg-black sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{`Likes for ${commentUser.username}'s comment`}</DialogTitle>
            <Separator className="bg-white" />
          </DialogHeader>
          <ScrollArea className="flex h-[200px]">
            {likes.map((like) => {
              return (
                <div
                  key={like.activity.user.id}
                  className="my-2 flex items-center gap-3"
                >
                  <div className="relative h-10 w-10 rounded-full bg-stone-700">
                    <FaHeart className="absolute bottom-0 right-0 z-10 text-red-500 drop-shadow" />
                    <Image
                      src={like.activity.user.profilePictureURL}
                      alt={like.activity.user.username}
                      fill={true}
                      objectFit="cover"
                      className="border-primary rounded-full"
                    />
                  </div>
                  <div className="text-sm">{like.activity.user.username}</div>
                </div>
              );
            })}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
