import Section from "@/components/global/layout/section";
import MovieCard from "@/components/global/movie-card";
import Navbar from "@/components/global/navbar";
import { getUser, getUserProfile } from "@/lib/authentication-functions";
import { buildDataForMedia } from "@/lib/movie-data-builder";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { fetchMovieDetailsById } from "@/lib/moviedb-actions";
import { Media, MediaReview, MediaType } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import { MOVIE_DB_IMG_PATH_PREFIX } from "@/lib/consts";
import AverageMediaRating from "@/components/global/average-media-rating";
import {
  getAverageRatingForMedia,
  getAllInteractionsForMedia,
  getRecentReviewsForMedia,
  getUserReviewForMedia,
} from "@/lib/db-actions";
import { FaEye, FaHeart, FaList } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ReviewButton from "@/components/global/buttons/review-dialog";
import ReviewBlock from "@/components/global/review-block";
import CastCarousel from "@/components/global/cast-carousel";
import { DateTime } from "luxon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ReviewDialog from "@/components/global/buttons/review-dialog";
import { Button } from "@/components/ui/button";

export default async function FilmPage({
  params,
}: {
  params: { mediaId: string };
}) {
  const user = await getUser();
  if (!user) redirect("/");
  const profile = await getUserProfile(user);
  if (!profile) redirect("/account/setup");

  const result = await fetchMovieDetailsById(params.mediaId);

  if (result.success === false) notFound();

  const {
    original_title,
    id,
    genres,
    overview,
    title,
    production_companies,
    poster_path,
    runtime,
    release_date,
    backdrop_path,
    tagline,
  } = result;

  const mediaData = await buildDataForMedia(result, user.id);
  const rating = await getAverageRatingForMedia(id);
  const recentReviews = await getRecentReviewsForMedia(id);
  const userReview = await getUserReviewForMedia(id);
  const interactions = await getAllInteractionsForMedia(id);
  const watched = mediaData.userActivity.includes("watched");

  const director = result.credits.crew.filter((person: any) => {
    return person.job === "Director";
  })[0];
  const cast = result.credits.cast;
  const crew: any[] = result.credits.crew;
  const watchedCount = interactions?._count.MediaWatched || 0;
  const likeCount = interactions?._count.MediaLike || 0;
  const watchlistCount = interactions?._count.MediaWatchlist || 0;
  const crewByDepartments = crew.reduce((x, y) => {
    (x[y.department] = x[y.department] || []).push(y);

    return x;
  }, {});

  const mediaDbItem: Media = {
    mediaId: mediaData.id,
    title: mediaData.title,
    posterPath: mediaData.posterPath,
    mediaType: MediaType.film,
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
        <div className="-mt-36 grid grid-cols-4 gap-8">
          <div>
            <MovieCard
              alt={result.title}
              id={result.id}
              mediaType={MediaType.film}
              rating={mediaData.rating}
              src={mediaData.posterPath}
              title={result.title}
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
                      {watchedCount} {watchedCount > 1 ? "users" : "user"} has
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
                      {likeCount} {likeCount > 1 ? "users" : "user"} has liked
                      this
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
                      {watchlistCount} {watchlistCount > 1 ? "users" : "user"}{" "}
                      has this on their watchlist
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
            <h1 className=" text-4xl font-bold">
              {title} {original_title !== title ? `(${original_title})` : ""}
            </h1>
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

            <h2 className="mt-10 text-lg font-bold">{tagline}</h2>
            <p className="mt-3 text-lg leading-7">{overview}</p>

            <Accordion type="single" collapsible className="mt-8">
              <AccordionItem value="cast">
                <AccordionTrigger className="text-xl">Cast</AccordionTrigger>
                <AccordionContent>
                  <CastCarousel cast={cast} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {userReview.length !== 0 && (
              <div className="mt-16">
                <h2 className="text-xl">Your Review</h2>
                <Separator className="my-2 bg-stone-50" />
                <div className="flex flex-col gap-2">
                  {userReview.map((review, index) => {
                    const postedDate = DateTime.fromJSDate(
                      review.Activity.createdAt,
                    ).toFormat("DD");

                    return (
                      <ReviewBlock
                        review={{
                          activityId: review.activityId,
                          liked: review.liked,
                          mediaId: review.Media.mediaId,
                          rating: review.rating,
                          review: review.review,
                          spoiler: review.spoiler,
                          rewatched: review.rewatched,
                        }}
                        user={review.Activity.user}
                        date={postedDate}
                        key={index}
                        media={mediaDbItem}
                        ownReview
                        watched={watched}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-16 flex items-center justify-between">
              <h2 className="text-xl">Recent Reviews</h2>
            </div>

            <Separator className="my-2 bg-stone-50" />
            <div className="flex flex-col gap-2">
              {recentReviews.map((review, index) => {
                const postedDate = DateTime.fromJSDate(
                  review.Activity.createdAt,
                ).toFormat("DD");
                return (
                  <ReviewBlock
                    review={{
                      activityId: review.activityId,
                      liked: review.liked,
                      mediaId: review.Media.mediaId,
                      rating: review.rating,
                      review: review.review,
                      spoiler: review.spoiler,
                      rewatched: review.rewatched,
                    }}
                    user={review.Activity.user}
                    date={postedDate}
                    key={index}
                    media={mediaDbItem}
                    watched={watched}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
