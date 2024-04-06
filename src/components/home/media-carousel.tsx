import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MediaDataWithUserActivity } from "@/lib/types";
import MovieCard from "@/components/global/movie-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface MediaCarouselProps {
  medias: any[];
  carouselTitle: string;
  seeAllLink: string;
}

export default function MediaCarousel({
  medias,
  carouselTitle,
  seeAllLink,
}: MediaCarouselProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="montserrat-test text-xl font-light">{carouselTitle}</h3>
        <Button variant="link" className="text-base">
          <Link href={seeAllLink}> SEE ALL </Link>
        </Button>
      </div>
      <Separator className="mb-4 mt-2 bg-stone-500" />
      <Carousel opts={{ loop: true, slidesToScroll: 5 }}>
        <CarouselContent>
          {medias.map((media: MediaDataWithUserActivity) => {
            return (
              <CarouselItem key={media.apiId} className="basis-1/5">
                <MovieCard
                  media={{
                    apiId: media.apiId,
                    mediaType: media.mediaType,
                    posterPath: media.posterPath,
                    title: media.title,
                  }}
                  rating={media.rating}
                  userActivity={media.userActivity}
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
