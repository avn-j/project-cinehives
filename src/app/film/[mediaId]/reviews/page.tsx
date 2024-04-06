import Section from "@/components/global/layout/section";
import MovieCard from "@/components/global/movie-card";
import Navbar from "@/components/global/navbar";
import { getUser, getUserProfile } from "@/lib/authentication-functions";
import { _buildAppDataForMedia } from "@/lib/media-data-builder";
import { fetchMovieDetailsById } from "@/lib/moviedb-actions";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import { MOVIE_DB_IMG_PATH_PREFIX } from "@/lib/consts";
import AverageMediaRating from "@/components/global/average-media-rating";
import {
  getAverageRatingForMedia,
  getAllInteractionsForMedia,
  getAllReviewsForMedia,
  MediaDatabase,
} from "@/lib/db-actions";
import { FaEye, FaHeart, FaList } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ReviewBlock from "@/components/global/review-block";
import { DateTime } from "luxon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ReviewDialog from "@/components/global/buttons/review-dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function FilmReviewsPage({
  params,
}: {
  params: { mediaId: string };
}) {
  const user = await getUser();
  const profile = await getUserProfile(user);
  if (user && !profile) redirect("/account/setup");

  const _apiResult = await fetchMovieDetailsById(params.mediaId);

  if (_apiResult.success === false) notFound();

  const {
    original_title,
    id,
    genres,
    title,
    production_companies,
    runtime,
    release_date,
    backdrop_path,
  } = _apiResult;

  const media = await _buildAppDataForMedia(_apiResult);

  const dbMedia: MediaDatabase = {
    apiId: media.apiId,
    mediaType: media.mediaType,
    posterPath: media.posterPath,
    title: media.title,
  };

  const rating = await getAverageRatingForMedia(dbMedia);
  const reviews = await getAllReviewsForMedia(dbMedia);
  const interactions = await getAllInteractionsForMedia(dbMedia);
  const watched = media.userActivity.includes("WATCHED");

  const director = _apiResult.credits.crew.filter((person: any) => {
    return person.job === "Director";
  })[0];
  const watchedCount = interactions?._count.mediaWatches || 0;
  const likeCount = interactions?._count.mediaLikes || 0;
  const watchlistCount = interactions?._count.mediaOnWatchlists || 0;

  return (
    <>
      <Navbar />

      <main>
        <div className="relative min-h-[600px]">
          <Image
            src={MOVIE_DB_IMG_PATH_PREFIX + backdrop_path}
            layout="fill"
            className="-z-10 object-cover object-top"
            alt="Banner"
          />
        </div>
        <Section>
          <div className="-mt-36 grid grid-cols-4 gap-8">
            <div>
              <MovieCard
                media={dbMedia}
                rating={media.rating}
                userActivity={media.userActivity}
              />

              <ReviewDialog media={dbMedia} watched={watched}>
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

                <div className="mt-8">
                  <h3 className="font-semibold">Runtime</h3>
                  <p className="mt-1 text-sm">{runtime} mins</p>
                </div>

                <div className="mt-8">
                  <h3 className="font-semibold">Release Date</h3>
                  <p className="mt-1 text-sm">
                    {DateTime.fromISO(release_date).toFormat("DD")}
                  </p>
                </div>

                <div className="mt-8">
                  <h3 className="font-semibold">Production Company</h3>
                  <div className="mt-2 flex flex-col gap-2">
                    {production_companies.map((company: any) => {
                      return (
                        <p key={company.id} className="text-sm">
                          {company.name}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-3 mt-40">
              <Link href={`/film/${id}`}>
                <h1 className=" text-4xl font-bold">
                  {title}{" "}
                  {original_title !== title ? `(${original_title})` : ""}
                </h1>
              </Link>
              <h2 className="mt-2 text-3xl"> ({release_date.split("-")[0]})</h2>
              <p className="mt-2 text-lg">Directed by {director.name}</p>

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
                  All Reviews for {title} ({reviews?.length})
                </h2>
              </div>

              <Separator className="my-2 bg-stone-50" />
              <div className="flex flex-col gap-2">
                {reviews?.length === 0 && (
                  <p className="mt-3">No reviews yet for {media.title}</p>
                )}
                {reviews?.map((review, index) => {
                  const postedDate = DateTime.fromJSDate(
                    review.activity.createdAt,
                  ).toFormat("DD");

                  let hasLiked = false;
                  if (user)
                    hasLiked = review.reviewLikes.some((value) => {
                      return value.activity.user.id === user.id;
                    });

                  const {
                    relatedMedia,
                    activity,
                    reviewLikes,
                    ...reviewContent
                  } = review;
                  return (
                    <ReviewBlock
                      review={{ mediaId: media.apiId, ...reviewContent }}
                      reviewUser={activity.user}
                      date={postedDate}
                      key={index}
                      media={dbMedia}
                      watched={watched}
                      likes={reviewLikes}
                      hasLiked={hasLiked}
                      commentCount={review._count.reviewComments}
                    />
                  );
                })}
                {reviews?.length === 0 && (
                  <p className="mt-8 text-stone-400">
                    There are no reviews yet for {title}.
                  </p>
                )}
              </div>
            </div>
          </div>
        </Section>
      </main>
    </>
  );
}
