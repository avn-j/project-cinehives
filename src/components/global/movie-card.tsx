import Image from "next/image";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { FaStar } from "react-icons/fa";
import { Badge } from "../ui/badge";
import { MovieCardStatus } from "@/lib/enums";
import UserRating from "./user-rating";
import LikeButton from "./icon-buttons/like-button";
import { UserRating as UserRatingType } from "@/types/types";
import { User } from "@supabase/supabase-js";
import {
  checkLiked,
  checkOnWatchlist,
  checkRating,
  checkWatched,
} from "@/lib/db-actions";
import WatchButton from "./icon-buttons/watch-button";
import WatchlistButton from "./icon-buttons/watchlist-button";
import RateButton from "./icon-buttons/rate-button";

export interface MovieProps {
  id: number;
  src: string;
  alt: string;
  status?: MovieCardStatus;
  userRating?: UserRatingType;
  user: User;
}

export default async function MovieCard({ ...props }: MovieProps) {
  if (!props.status) {
    props.status = MovieCardStatus.None;
  }

  // const liked = await checkLiked(props.id, props.user);
  // const watched = await checkWatched(props.id, props.user);
  // const onWatchlist = await checkOnWatchlist(props.id, props.user);
  // const rating = await checkRating(props.id, props.user);
  // const rated = rating > -1 ? true : false;

  const liked = false;
  const watched = false;
  const onWatchlist = false;
  const rating = -1;
  const rated = false;

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
            <LikeButton mediaId={props.id} liked={liked} />
            <WatchButton mediaId={props.id} watched={watched} />
            <WatchlistButton mediaId={props.id} onWatchlist={onWatchlist} />
            <RateButton mediaId={props.id} rated={rated} rating={rating} />
          </div>
        </HoverCardContent>
      </HoverCard>
      {props.userRating && (
        <UserRating
          username={props.userRating.username}
          rating={props.userRating.rating}
          profilePictureSrc={props.userRating.profilePictureSrc}
        />
      )}
    </div>
  );
}
