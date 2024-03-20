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
import { FaEye, FaHeart, FaList, FaStar } from "react-icons/fa";
import { fetchTopTVShowData } from "@/lib/moviedb-actions";
import { buildDataForMedias } from "@/lib/movie-data-builder";
import { User } from "@supabase/supabase-js";
import { setProfileFinished } from "@/lib/authentication-functions";
import { MediaType } from "@prisma/client";

interface MediaSetupCarouselProps {
  initialMediaCollection: Media[];
  user: User;
  handleFormChange: Function;
}

export default function TVSetupCarousel({ ...props }: MediaSetupCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [page, setPage] = useState(1);
  const [media, setMedia] = useState(props.initialMediaCollection);
  const [carouselEnd, setCarouselEnd] = useState(false);
  const [finishClicked, setFinishedClicked] = useState(false);

  const loadMoreMedia = async () => {
    const next = page + 1;

    const topRatedMovieData = await fetchTopTVShowData(next);
    const refinedTopRatedMovieData = await buildDataForMedias(
      topRatedMovieData.results,
      props.user.id,
    );

    setMedia([...refinedTopRatedMovieData]);
    setPage(next);
    setCarouselEnd(false);
    api?.scrollTo(0, false);
  };

  const handleShowMore = () => {
    loadMoreMedia();
  };

  function handleFinish() {
    setFinishedClicked(true);
    setProfileFinished(props.user.id);
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
                      mediaType={MediaType.TV}
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
        <div className="w-full">
          <h2 className="mt-8 text-3xl font-bold">What about TV shows?</h2>
          <p className="mt-12 text-xl">
            Hover over each TV show to reveal the following action buttons:
          </p>
          <ul className="mt-6 flex flex-col gap-2 text-lg">
            <li>
              <FaHeart className="mr-1 inline-block" size={20} /> to mark as
              show as liked.
            </li>
            <li>
              <FaEye className="mr-1 inline-block" size={20} /> to mark as show
              as watched.
            </li>
            <li>
              <FaList className="mr-1 inline-block" size={20} /> to add a show
              to your watchlist.
            </li>
            <li>
              <FaStar className="mr-1 inline-block" size={20} /> to give a show
              a rating.
            </li>
          </ul>
        </div>

        <div className="flex gap-4">
          <Button
            className="bg-secondary mt-8 w-1/3 px-6 text-base text-stone-950"
            disabled={!carouselEnd}
            onClick={handleShowMore}
          >
            Show more
          </Button>
          <Button
            className="mt-8 w-2/3 text-base text-stone-950"
            onClick={handleFinish}
            disabled={finishClicked}
          >
            Finished
          </Button>
        </div>
      </div>
    </div>
  );
}
