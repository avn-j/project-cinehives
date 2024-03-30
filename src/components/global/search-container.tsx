"use client";

import { useEffect, useState } from "react";
import SearchPagination from "./search-pagination";
import Link from "next/link";
import { Separator } from "../ui/separator";
import Image from "next/image";
import MovieCard from "./movie-card";
import { MOVIE_DB_IMG_PATH_PREFIX } from "@/lib/consts";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";

interface SearchContainerProps {
  query: string;
  searchResults: {
    all: any[];
    tv: any[];
    films: any[];
    anime: any[];
    users: any[];
  };
  page: number;
  filterType: string;
}

export default function SearchContainer({
  query,
  searchResults,
  page,
  filterType,
}: SearchContainerProps) {
  const [filter, setFilter] = useState(filterType);
  const [results, setResults] = useState<any[] | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  const router = useRouter();
  const pathname = usePathname();

  console.log(pathname);

  const filterCategories = ["All", "Films", "TV", "Anime", "Users"];

  useEffect(() => {
    const slicedIndexStart = page === 1 ? 0 : page * 20;
    const slicedIndexEnd = slicedIndexStart + 20;
    if (filter === "all") {
      const slicedResults = [...searchResults.all];
      setResults(slicedResults.slice(slicedIndexStart, slicedIndexEnd));
      setTotalPages(calculateTotalPages(searchResults.all));
    }
    if (filter === "tv") {
      setResults(searchResults.tv.slice(0, 20));
      setTotalPages(calculateTotalPages(searchResults.tv));
    }
    if (filter === "anime") {
      setResults(searchResults.anime.slice(0, 20));
      setTotalPages(calculateTotalPages(searchResults.anime));
    }
    if (filter === "films") {
      setResults(searchResults.films.slice(0, 20));
      setTotalPages(calculateTotalPages(searchResults.films));
    }
    if (filter === "users") {
      setResults(searchResults.users.slice(0, 20));
      setTotalPages(calculateTotalPages(searchResults.users));
    }
  }, [filter, searchResults]);

  function calculateTotalPages(array: any[]) {
    if (array.length === 0) return 1;

    const flooredTotalPages = Math.floor(array.length / 20);
    const totalPages =
      flooredTotalPages === 1 || flooredTotalPages === 0
        ? 1
        : flooredTotalPages - 1;
    return totalPages;
  }

  function handleFilterChange(category: string) {
    setFilter(category);
    router.replace(`${pathname}?type=${category}`, undefined);
  }

  return (
    <div className="mt-8 grid grid-cols-8 gap-8">
      <div className="relative col-span-2">
        <div className="sticky top-28">
          <h1 className="mb-4 text-xl font-bold">Filter</h1>
          <div className="bg-accent rounded-lg p-6">
            <ul className="space-y-3">
              {filterCategories.map((category: string, index: number) => {
                return (
                  <li
                    key={index}
                    className={`hover:bg-primary rounded font-bold hover:bg-opacity-80  ${filter === category.toLowerCase() ? "bg-primary " : "null"}`}
                  >
                    <Button
                      onClick={() => handleFilterChange(category.toLowerCase())}
                      variant="link"
                      size="lg"
                      className={`block w-full px-4 py-2 text-left text-lg font-bold text-white hover:text-black hover:no-underline ${filter === category.toLowerCase() ? "text-black " : "null"}`}
                    >
                      {category}
                    </Button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
      <div className="col-span-6">
        <Separator className="mt-4 bg-white" />
        <div className="mt-8">
          <div className="flex justify-between">
            <h2 className="text-3xl font-bold">
              Search results for {`"${query}"`}
            </h2>
          </div>
          <div className="mt-8 space-y-4">
            {results && results.length === 0 && <p>No results found</p>}

            {filter === "users" &&
              results &&
              results.map((result: any) => {
                return (
                  <div key={result.id} className="my-2 flex items-center gap-3">
                    <div className="relative h-16 w-16 rounded-full bg-stone-700">
                      <Image
                        src={result.profilePictureURL}
                        alt={result.username}
                        fill={true}
                        objectFit="cover"
                        className="border-primary rounded-full border-2"
                      />
                    </div>
                    <div className="text-lg font-bold">{result.username}</div>
                  </div>
                );
              })}

            {filter !== "users" &&
              results &&
              results.map((result: any) => {
                const mediaType = result.media_type === "movie" ? "film" : "tv";
                const release = result.first_air_date || result.release_date;
                return (
                  <div key={result.id} className="grid grid-cols-12 gap-x-3">
                    <div>
                      <MovieCard
                        mediaType={mediaType}
                        userActivity={[]}
                        title={result.name || result.title}
                        id={result.id}
                        rating={-1}
                        src={MOVIE_DB_IMG_PATH_PREFIX + result.poster_path}
                        alt={result.name || result.title}
                        activityActionsOff
                      />
                    </div>
                    <div className="col-span-11 flex flex-col justify-center">
                      <h2 className="text-2xl font-bold">
                        {result.name || result.title}
                      </h2>
                      {release && <h3>({release.split("-")[0]})</h3>}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        {searchResults.all.length !== 0 && (
          <div>
            <SearchPagination currentPage={page} totalPages={totalPages} />
          </div>
        )}
      </div>
    </div>
  );
}
