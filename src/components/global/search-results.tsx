import { fetchMediaByQuery } from "@/lib/moviedb-actions";
import prisma from "../../../prisma/client";
import SearchContainer from "./search-container";

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

  return data;
}

async function buildSearchData(searchQuery: string) {
  const allSearchItems = [];
  let searchPage = 1;

  for (let i = allSearchItems.length; i < 1000; ) {
    const searchResponse = await fetchMediaByQuery(searchQuery, searchPage);
    const filteredSearchResponse = searchResponse.results.filter(
      (result: any) => result.media_type !== "person",
    );
    allSearchItems.push(...filteredSearchResponse);
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

  return {
    all: allSearchItems,
    tv: tvResults,
    films: filmResults,
    anime: animeResults,
    users: userResults,
  };
}

interface SearchResultsProps {
  query: string;
  filterType: string;
  page: number;
}

export default async function SearchResults({
  query,
  filterType,
  page,
}: SearchResultsProps) {
  const results = await buildSearchData(query);
  return (
    <>
      <SearchContainer
        filterType={filterType}
        searchResults={results}
        page={page}
      />
    </>
  );
}
