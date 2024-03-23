"use client";

import { FaArrowLeft, FaArrowRight, FaHeart } from "react-icons/fa";
import {
  Carousel,
  CarouselContent,
  CarouselApi,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Image from "next/image";
import { MOVIE_DB_IMG_PATH_PREFIX } from "@/lib/consts";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface CastCarouselProps {
  cast: any[];
}

export default function CastCarousel({ cast }: CastCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [canGoNext, setCanGoNext] = useState(true);
  const [canGoPrev, setCanGoPrev] = useState(false);

  useEffect(() => {
    if (!api) return;

    api.on("scroll", () => {
      setCanGoNext(api.canScrollNext());
      setCanGoPrev(api.canScrollPrev());
    });
  }, [api]);

  function handlePrev() {
    api?.scrollPrev();
  }

  function handleNext() {
    api?.scrollNext();
  }

  return (
    <Carousel
      opts={{ slidesToScroll: 4 }}
      className="mx-auto w-auto"
      setApi={setApi}
    >
      <CarouselContent>
        {cast.slice(0, 20).map((person: any, index: number) => {
          return (
            <CarouselItem key={index} className="basis-1/6">
              <Image
                alt={person.name}
                src={MOVIE_DB_IMG_PATH_PREFIX + person.profile_path}
                height={200}
                width={200}
                className="rounded border-2 border-green-50 border-opacity-15 object-cover"
              />
              <p className="mt-2 text-center text-xs font-bold">
                {person.name}
              </p>
              <p className="text-center text-xs">
                {person.characters ? person.characters[0] : person.character}
              </p>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <div className="mt-4 flex justify-end gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full border"
          disabled={!canGoPrev}
          onClick={handlePrev}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Previous slide</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full border"
          disabled={!canGoNext}
          onClick={handleNext}
        >
          <ArrowRight className="h-4 w-4" />
          <span className="sr-only">Next slide</span>
        </Button>
      </div>
    </Carousel>
  );
}
