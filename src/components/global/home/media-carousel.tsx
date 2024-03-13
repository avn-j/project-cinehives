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

interface MediaCarouselProps {
  mediaCollection: Media[];
  carouselTitle: string;
}

export default function MediaCarousel({ ...props }: MediaCarouselProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">{props.carouselTitle}</h3>
        <Button variant="link" className="text-lg">
          SEE ALL
        </Button>
      </div>
      <Separator className="mb-4 mt-2 bg-stone-500" />
      <Carousel opts={{ loop: true, slidesToScroll: 1 }}>
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
