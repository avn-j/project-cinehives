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
import SearchContainer from "@/components/global/search-container";

interface SearchPageProps {
  params: {
    query: string;
  };
  searchParams: {
    page: string;
    type: string;
  };
}

async function searchUsers(searchQuery: string) {
  const data = await prisma.profile.findMany({
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
  });

  // const flooredTotalPages = Math.floor(data.length / 20);
  // const totalPages =
  //   flooredTotalPages === 1 || flooredTotalPages === 0
  //     ? 1
  //     : flooredTotalPages - 1;

  return data;
}

async function buildSearchData(searchQuery: string) {
  const allSearchItems = [];
  let searchPage = 1;

  for (let i = allSearchItems.length; i < 1000; ) {
    const searchResponse = await fetchMediaByQuery(searchQuery, searchPage);
    allSearchItems.push(...searchResponse.results);
    if (searchPage === searchResponse.total_pages) break;
    searchPage++;
    i += allSearchItems.length;
  }

  const filmResults = allSearchItems.filter(
    (result) => result.media_type === "movie",
  );

  const tvResults = allSearchItems.filter(
    (result) =>
      result.media_type === "tv" &&
      !(
        result.origin_country &&
        result.origin_country.includes("JP") &&
        result.genre_ids.includes(16)
      ),
  );

  const animeResults = allSearchItems.filter(
    (result) =>
      result.media_type === "tv" &&
      result.origin_country &&
      result.origin_country.includes("JP") &&
      result.genre_ids.includes(16),
  );

  const userResults = await searchUsers(searchQuery);

  // const flooredTotalPages = Math.floor(allSearchItems.length / 20);
  // const totalPages =
  //   flooredTotalPages === 1 || flooredTotalPages === 0
  //     ? 1
  //     : flooredTotalPages - 1;
  // let slicedIndexStart = 0;
  // let slicedIndexEnd = 20;

  // if (currentPage > 1) {
  //   slicedIndexStart = currentPage * 20;
  //   slicedIndexEnd = slicedIndexStart + 20;
  // }

  // const slicedSearchResults = allSearchItems.slice(
  //   slicedIndexStart,
  //   slicedIndexEnd,
  // );

  return {
    all: allSearchItems,
    tv: tvResults,
    films: filmResults,
    anime: animeResults,
    users: userResults,
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

  const results = await buildSearchData(searchQuery);

  return (
    <>
      <Navbar />

      <div className="pt-36">
        <Section>
          <h1 className="mb-1 text-3xl font-bold">Search</h1>
          <p className="mb-12 text-xl">Find what you are looking for</p>
          <SearchBox />
          <SearchContainer
            filterType={filterType}
            searchResults={results}
            query={searchQuery}
            page={currentPage}
          />
        </Section>
      </div>
    </>
  );
}
