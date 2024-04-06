import { useState } from "react";
import {
  Command,
  CommandItem,
  CommandInput,
  CommandList,
  CommandGroup,
} from "./command";
import { useQuery } from "@tanstack/react-query";
import { fetchMediaByQuery } from "@/lib/moviedb-actions";
import { useDebounce } from "use-debounce";

interface SearchCommandProps {
  selectedResult?: number;
  onSelectResult: (mediaId: number, mediaType: string) => void;
}

export default function SearchCommand({
  onSelectResult,
  selectedResult,
}: SearchCommandProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Command shouldFilter={false}>
      <CommandInput
        className="text-white"
        value={searchQuery}
        onValueChange={setSearchQuery}
        placeholder="Enter your search"
      />
      <SearchResults query={searchQuery} onSelectResult={onSelectResult} />
    </Command>
  );
}

interface SearchResultsProps {
  query: string;
  onSelectResult: SearchCommandProps["onSelectResult"];
}

function SearchResults({ query, onSelectResult }: SearchResultsProps) {
  const [debouncedSearchQuery] = useDebounce(query, 500);

  const { data, isLoading, error } = useQuery({
    queryKey: ["search", debouncedSearchQuery],
    queryFn: async () => {
      if (!debouncedSearchQuery) return [];
      const response = await fetchMediaByQuery(debouncedSearchQuery, 1);
      if (!response) return [];
      const results = response.results.filter(
        (result: any) => result.media_type !== "person",
      );

      return results;
    },
  });

  return (
    <CommandList>
      <CommandGroup>
        {isLoading && <CommandItem>Loading...</CommandItem>}
        {data?.length === 0 && <CommandItem>No results found.</CommandItem>}
        {data?.map((result: any) => {
          const isAnime =
            result.media_type === "tv" &&
            result.origin_country &&
            result.origin_country.includes("JP") &&
            result.genre_ids.includes(16);
          const mediaType =
            result.media_type === "movie" ? "Film" : isAnime ? "Anime" : "TV";
          const release = result.first_air_date || result.release_date;
          return (
            <CommandItem
              key={result.id}
              onSelect={() => onSelectResult(result.id, result.media_type)}
              className="cursor-pointer"
            >
              <div>
                {result.title || result.name}
                {release ? ` (${release.split("-")[0]})` : ""}
                <b> {mediaType}</b>
              </div>
            </CommandItem>
          );
        })}
      </CommandGroup>
    </CommandList>
  );
}
