import Section from "@/components/global/layout/section";
import MovieCard from "@/components/global/movie-card";
import Navbar from "@/components/global/navbar";
import { getUser } from "@/lib/authentication-functions";
import { buildDataForMedia } from "@/lib/movie-data-builder";
import { fetchTVDetailsById } from "@/lib/moviedb-actions";
import { Media, MediaType } from "@prisma/client";
import { notFound } from "next/navigation";
import Image from "next/image";
import { MOVIE_DB_IMG_PATH_PREFIX } from "@/lib/consts";
import AverageMediaRating from "@/components/global/average-media-rating";
import {
  getAverageRatingForMedia,
  getAllInteractionsForMedia,
  getRecentReviewsForMedia,
  getAllReviewsForMedia,
} from "@/lib/db-actions";
import { FaEye, FaHeart, FaList } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ReviewBlock from "@/components/global/review-block";
import { DateTime } from "luxon";
import { Button } from "@/components/ui/button";
import ReviewDialog from "@/components/global/buttons/review-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

export default async function TVReviewsPage({
  params,
}: {
  params: { mediaId: string };
}) {
  const user = await getUser();

  const result = await fetchTVDetailsById(params.mediaId);

  if (result.success === false) notFound();

  const {
    original_name,
    id,
    genres,
    name,
    number_of_episodes,
    number_of_seasons,
    first_air_date,
    next_episode_to_air,
    status,
    backdrop_path,
  } = result;

  if (!user) return;
  const mediaData = await buildDataForMedia(result, user.id);
  const rating = await getAverageRatingForMedia(id);
  const reviews = await getAllReviewsForMedia(id);
  const interactions = await getAllInteractionsForMedia(id);
  const watchedCount = interactions?._count.mediaWatched || 0;
  const likeCount = interactions?._count.mediaLike || 0;
  const watchlistCount = interactions?._count.mediaWatchlist || 0;

  const watched = mediaData.userActivity.includes("watched");

  const creators = result.created_by
    ? result.created_by.map((creator: any) => creator.name)
    : [];

  const mediaDbItem: Media = {
    mediaId: mediaData.id,
    title: mediaData.title,
    posterPath: mediaData.posterPath,
    mediaType: MediaType.tv,
  };

  return (
    <>
      <Navbar />
      <div className="relative min-h-[600px]">
        <Image
          src={MOVIE_DB_IMG_PATH_PREFIX + backdrop_path}
          layout="fill"
          className="-z-10 object-cover object-top"
          alt="Banner"
        />
      </div>
      <Section>
        <div className="-mt-36 grid grid-cols-4 gap-12">
          <div className="flex flex-col">
            <MovieCard
              alt={name}
              id={id}
              mediaType={MediaType.film}
              rating={mediaData.rating}
              src={mediaData.posterPath}
              title={name}
              userActivity={mediaData.userActivity}
            />

            <ReviewDialog media={mediaDbItem} watched={watched}>
              <Button className="mt-4 w-full text-sm text-black">
                Write a Review
              </Button>
            </ReviewDialog>

            <div className="mt-10 flex gap-4">
              <TooltipProvider>
                <Tooltip delayDuration={1.5}>
                  <TooltipTrigger>
                    <div className="flex items-center gap-1">
                      <FaEye size={20} className="text-primary" />
                      <p className="text-xl">{watchedCount}</p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-accent">
                    <p>
                      {watchedCount === 0 ? "No" : watchedCount}{" "}
                      {watchedCount > 1 || watchedCount === 0
                        ? "users have "
                        : "user has "}
                      watched this
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip delayDuration={1.5}>
                  <TooltipTrigger>
                    <div className="flex items-center gap-1">
                      <FaHeart size={20} className="text-red-500" />
                      <p className="text-xl">{likeCount}</p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-accent">
                    <p>
                      {likeCount === 0 ? "No" : likeCount}{" "}
                      {likeCount > 1 || likeCount === 0
                        ? "users have "
                        : "user has "}
                      liked this
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip delayDuration={1.5}>
                  <TooltipTrigger>
                    <div className="flex items-center gap-1">
                      <FaList size={20} className="text-primary" />
                      <p className="text-xl">{watchlistCount}</p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-accent">
                    <p>
                      {watchlistCount === 0 ? "No" : watchlistCount}{" "}
                      {watchlistCount > 1 || watchlistCount === 0
                        ? "users have "
                        : "user has "}
                      this on their watchlist
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="mt-8">
              <h3 className="font-semibold">Genres</h3>
              <div className="mt-2 flex flex-wrap gap-3">
                {genres.map((genre: any) => {
                  return (
                    <Badge className="text-black" key={genre.id}>
                      {genre.name}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {first_air_date && (
              <div className="mt-8">
                <h3 className="font-semibold">Premiere</h3>
                <p className="mt-1 text-sm">
                  {DateTime.fromISO(first_air_date).toFormat("DD")}
                </p>
              </div>
            )}

            {next_episode_to_air && (
              <div className="mt-8">
                <h3 className="font-semibold">Next Episode Airing</h3>
                <p className="mt-1 text-sm">
                  {DateTime.fromISO(next_episode_to_air.air_date).toFormat(
                    "DD",
                  )}
                </p>
              </div>
            )}

            {status && (
              <div className="mt-8">
                <h3 className="font-semibold">Status</h3>
                <p className="mt-1 text-sm">{status}</p>
              </div>
            )}

            <div className="mt-8">
              <h3 className="font-semibold">Seasons & Episodes</h3>
              <p className="mt-1 text-sm">
                {number_of_seasons}{" "}
                {number_of_seasons > 1 ? "seasons" : "season"},{" "}
                {number_of_episodes} episodes
              </p>
            </div>
          </div>
          <div className="col-span-3 mt-36">
            <Link href={`/tv/${id}`}>
              <h1 className=" text-4xl font-bold">
                {name} {original_name !== name ? `(${original_name})` : ""}
              </h1>
            </Link>
            <h2 className="mt-2 text-3xl">({first_air_date.split("-")[0]})</h2>
            {creators.length > 0 && (
              <p className="mt-2 text-lg">Created by {creators.join(", ")}</p>
            )}
            <div className="mt-2 flex gap-2">
              <p className="text-xl">
                {rating?._avg.rating && rating?._avg.rating}
              </p>
              <AverageMediaRating
                rating={rating?._avg.rating}
                count={rating?._count.rating}
              />
            </div>

            <div className="mt-16 flex items-center justify-between">
              <h2 className="text-xl">
                All Reviews for {name} ({reviews.length})
              </h2>
            </div>

            <Separator className="my-2 bg-stone-50" />
            <div className="flex flex-col gap-2">
              {reviews.map((review, index) => {
                const postedDate = DateTime.fromJSDate(
                  review.activity.createdAt,
                ).toFormat("DD");
                const hasLiked = review.reviewLikes.some((value) => {
                  return value.activity.user.id === user.id;
                });
                const { media, activity, ...reviewContent } = review;
                return (
                  <ReviewBlock
                    review={{ mediaId: media.mediaId, ...reviewContent }}
                    reviewUser={activity.user}
                    date={postedDate}
                    key={index}
                    media={media}
                    watched={watched}
                    likes={reviewContent.reviewLikes}
                    hasLiked={hasLiked}
                    commentCount={review._count.reviewComments}
                  />
                );
              })}
              {reviews.length === 0 && (
                <p className="mt-8 text-stone-400">
                  There are no reviews yet for {name}.
                </p>
              )}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
