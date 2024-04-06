"use client";

import MovieCard from "../global/movie-card";
import { useEffect, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { _buildAppDataForMedias } from "@/lib/media-data-builder";
import {
  fetchTrendingMovieData,
  fetchTrendingTVShowData,
} from "@/lib/moviedb-actions";
import { useInView } from "react-intersection-observer";
import { MediaType } from "@prisma/client";
import { MediaDataWithUserActivity } from "@/lib/types";

interface InitialLoadProps {
  initialMediaCollection: any[];
  mediaType: MediaType;
}
export default function InitialLoad({
  initialMediaCollection,
  mediaType,
}: InitialLoadProps) {
  const [visibleMedias, setVisibleMedias] = useState<any[]>(
    initialMediaCollection,
  );
  const [page, setPage] = useState(1);
  const [ref, inView] = useInView();

  const loadMoreMedia = async () => {
    const next = page + 1;

    let _apiTopRatedMedia;

    switch (mediaType) {
      case "FILM":
        _apiTopRatedMedia = await fetchTrendingMovieData(next);
        break;
      case "TV":
        _apiTopRatedMedia = await fetchTrendingTVShowData(next);
        break;
    }

    if (_apiTopRatedMedia?.results.length > 0) {
      const medias = await _buildAppDataForMedias(_apiTopRatedMedia.results);

      // Gets unique values to ensure same key render error doesn't occur
      const old = visibleMedias.map((m) => JSON.stringify(m));
      const unique = medias.filter((m) => !old.includes(JSON.stringify(m)));

      setVisibleMedias((prev) => [...prev, ...unique]);
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
        {visibleMedias.map((media: MediaDataWithUserActivity) => (
          <MovieCard
            media={{
              apiId: media.apiId,
              mediaType: media.mediaType,
              posterPath: media.posterPath,
              title: media.title,
            }}
            rating={media.rating}
            userActivity={media.userActivity}
            key={media.apiId}
          />
        ))}
      </div>
      <div ref={ref} className="mt-16 flex w-full justify-center">
        <ImSpinner2 className="animate-spin text-primary" size={30} />
      </div>
    </>
  );
}
