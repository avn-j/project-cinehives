"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Media } from "@/lib/types";
import MovieCard from "@/components/global/movie-card";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaCheckCircle, FaEye, FaHeart, FaList, FaStar } from "react-icons/fa";
import { fetchTopMovieData } from "@/lib/moviedb-actions";
import { buildMovieData } from "@/lib/movie-data-builder";
import { User } from "@supabase/supabase-js";
import { SETUP_FORMS_TYPES } from "../setup-form-container";

interface MediaSetupCarouselProps {
  initialMediaCollection: Media[];
  user: User;
  handleFormChange: Function;
}

export default function MovieSetupCarousel({
  ...props
}: MediaSetupCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [page, setPage] = useState(1);
  const [media, setMedia] = useState(props.initialMediaCollection);
  const [carouselEnd, setCarouselEnd] = useState(false);

  const loadMoreMedia = async () => {
    const next = page + 1;

    const topRatedMovieData = await fetchTopMovieData(next);
    const refinedTopRatedMovieData = await buildMovieData(
      topRatedMovieData.results,
      props.user,
    );

    setMedia([...refinedTopRatedMovieData]);
    setPage(next);
    setCarouselEnd(false);
    api?.scrollTo(0, false);
  };

  function handleShowMore() {
    loadMoreMedia();
  }

  function handleContinue() {
    props.handleFormChange(SETUP_FORMS_TYPES.tvShows);
  }

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("slidesInView", () => {
      if (api.canScrollNext() === false) {
        setCarouselEnd(true);
      } else {
        setCarouselEnd(false);
      }
    });
  }, [api]);

  return (
    <div className="mt-12 flex gap-28">
      <div className="flex w-1/2 flex-col items-center justify-center">
        <Carousel
          opts={{ slidesToScroll: 1 }}
          className="max-w-lg"
          setApi={setApi}
        >
          <CarouselContent>
            {media.map((media: Media) => {
              return (
                <CarouselItem key={media.id}>
                  <div className="flex justify-center">
                    <MovieCard
                      title={media.title}
                      id={media.id}
                      alt={media.title}
                      src={media.posterPath}
                      rating={media.rating}
                      userActivity={media.userActivity}
                    />
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      <div className="flex w-1/2 flex-col justify-between">
        <div className="">
          <div className="bg-accent w-full rounded-lg p-6">
            <div className="flex items-center gap-4">
              <FaCheckCircle size={25} />
              <h2 className="text-3xl font-bold">Account setup successful</h2>
            </div>

            <p className="mt-4 text-wrap text-lg">
              Your account has been successfully created. Your account <br />
              has been successfully created.
            </p>
          </div>
          <h2 className="mt-8 text-3xl font-bold">{"Let's start!"}</h2>
          <p className="mt-4 text-xl">
            Hover over each movie to reveal the following action buttons:
          </p>
          <ul className="mt-6 flex flex-col gap-2 text-lg">
            <li>
              <FaHeart className="mr-1 inline-block" size={20} /> to mark as
              movie as liked.
            </li>
            <li>
              <FaEye className="mr-1 inline-block" size={20} /> to mark as movie
              as watched.
            </li>
            <li>
              <FaList className="mr-1 inline-block" size={20} /> to add a movie
              to your watchlist.
            </li>
            <li>
              <FaStar className="mr-1 inline-block" size={20} /> to give a movie
              a rating.
            </li>
          </ul>
        </div>

        <div className="flex gap-4">
          <Button
            className="bg-secondary mt-8 w-1/3 text-lg text-stone-950"
            disabled={!carouselEnd}
            onClick={handleShowMore}
          >
            Show more
          </Button>
          <Button
            className="mt-8 w-2/3 text-lg text-stone-950"
            onClick={handleContinue}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
