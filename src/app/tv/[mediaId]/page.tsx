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
import { fetchTVDetailsById } from "@/lib/moviedb-actions";
import { Media, MediaType } from "@prisma/client";
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
import { DateTime } from "luxon";
import CastCarousel from "@/components/global/cast-carousel";
import TVSeasons from "@/components/global/tv-seasons";
import { Button } from "@/components/ui/button";
import ReviewDialog from "@/components/global/buttons/review-dialog";

export default async function TVPage({
  params,
}: {
  params: { mediaId: string };
}) {
  const user = await getUser();
  if (!user) redirect("/");
  const profile = await getUserProfile(user);
  if (!profile) redirect("/account/setup");

  const result = await fetchTVDetailsById(params.mediaId);

  if (result.success === false) notFound();

  const {
    original_name,
    id,
    genres,
    overview,
    name,
    poster_path,
    number_of_episodes,
    number_of_seasons,
    first_air_date,
    last_episode_to_air,
    next_episode_to_air,
    status,
    backdrop_path,
    tagline,
    seasons,
  } = result;

  const mediaData = await buildDataForMedia(result, user.id);
  const rating = await getAverageRatingForMedia(id);
  const userReview = await getUserReviewForMedia(id);
  const recentReviews = await getRecentReviewsForMedia(id);
  const interactions = await getAllInteractionsForMedia(id);

  const cast = result.aggregate_credits.cast;
  const crew: any[] = result.aggregate_credits.crew;
  const watched = mediaData.userActivity.includes("watched");

  console.log(watched);

  const castByCharacters = cast.map((member: any) => {
    const characters: string[] = [];

    member.roles.forEach((role: any) => {
      characters.push(role.character);
    });

    return {
      id: member.id,
      name: member.name,
      characters: characters,
      profile_path: member.profile_path,
    };
  });

  const crewByDepartments = crew.reduce((x, y) => {
    (x[y.department] = x[y.department] || []).push(y);

    return x;
  }, {});

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
              alt={result.name}
              id={result.id}
              mediaType={MediaType.film}
              rating={mediaData.rating}
              src={mediaData.posterPath}
              title={result.name}
              userActivity={mediaData.userActivity}
            />

            <ReviewDialog media={mediaDbItem} watched={watched}>
              <Button className="mt-4 w-full text-sm text-black">
                Write a Review
              </Button>
            </ReviewDialog>

            <div className="mt-10 flex gap-4">
              <div className="flex items-center gap-1">
                {/* TODO: Add tooltips */}
                <FaEye size={20} className="text-primary" />
                <p className="text-xl">
                  {interactions?._count.MediaWatched
                    ? interactions?._count.MediaWatched
                    : 0}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {/* TODO: Add tooltips */}
                <FaHeart size={20} className="text-red-500" />
                <p className="text-xl">
                  {interactions?._count.MediaLike
                    ? interactions?._count.MediaLike
                    : 0}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {/* TODO: Add tooltips */}
                <FaList size={20} className="text-primary" />
                <p className="text-xl">
                  {interactions?._count.MediaWatchlist
                    ? interactions?._count.MediaWatchlist
                    : 0}
                </p>
              </div>
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
            <h1 className=" text-4xl font-bold">
              {name} {original_name !== name ? `(${original_name})` : ""}
            </h1>
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

            <h2 className="mt-10 text-lg font-bold">{tagline}</h2>
            <p className="mt-3 text-lg leading-7">{overview}</p>

            {status != "Ended" && (
              <div className="mt-14">
                <h2 className="text-xl">Latest Episode</h2>
                <Separator className="my-2 bg-stone-50" />
                <div className="mt-8 flex items-center gap-4">
                  <Image
                    alt={last_episode_to_air.id}
                    src={
                      MOVIE_DB_IMG_PATH_PREFIX + last_episode_to_air.still_path
                    }
                    width={300}
                    height={300}
                    className="rounded border-2 border-green-50 border-opacity-15 object-cover"
                  />
                  <div>
                    <h3 className="text-sm">
                      Season {last_episode_to_air.season_number} Episode{" "}
                      {last_episode_to_air.episode_number}
                    </h3>
                    <h3 className="text-2xl font-bold">
                      {last_episode_to_air.name}
                    </h3>
                    <p className="text-xs text-stone-400">
                      {last_episode_to_air.runtime} mins
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8">
              <h2 className="text-xl">Seasons ({number_of_seasons})</h2>
              <Separator className="my-2 bg-stone-50" />
              <TVSeasons seasons={seasons} />
            </div>

            <Accordion type="single" collapsible className="mt-8">
              <AccordionItem value="cast">
                <AccordionTrigger className="text-xl">Cast</AccordionTrigger>
                <AccordionContent>
                  <CastCarousel cast={castByCharacters} />
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
              {recentReviews.length === 0 && (
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
