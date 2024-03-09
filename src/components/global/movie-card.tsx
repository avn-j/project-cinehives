import Image from "next/image";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { FaHeart, FaEye, FaList, FaStar } from "react-icons/fa";
import { Badge } from "../ui/badge";
import { MovieCardStatus } from "@/lib/enums";
import UserRating from "./user-rating";
import LikeButton from "./icon-buttons/like-button";
import { UserRating as UserRatingType } from "@/types/types";
import { getUser } from "@/lib/authentication-functions";
import prisma from "../../../prisma/client";

export interface MovieProps {
  id: number;
  src: string;
  alt: string;
  status?: MovieCardStatus;
  userRating?: UserRatingType;
}

async function checkLiked(mediaId: number) {
  const user = await getUser();

  if (!user) return false;
  const like = await prisma.likes.findFirst({
    where: {
      user_id: user.id,
      media_id: mediaId,
    },
  });

  return like ? true : false;
}

export default async function MovieCard({ ...props }: MovieProps) {
  if (!props.status) {
    props.status = MovieCardStatus.None;
  }

  const liked = await checkLiked(props.id);

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
            <FaEye size={25} />
            <FaList size={25} />
            <FaStar size={25} />
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
