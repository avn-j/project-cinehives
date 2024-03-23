"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { reviewSchema } from "@/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Media } from "@prisma/client";
import Image from "next/image";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaHeart, FaRegHeart, FaRegStar, FaStar } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createNewMediaReview } from "@/lib/db-actions";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

interface ReviewDialogProps {
  media: Media;
  children: React.ReactNode;
  watched: boolean;
}

export default function ReviewDialog({ ...props }: ReviewDialogProps) {
  const [liked, setLiked] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      review: "",
      rewatched: false,
      spoilers: false,
    },
  });

  useEffect(() => {
    form.setValue("rewatched", props.watched);
  }, []);

  function handleLikeToggle() {
    setLiked(!liked);
  }

  function handleRating(rating: number) {
    setRating(rating);
  }

  async function handleSubmit(values: z.infer<typeof reviewSchema>) {
    setLoading(true);

    const response = await createNewMediaReview(
      values,
      props.media,
      rating,
      liked,
    );

    setLoading(false);

    if (response) {
      setLiked(false);
      form.reset();
      setOpenModal(false);
      toast.success("Your review has been been posted.");
    } else {
      toast.error("Your review could not be posted. Please try again.");
    }
  }

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="bg-black sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Review for {props.media.title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 grid grid-cols-3">
          <Image
            src={props.media.posterPath}
            alt={props.media.title}
            width={150}
            height={150}
            className="col-span-1"
          />
          <div className="col-span-2">
            <div className="flex w-2/3 items-start justify-between">
              <div>
                <p className="mb-1">Rating</p>
                <StarRating handleRating={handleRating} />
              </div>
              <div className="flex flex-col items-center">
                <p className="mb-1">Like</p>
                <button onClick={handleLikeToggle}>
                  {liked ? (
                    <FaHeart size={25} className="text-red-500" />
                  ) : (
                    <FaRegHeart size={25} className="text-stone-600" />
                  )}
                </button>
              </div>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-8">
                <FormField
                  control={form.control}
                  name="review"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel className="text-base">Review</FormLabel>
                        <FormControl>
                          <Textarea
                            className="max-h-[300px] border-stone-600 bg-black focus-visible:ring-0 focus-visible:ring-offset-0"
                            placeholder="Write your review..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="spoilers"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <div className="mt-4 flex items-center gap-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="bg-stone-700"
                            />
                          </FormControl>
                          <FormLabel className="text-sm">
                            Contains spoilers
                          </FormLabel>
                        </div>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="rewatched"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <div className="mt-4 flex items-center gap-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="bg-stone-700"
                            />
                          </FormControl>
                          <FormLabel className="text-sm">
                            Watched this film before
                          </FormLabel>
                        </div>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    );
                  }}
                />

                <DialogFooter className="mt-4">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      className="bg-secondary mt-6 text-stone-950"
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    className="mt-6 text-stone-950"
                    disabled={loading}
                  >
                    Post review
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function StarRating({
  ...props
}: {
  handleRating: Function;
  initialRating?: number;
}) {
  const [activeStar, setActiveStar] = useState(props.initialRating || -1);
  const [hoverActiveStar, setHoverActiveStar] = useState(-1);
  const [isHovered, setIsHovered] = useState(false);
  const totalStars = 5;
  const precision = 0.5;

  const ratingContainerRef = useRef<HTMLDivElement | null>(null);

  function handleClear(e: MouseEvent) {
    setActiveStar(-1);
    setHoverActiveStar(-1);
    props.handleRating(null);
  }

  function handleClick(e: MouseEvent) {
    const rating = calculateRating(e);

    if (rating === activeStar) return;

    setActiveStar(rating);
    props.handleRating(rating);
  }

  const calculateRating = (e: MouseEvent) => {
    if (!ratingContainerRef.current) return 0;
    const { width, left } = ratingContainerRef.current.getBoundingClientRect();
    let percent = (e.clientX - left) / width;
    const numberInStars = percent * totalStars;
    const nearestNumber =
      Math.round((numberInStars + precision / 2) / precision) * precision;
    return Number(
      nearestNumber.toFixed(precision.toString().split(".")[1]?.length || 0),
    );
  };

  function handleMouseMove(event: MouseEvent) {
    setIsHovered(true);
    setHoverActiveStar(calculateRating(event));
  }

  function handleMouseLeave(event: MouseEvent) {
    setHoverActiveStar(-1); // Reset to default state
    setIsHovered(false);
  }
  return (
    <div className="flex items-center gap-2">
      <div
        className="relative flex cursor-pointer items-center justify-center gap-1"
        onClick={(e) => {
          handleClick(e);
        }}
        ref={ratingContainerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {[...new Array(totalStars)].map((star, index) => {
          const activeState = isHovered ? hoverActiveStar : activeStar;

          const showEmptyIcon = activeState === -1 || activeState < index + 1;

          const isActiveRating = activeState !== 1;
          const isRatingWithPrecision = activeState % 1 !== 0;
          const isRatingEqualToIndex = Math.ceil(activeState) === index + 1;
          const showRatingWithPrecision =
            isActiveRating && isRatingWithPrecision && isRatingEqualToIndex;

          const starWidth = showRatingWithPrecision
            ? `${(activeState % 1) * 100}%`
            : "0%";

          return (
            <div key={index} className="relative">
              <div
                className="absolute overflow-hidden"
                style={{ width: `${starWidth}` }}
              >
                <FaStar size={25} className="text-primary" />
              </div>
              <div className="">
                {showEmptyIcon ? (
                  <FaRegStar size={25} className="text-stone-700" />
                ) : (
                  <FaStar size={25} className="text-primary" />
                )}
              </div>
            </div>
          );
        })}
      </div>
      {activeStar > -1 && (
        <FaXmark
          size={17.5}
          className="cursor-pointer text-stone-400"
          onClick={handleClear}
        />
      )}
    </div>
  );
}
