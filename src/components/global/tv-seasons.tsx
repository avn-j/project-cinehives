"use client";
import { MOVIE_DB_IMG_PATH_PREFIX } from "@/lib/consts";
import Image from "next/image";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "../ui/button";

interface TVSeasonsProps {
  seasons: any[];
}

export default function TVSeasons({ seasons }: TVSeasonsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const visibleSeasons = seasons.slice(0, 2);
  const hiddenSeasons = seasons.slice(2, seasons.length - 1);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      {visibleSeasons.map((season: any) => {
        return (
          <div className="my-4 flex items-center gap-4" key={season.id}>
            <Image
              src={MOVIE_DB_IMG_PATH_PREFIX + season.poster_path}
              alt={season.name}
              width={75}
              height={75}
              className="rounded border-2 border-green-50 border-opacity-15 object-cover"
            />
            <h3>{season.name}</h3>
          </div>
        );
      })}
      <CollapsibleContent>
        {hiddenSeasons.map((season: any) => {
          return (
            <div className="my-4 flex items-center gap-4" key={season.id}>
              <Image
                src={MOVIE_DB_IMG_PATH_PREFIX + season.poster_path}
                alt={season.name}
                width={75}
                height={75}
                className="rounded border-2 border-green-50 border-opacity-15 object-cover"
              />
              <h3>{season.name}</h3>
            </div>
          );
        })}
      </CollapsibleContent>
      <CollapsibleTrigger asChild>
        {seasons.length > 2 && (
          <Button variant="outline">{isOpen ? "Show less" : "Show all"}</Button>
        )}
      </CollapsibleTrigger>
    </Collapsible>
  );
}
