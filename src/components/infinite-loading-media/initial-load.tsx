"use client";

import { Media } from "@/lib/types";
import MovieCard from "../global/movie-card";
import { useEffect, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { useUserContext } from "@/providers/user-context";
import { buildDataForMedias } from "@/lib/movie-data-builder";
import {
  fetchTrendingMovieData,
  fetchTrendingTVShowData,
} from "@/lib/moviedb-actions";
import { useInView } from "react-intersection-observer";
import { MediaType } from "@prisma/client";

interface InitialLoadProps {
  initialMediaCollection: Media[];
  mediaType: MediaType;
}
export default function InitialLoad({
  initialMediaCollection,
  mediaType,
}: InitialLoadProps) {
  const [media, setMedia] = useState<Media[]>(initialMediaCollection);
  const [page, setPage] = useState(1);
  const [ref, inView] = useInView();
  const user = useUserContext();

  const loadMoreMedia = async () => {
    const next = page + 1;

    let topRatedMedia;

    switch (mediaType) {
      case "film":
        topRatedMedia = await fetchTrendingMovieData(next);
        break;
      case "tv":
        topRatedMedia = await fetchTrendingTVShowData(next);
        break;
    }

    if (topRatedMedia?.results.length > 0) {
      const refinedTopRatedMovieData = await buildDataForMedias(
        topRatedMedia.results,
      );

      // Gets unique values to ensure same key render error doesn't occur
      const old = media.map((m) => JSON.stringify(m));
      const unique = refinedTopRatedMovieData.filter(
        (m) => !old.includes(JSON.stringify(m)),
      );

      setMedia((prev) => [...prev, ...unique]);
      setPage(next);
    }
  };

  useEffect(() => {
    if (inView) {
      loadMoreMedia();
    }
  }, [inView]);

  return (
    <>
      <div></div>
      <div className="grid grid-cols-8 gap-6">
        {media.map((media: Media) => (
          <MovieCard
            id={media.id}
            title={media.title}
            alt={media.title}
            src={media.posterPath}
            rating={media.rating}
            userActivity={media.userActivity}
            key={media.id}
            mediaType={mediaType}
          />
        ))}
      </div>
      <div ref={ref} className="mt-16 flex w-full justify-center">
        <ImSpinner2 className="text-primary animate-spin" size={30} />
      </div>
    </>
  );
}
