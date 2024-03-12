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
import { checkRating } from "@/lib/db-actions";
import WatchButton from "./icon-buttons/watch-button";
import WatchlistButton from "./icon-buttons/watchlist-button";
import RateButton from "./icon-buttons/rate-button";
import { useState } from "react";

export interface MovieProps {
  id: number;
  src: string;
  alt: string;
  status?: MovieCardStatus;
  userActivity: string[];
  user: User;
  rating: number;
}

export default function MovieCard({ ...props }: MovieProps) {
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
    <div>
      <HoverCard openDelay={0} closeDelay={0}>
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
              width={250}
              height={0}
              className="rounded border-2 border-green-50 border-opacity-15"
            />
          </div>
        </HoverCardTrigger>
        <HoverCardContent
          className="h-full rounded border-0 bg-black bg-opacity-70 shadow-none"
          align="center"
          side="bottom"
          sideOffset={-55}
        >
          <div className="flex justify-center gap-8">
            <LikeButton
              mediaId={props.id}
              liked={liked}
              toggleLikeHandler={toggleLikeHandler}
            />
            <WatchButton
              mediaId={props.id}
              watched={watched}
              toggleWatchedHandler={toggleWatchedHandler}
            />
            <WatchlistButton
              mediaId={props.id}
              onWatchlist={onWatchlist}
              toggleWatchlistHandler={toggleWatchlistHandler}
            />
            <RateButton
              mediaId={props.id}
              rated={rated}
              user={props.user}
              rating={newRating ? newRating : props.rating}
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
    </div>
  );
}
