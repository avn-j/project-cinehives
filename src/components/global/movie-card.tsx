"use client";

import Image from "next/image";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Badge } from "../ui/badge";
import { MovieCardStatus } from "@/lib/enums";
import LikeButton from "./icon-buttons/like-button";
import { User } from "@supabase/supabase-js";
import WatchButton from "./icon-buttons/watch-button";
import WatchlistButton from "./icon-buttons/watchlist-button";
import RateButton from "./icon-buttons/rate-button";
import { useState } from "react";
import { Media } from "@prisma/client";
import { Skeleton } from "../ui/skeleton";

export interface MovieProps {
  id: number;
  title: string;
  src: string;
  alt: string;
  status?: MovieCardStatus;
  userActivity: string[];
  rating: number;
  keepOpen?: boolean;
}

export default function MovieCard({
  keepOpen = undefined,
  ...props
}: MovieProps) {
  const [liked, setLiked] = useState(
    props.userActivity?.includes("like") || false,
  );
  const [watched, setWatched] = useState(
    props.userActivity?.includes("watched") || false,
  );
  const [onWatchlist, setOnWatchlist] = useState(
    props.userActivity?.includes("watchlist") || false,
  );
  const [rated, setRated] = useState(
    props.userActivity?.includes("rating") || false,
  );
  const [newRating, setNewRating] = useState<number | null>(null);

  const mediaDbItem: Media = {
    mediaId: props.id,
    title: props.title,
    posterPath: props.src,
  };

  if (!props.status) {
    props.status = MovieCardStatus.None;
  }

  function toggleLikeHandler(liked: boolean) {
    setLiked(liked);
  }

  function toggleWatchlistHandler(onWatchlist: boolean) {
    setOnWatchlist(onWatchlist);
  }

  function toggleRatedHandler(rated: boolean) {
    setRated(rated);
  }

  function toggleWatchedHandler(watched: boolean) {
    setWatched(watched);
  }

  function handleNewRating(rating: number) {
    setNewRating(rating);
  }

  return (
    <>
      <HoverCard openDelay={0} closeDelay={0} open={keepOpen}>
        <HoverCardTrigger asChild>
          <div className="relative">
            {props.status == MovieCardStatus.Reviewed && (
              <Badge className="absolute left-3 top-3 rounded-sm text-sm uppercase text-black">
                Reviewed
              </Badge>
            )}
            {props.status == MovieCardStatus.Rewatched && (
              <Badge className="absolute left-3 top-3 rounded-sm text-sm uppercase text-black">
                Rewatched
              </Badge>
            )}
            <Image
              src={props.src}
              alt={props.alt}
              width={400}
              height={400}
              className="rounded border-2 border-green-50 border-opacity-15"
              loading="eager"
            />
          </div>
        </HoverCardTrigger>
        <HoverCardContent
          className="w-full rounded-xl border-0 bg-black bg-opacity-70 shadow-none"
          align="center"
          side="bottom"
          sideOffset={-70}
          avoidCollisions={false}
        >
          <div className="flex justify-center gap-8">
            <LikeButton
              media={mediaDbItem}
              liked={liked}
              toggleLikeHandler={toggleLikeHandler}
            />
            <WatchButton
              media={mediaDbItem}
              watched={watched}
              toggleWatchedHandler={toggleWatchedHandler}
            />
            <WatchlistButton
              media={mediaDbItem}
              onWatchlist={onWatchlist}
              toggleWatchlistHandler={toggleWatchlistHandler}
            />
            <RateButton
              media={mediaDbItem}
              rated={rated}
              rating={newRating ? newRating : props.rating}
              toggleWatchedHandler={toggleWatchedHandler}
              toggleRatedHandler={toggleRatedHandler}
              handleNewRating={handleNewRating}
            />
          </div>
        </HoverCardContent>
      </HoverCard>
      {/* {props.userRating && (
        <UserRating
          username={props.userRating.username}
          rating={props.userRating.rating}
          profilePictureSrc={props.userRating.profilePictureSrc}
        />
      )} */}
    </>
  );
}
