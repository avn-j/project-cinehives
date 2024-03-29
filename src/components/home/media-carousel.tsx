import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Media } from "@/lib/types";
import MovieCard from "@/components/global/movie-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MediaType } from "@prisma/client";
import Link from "next/link";

interface MediaCarouselProps {
  mediaCollection: Media[];
  carouselTitle: string;
  mediaType: MediaType;
  seeAllLink: string;
}

export default function MediaCarousel({ ...props }: MediaCarouselProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="montserrat-test text-xl font-light">
          {props.carouselTitle}
        </h3>
        <Button variant="link" className="text-base">
          <Link href={props.seeAllLink}> SEE ALL </Link>
        </Button>
      </div>
      <Separator className="mb-4 mt-2 bg-stone-500" />
      <Carousel opts={{ loop: true, slidesToScroll: 5 }}>
        <CarouselContent>
          {props.mediaCollection.map((media: Media) => {
            return (
              <CarouselItem key={media.id} className="basis-1/5">
                <MovieCard
                  title={media.title}
                  id={media.id}
                  alt={media.title}
                  src={media.posterPath}
                  rating={media.rating}
                  userActivity={media.userActivity}
                  mediaType={props.mediaType}
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </>
  );
}
