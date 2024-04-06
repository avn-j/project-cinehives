"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import MovieCard from "@/components/global/movie-card";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaEye, FaHeart, FaList, FaStar } from "react-icons/fa";
import { fetchTopMovieData } from "@/lib/moviedb-actions";
import { _buildAppDataForMedias } from "@/lib/media-data-builder";
import { User } from "@supabase/supabase-js";
import { SETUP_FORMS_TYPES } from "../setup-form-container";
import { MediaDataWithUserActivity } from "@/lib/types";

interface MediaSetupCarouselProps {
  initialMediaCollection: MediaDataWithUserActivity[];
  user: User;
  handleFormChange: Function;
}

export default function MovieSetupCarousel({
  initialMediaCollection,
  user,
  handleFormChange,
}: MediaSetupCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [page, setPage] = useState(1);
  const [media, setMedia] = useState(initialMediaCollection);
  const [carouselEnd, setCarouselEnd] = useState(false);

  const loadMoreMedia = async () => {
    const next = page + 1;

    const _apiTopFilmData = await fetchTopMovieData(next);
    const topFilmData = await _buildAppDataForMedias(_apiTopFilmData.results);

    setMedia([...topFilmData]);
    setPage(next);
    setCarouselEnd(false);
    api?.scrollTo(0, false);
  };

  function handleShowMore() {
    loadMoreMedia();
  }

  function handleContinue() {
    handleFormChange(SETUP_FORMS_TYPES.tvShows);
  }

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("settle", () => {
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
            {media.map((media: MediaDataWithUserActivity) => {
              return (
                <CarouselItem key={media.apiId}>
                  <div className="flex justify-center">
                    <MovieCard
                      media={{
                        apiId: media.apiId,
                        mediaType: media.mediaType,
                        posterPath: media.posterPath,
                        title: media.title,
                      }}
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
          <h2 className="text-3xl font-bold">
            {"Let's take a look at some movies you might've already seen"}
          </h2>
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
            className="mt-8 w-1/3 bg-secondary text-base text-stone-950"
            disabled={!carouselEnd}
            onClick={handleShowMore}
          >
            Show more
          </Button>
          <Button
            className="mt-8 w-2/3 text-base text-stone-950"
            onClick={handleContinue}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
