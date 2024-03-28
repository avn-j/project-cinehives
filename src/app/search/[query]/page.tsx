import Section from "@/components/global/layout/section";
import Navbar from "@/components/global/navbar";
import { Separator } from "@/components/ui/separator";

import SearchBox from "@/components/global/searchbox";
import { fetchMediaByQuery } from "@/lib/moviedb-actions";
import MovieCard from "@/components/global/movie-card";
import { MOVIE_DB_IMG_PATH_PREFIX } from "@/lib/consts";
import SearchPagination from "@/components/global/search-pagination";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "../../../../prisma/client";
import Image from "next/image";
import { getUser, getUserProfile } from "@/lib/authentication-functions";

interface SearchPageProps {
  params: {
    query: string;
  };
  searchParams: {
    page: string;
    type: string;
  };
}

async function searchUsers(searchQuery: string, page: number) {
  const skip = (page - 1) * 20;

  const data = await prisma.profile.findMany({
    take: 20,
    where: {
      username: {
        startsWith: `%${searchQuery}%`,
        mode: "insensitive",
      },
    },
    select: {
      username: true,
      profilePictureURL: true,
      id: true,
    },
    skip: skip,
  });

  const flooredTotalPages = Math.floor(data.length / 20);
  const totalPages =
    flooredTotalPages === 1 || flooredTotalPages === 0
      ? 1
      : flooredTotalPages - 1;

  return {
    results: data,
    total_pages: totalPages,
  };
}

async function buildSearchData(
  searchQuery: string,
  filterType: string,
  currentPage: number,
) {
  const allSearchItems = [];
  let searchPage = 1;

  for (let i = allSearchItems.length; i < 1000; ) {
    const searchResponse = await fetchMediaByQuery(searchQuery, searchPage);
    const results = searchResponse.results.filter((result: any) => {
      const isAnime =
        result.origin_country &&
        result.origin_country.includes("JP") &&
        result.genre_ids.includes(16);

      if (filterType === "films") return result.media_type === "movie";

      if (filterType === "tv shows")
        return result.media_type === "tv" && !isAnime;

      if (filterType === "anime") return result.media_type === "tv" && isAnime;
      else return result.media_type !== "person";
    });

    allSearchItems.push(...results);

    if (searchPage === searchResponse.total_pages) break;

    searchPage++;
    i += allSearchItems.length;
  }

  const flooredTotalPages = Math.floor(allSearchItems.length / 20);
  const totalPages =
    flooredTotalPages === 1 || flooredTotalPages === 0
      ? 1
      : flooredTotalPages - 1;
  let slicedIndexStart = 0;
  let slicedIndexEnd = 20;

  if (currentPage > 1) {
    slicedIndexStart = currentPage * 20;
    slicedIndexEnd = slicedIndexStart + 20;
  }

  const slicedSearchResults = allSearchItems.slice(
    slicedIndexStart,
    slicedIndexEnd,
  );

  return {
    results: slicedSearchResults,
    total_pages: totalPages,
  };
}

export default async function SearchPage({
  params,
  searchParams,
}: SearchPageProps) {
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;
  const searchQuery = params.query.replaceAll("%2B", " ");
  const filterType = searchParams.type ? searchParams.type : "all";

  const user = await getUser();
  const profile = await getUserProfile(user);
  if (user && !profile) redirect("/account/setup");

  let searchData: { results: any[]; total_pages: number } = {
    results: [],
    total_pages: 0,
  };

  if (filterType !== "users") {
    searchData = await buildSearchData(searchQuery, filterType, currentPage);
  } else {
    searchData = await searchUsers(searchQuery, currentPage);
  }

  const results = searchData.results;

  const totalPages = searchData.total_pages > 10 ? 10 : searchData.total_pages;
  const filterCategories = ["All", "Films", "TV Shows", "Anime", "Users"];
  return (
    <>
      <Navbar />

      <div className="pt-36">
        <Section>
          <h1 className="mb-1 text-3xl font-bold">Search</h1>
          <p className="mb-12 text-xl">Find what you are looking for</p>
          <div className="grid grid-cols-8 gap-8">
            <div className="relative col-span-2">
              <div className="sticky top-28">
                <h1 className="mb-4 text-xl font-bold">Filter</h1>
                <div className="bg-accent rounded-lg p-6">
                  <ul className="space-y-3">
                    {filterCategories.map((category: String, index: number) => {
                      return (
                        <li
                          key={index}
                          className={`hover:bg-primary rounded font-bold hover:bg-opacity-80 hover:text-black ${filterType === category.toLowerCase() ? "bg-primary  text-black" : "null"}`}
                        >
                          <Link
                            className="block w-full px-4 py-2 "
                            href={`?type=${category.toLowerCase()}`}
                          >
                            {category}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-span-6">
              <SearchBox />
              <Separator className="mt-4 bg-white" />
              <div className="mt-8">
                <div className="flex justify-between">
                  <h2 className="text-3xl font-bold">
                    Search results for {`"${searchQuery}"`}
                  </h2>
                </div>
                <div className="mt-8 space-y-4">
                  {results.length === 0 && <p>No results found</p>}

                  {filterType === "users" &&
                    results.map((result: any) => {
                      return (
                        <div
                          key={result.id}
                          className="my-2 flex items-center gap-3"
                        >
                          <div className="relative h-16 w-16 rounded-full bg-stone-700">
                            <Image
                              src={result.profilePictureURL}
                              alt={result.username}
                              fill={true}
                              objectFit="cover"
                              className="border-primary rounded-full border-2"
                            />
                          </div>
                          <div className="text-lg font-bold">
                            {result.username}
                          </div>
                        </div>
                      );
                    })}

                  {filterType !== "users" &&
                    results.map((result: any) => {
                      const mediaType =
                        result.media_type === "movie" ? "film" : "tv";
                      const release =
                        result.first_air_date || result.release_date;
                      return (
                        <div
                          key={result.id}
                          className="grid grid-cols-12 gap-x-3"
                        >
                          <div>
                            <MovieCard
                              mediaType={mediaType}
                              userActivity={[]}
                              title={result.name || result.title}
                              id={result.id}
                              rating={-1}
                              src={
                                MOVIE_DB_IMG_PATH_PREFIX + result.poster_path
                              }
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
              {results.length !== 0 && (
                <div>
                  <SearchPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                  />
                </div>
              )}
            </div>
          </div>
        </Section>
      </div>
    </>
  );
}
