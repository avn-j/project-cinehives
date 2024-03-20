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
import { Media, MediaType } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import { MOVIE_DB_IMG_PATH_PREFIX } from "@/lib/consts";
import AverageMediaRating from "@/components/global/average-media-rating";
import {
  getAverageRatingForMedia,
  getAllInteractionsForMedia,
  getReviewsForMedia,
} from "@/lib/db-actions";
import { FaEye, FaHeart, FaList } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import ReviewButton from "@/components/global/buttons/review-button";
import ReviewBlock from "@/components/global/review-block";

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
    poster_path,
    runtime,
    release_date,
    backdrop_path,
    tagline,
  } = result;

  const mediaData = await buildDataForMedia(result, user.id);
  const rating = await getAverageRatingForMedia(id);
  const reviews = await getReviewsForMedia(id);
  const interactions = await getAllInteractionsForMedia(id);
  const director = result.credits.crew.filter((person: any) => {
    return person.job === "Director";
  })[0];
  const cast = result.credits.cast;
  const crew: any[] = result.credits.crew;
  const crewByDepartments = crew.reduce((x, y) => {
    (x[y.department] = x[y.department] || []).push(y);

    return x;
  }, {});

  // Show all crew in component
  const crewDepartments = Object.keys(crewByDepartments);

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
        <div className="-mt-36 grid grid-cols-3 gap-8">
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
            <Accordion type="single" collapsible className="mt-8">
              <AccordionItem value="cast">
                <AccordionTrigger className="text-xl">Cast</AccordionTrigger>
                <AccordionContent>
                  {cast.slice(0, 20).map((person: any) => {
                    return (
                      <TooltipProvider key={person.id}>
                        <Tooltip delayDuration={1.5}>
                          <TooltipTrigger>
                            <Badge
                              variant="outline"
                              className="m-1 text-stone-50"
                            >
                              {person.name}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="bg-accent">
                            <p className="text-xs">
                              Starring as {person.character}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="crew">
                <AccordionTrigger className="text-xl">Crew</AccordionTrigger>
                <AccordionContent>
                  <h3 className="mt-2">Directing</h3>
                  <Separator className="my-2 w-1/2 bg-stone-50" />
                  {crewByDepartments.Directing.map((member: any) => {
                    return (
                      <TooltipProvider key={member.id}>
                        <Tooltip delayDuration={1.5}>
                          <TooltipTrigger>
                            <Badge
                              variant="outline"
                              className="m-1 text-stone-50"
                            >
                              {member.name}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="bg-accent">
                            <p className="text-xs">{member.job}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}

                  <h3 className="mt-4">Writing</h3>
                  <Separator className="my-2 w-1/2 bg-stone-50" />
                  {crewByDepartments.Writing.map((member: any) => {
                    return (
                      <TooltipProvider key={member.id}>
                        <Tooltip delayDuration={1.5}>
                          <TooltipTrigger>
                            <Badge
                              variant="outline"
                              className="m-1 text-stone-50"
                            >
                              {member.name}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="bg-accent">
                            <p className="text-xs">{member.job}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}

                  <h3 className="mt-4">Production</h3>
                  <Separator className="my-2 w-1/2 bg-stone-50" />
                  {crewByDepartments.Production.map((member: any) => {
                    return (
                      <TooltipProvider key={member.id}>
                        <Tooltip delayDuration={1.5}>
                          <TooltipTrigger>
                            <Badge
                              variant="outline"
                              className="m-1 text-stone-50"
                            >
                              {member.name}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="bg-accent">
                            <p className="text-xs">{member.job}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}

                  <h3 className="mt-4">Editing</h3>
                  <Separator className="my-2 w-1/2 bg-stone-50" />
                  {crewByDepartments.Editing.map((member: any) => {
                    return (
                      <TooltipProvider key={member.id}>
                        <Tooltip delayDuration={1.5}>
                          <TooltipTrigger>
                            <Badge
                              variant="outline"
                              className="m-1 text-stone-50"
                            >
                              {member.name}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="bg-accent">
                            <p className="text-xs">{member.job}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="col-span-2 mt-40">
            <h1 className=" text-4xl font-bold">
              {title} {original_title !== title ? `(${original_title})` : ""}
            </h1>
            <h2 className="mt-2 text-3xl"> ({release_date.split("-")[0]})</h2>
            <p className="mt-2 text-lg">Directed by {director.name}</p>
            <p className="mt-2">{runtime} mins</p>
            <div className="mt-2 flex gap-2">
              <p className="text-xl">
                {rating?._avg.rating && rating?._avg.rating}
              </p>
              <AverageMediaRating
                rating={rating?._avg.rating}
                count={rating?._count.rating}
              />
            </div>

            <div className="mt-10 flex gap-3">
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
            <h2 className="mt-10 text-lg font-bold">{tagline}</h2>
            <p className="mt-3 text-xl leading-8">{overview}</p>
            <div className="mt-8 flex gap-3">
              {genres.map((genre: any) => {
                return (
                  <Badge className="text-black" key={genre.id}>
                    {genre.name}
                  </Badge>
                );
              })}
            </div>
            <div className="mt-16 flex items-center justify-between">
              <h2 className="text-xl">Reviews</h2>
              <ReviewButton media={mediaDbItem} />
            </div>

            <Separator className="my-2 bg-stone-50" />
            <div className="flex flex-col gap-2">
              {reviews.map((review, index) => (
                <ReviewBlock
                  review={review.MediaReview}
                  user={review.user}
                  date={review.createdAt}
                  key={index}
                />
              ))}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
