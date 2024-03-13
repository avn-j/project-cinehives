"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { BannerMedia } from "@/lib/types";
import Image from "next/image";
import { FaStar } from "react-icons/fa6";
import Autoplay from "embla-carousel-autoplay";

interface FeaturedCarouselProps {
  // TO-DO: Add type
  mediaCollection: BannerMedia[];
  carouselTitle: string;
}

export default function FeaturedCarousel({ ...props }: FeaturedCarouselProps) {
  return (
    <div className="pt-28">
      <Carousel opts={{ loop: true }} plugins={[Autoplay({ delay: 10000 })]}>
        <CarouselContent>
          {props.mediaCollection.map((media: BannerMedia) => {
            const releaseYear = media.releaseDate.split("-")[0];

            return (
              <CarouselItem key={media.id}>
                <div className="relative min-h-[700px]">
                  <div className="container relative min-h-[650px]">
                    <div className="absolute bottom-0 left-0 px-8 py-8">
                      <div className="py-6 text-3xl font-bold uppercase drop-shadow">
                        <p>FEATURED FILMS</p>
                      </div>
                      <h3 className="text-3xl font-bold uppercase drop-shadow">
                        {releaseYear}
                      </h3>
                      <h2 className="text-6xl font-black drop-shadow">
                        {media.title}
                      </h2>
                    </div>
                  </div>

                  <Image
                    src={media.backdropPath}
                    layout="fill"
                    className="-z-10 object-cover object-top"
                    alt="Banner"
                  />
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
